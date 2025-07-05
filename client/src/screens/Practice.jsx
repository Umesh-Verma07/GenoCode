import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const PAGE_SIZE = 15;

export default function Practice() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchProblem() {
      try {
        const response = await fetch(`${SERVER_URL}/problem/list`);
        const data = await response.json();
        if (!data.success) throw new Error('Failed to fetch problems');
        setProblems(data.problem || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProblem();
  }, []);

  const filteredProblems = problems.filter((p) =>
    (filter === 'All' || p.level === filter) &&
    p.title.toLowerCase().includes(query.toLowerCase())
  );
  const totalPages = Math.ceil(filteredProblems.length / PAGE_SIZE);
  const currentProblems = filteredProblems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1) }, [filter, query]);

  const getDiff = (level) => {
    if (level === 'Easy') return "text-green-500 font-semibold";
    if (level === 'Medium') return "text-yellow-500 font-semibold";
    return "text-red-500 font-semibold";
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16 px-1 sm:px-4 mt-10">
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-primary-700 mb-3 text-center">Practice Problems</h1>

          {/* Filter Tabs */}
          <div className="flex justify-center gap-2 mb-4">
            {["All", "Easy", "Medium", "Hard"].map(level => (
              <button
                key={level}
                className={`
                  px-4 py-1.5 rounded-full text-sm font-semibold transition
                  ${filter === level ? (
                    level === "Easy" ? "bg-green-500 text-white shadow" :
                      level === "Medium" ? "bg-yellow-400 text-white shadow" :
                        level === "Hard" ? "bg-red-500 text-white shadow" :
                          "bg-primary-600 text-white shadow"
                  ) : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-200"}
                `}
                onClick={() => setFilter(level)}
              >{level}</button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="flex items-center mb-5 bg-white rounded-lg shadow px-3 py-2 w-full max-w-lg mx-auto border border-gray-200">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              className="flex-1 outline-none bg-transparent text-gray-700"
              type="text"
              placeholder="Search problems..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Table Headers */}
          <div className="
            bg-gray-50 rounded-t-lg shadow text-sm text-gray-500 font-semibold
            px-2 py-2 grid
            grid-cols-[56px_1fr_90px]
            mb-0
          ">
            <div className="text-center">#</div>
            <div className="pl-2">Title</div>
            <div className="text-right pr-2">Level</div>
          </div>

          {/* Problems Table */}
          <div className="rounded-b-lg overflow-hidden shadow mb-6">
            {loading && <p className="text-center py-6 bg-white">Loading problems...</p>}
            {error && <p className="text-center text-red-600 bg-white py-6">Error: {error}</p>}
            {currentProblems.length === 0 && !loading && (
              <p className="text-center text-gray-400 bg-white py-6">No problems found.</p>
            )}
            {currentProblems.map((p, idx) => (
              <div
                key={p._id}
                onClick={() => navigate(`/problem/${p._id}`)}
                className={`
                  grid grid-cols-[56px_1fr_90px] items-center py-2.5 px-2 bg-white
                  hover:bg-gray-50 border-b border-gray-100 transition-all cursor-pointer
                `}
                style={{ fontSize: "1rem" }}
              >
                {/* Serial Number */}
                <div className="text-center text-gray-500 font-semibold">{(page - 1) * PAGE_SIZE + idx + 1}.</div>
                {/* Title */}
                <div className="pl-2 font-medium text-primary-800 hover:text-primary-600 hover:underline transition truncate">
                  {p.title}
                </div>
                {/* Level */}
                <div className={`text-right pr-2 ${getDiff(p.level)}`}>{p.level}</div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4 mb-8">
              <button
                className="px-3 py-1 rounded bg-primary-100 text-primary-800 font-semibold disabled:opacity-50"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >Prev</button>
              {[...Array(totalPages).keys()].map(num => (
                <button
                  key={num}
                  onClick={() => setPage(num + 1)}
                  className={`
                    px-3 py-1 rounded font-semibold transition
                    ${page === num + 1 ? 'bg-primary-600 text-white shadow' : 'bg-white text-gray-700 border border-gray-200 hover:bg-primary-50'}
                  `}
                >{num + 1}</button>
              ))}
              <button
                className="px-3 py-1 rounded bg-primary-100 text-primary-800 font-semibold disabled:opacity-50"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >Next</button>
            </div>
          )}

        </div>
      </main>
      <Footer/>
    </div>
  )
}
