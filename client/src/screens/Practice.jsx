import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import LoadingSkeleton from '../components/LoadingSkeleton'
import EmptyState from '../components/EmptyState'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const PAGE_SIZE = 15;

export default function Practice() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setQuery(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    async function fetchProblem() {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
          level: filter,
          search: query,
          sort: 'newest',
        });
        const response = await fetch(`${SERVER_URL}/problem/list?${params.toString()}`);
        const data = await response.json();
        if (!data.success) throw new Error('Failed to fetch problems');
        setProblems(data.problem || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError(err.message);
        setShowError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProblem();
  }, [page, filter, query]);

  useEffect(() => { setPage(1) }, [filter, query]);

  const getDiff = (level) => {
    if (level === 'Easy') return "text-emerald-700 bg-emerald-100 border-emerald-200";
    if (level === 'Medium') return "text-amber-700 bg-amber-100 border-amber-200";
    return "text-rose-700 bg-rose-100 border-rose-200";
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow px-4 sm:px-6 navbar-spacing pb-10">
        <div className="w-full max-w-6xl mx-auto">
          <section className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white shadow-2xl mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold">Practice Problems</h1>
            <p className="text-white/80 mt-2 max-w-2xl">
              Pick a difficulty, search instantly, and jump straight into solving.
            </p>
          </section>

          <ErrorAlert 
            error={error} 
            show={showError} 
            onClose={() => setShowError(false)}
            className="mb-4"
          />

          <section className="glass-card rounded-2xl p-4 sm:p-5 mb-5">
            <div className="flex flex-wrap justify-center gap-2 mb-4">
            {["All", "Easy", "Medium", "Hard"].map(level => (
              <button
                key={level}
                className={`
                  px-4 py-2 rounded-full text-sm font-semibold transition border
                  ${filter === level ? (
                    level === "Easy" ? "bg-emerald-500 text-white border-emerald-500 shadow" :
                      level === "Medium" ? "bg-amber-500 text-white border-amber-500 shadow" :
                        level === "Hard" ? "bg-rose-500 text-white border-rose-500 shadow" :
                          "bg-primary-600 text-white border-primary-600 shadow"
                  ) : "bg-white dark:bg-slate-900 text-primary-800 dark:text-slate-200 border-primary-100 dark:border-indigo-200/20 hover:bg-primary-50 dark:hover:bg-slate-800"}
                `}
                onClick={() => setFilter(level)}
              >{level}</button>
            ))}
            </div>

            <div className="flex items-center bg-white/80 dark:bg-slate-900/80 rounded-xl px-4 py-3 w-full max-w-xl mx-auto border border-primary-100 dark:border-indigo-200/20 shadow-sm">
              <FaSearch className="text-primary-500 mr-3" />
              <input
                className="flex-1 outline-none bg-transparent text-primary-900 dark:text-slate-100 placeholder:text-primary-700/60 dark:placeholder:text-slate-400"
                type="text"
                placeholder="Search problems by title..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </section>

          <div className="soft-surface rounded-2xl overflow-hidden mb-6 border border-primary-100 dark:border-indigo-200/20">
            <div className="bg-primary-50 dark:bg-slate-900 text-sm text-primary-800/80 dark:text-slate-300 font-semibold px-3 py-3 grid grid-cols-[60px_1fr_110px]">
              <div className="text-center">#</div>
              <div className="pl-2">Title</div>
              <div className="text-right pr-2">Level</div>
            </div>
            {loading && (
              <div className="bg-white/80 dark:bg-slate-900/70 p-6">
                <LoadingSkeleton type="table" count={1} />
              </div>
            )}
            {problems.length === 0 && !loading && !error && (
              <div className="bg-white/80 dark:bg-slate-900/70">
                <EmptyState 
                  type="problems"
                  title="No problems found"
                  description="Try adjusting your search or filter criteria."
                />
              </div>
            )}
            {problems.map((p, idx) => (
              <div
                key={p._id}
                onClick={() => navigate(`/problem/${p._id}`)}
                className={`
                  grid grid-cols-[60px_1fr_110px] items-center py-3 px-3 bg-white/80 dark:bg-slate-900/65
                  hover:bg-primary-50/80 dark:hover:bg-slate-800/75 border-b border-primary-100 dark:border-indigo-200/10 transition-all cursor-pointer
                `}
                style={{ fontSize: "1rem" }}
              >
                <div className="text-center text-primary-800/70 dark:text-slate-400 font-semibold">{(page - 1) * PAGE_SIZE + idx + 1}.</div>
                <div className="pl-2 font-medium text-primary-900 dark:text-slate-100 hover:text-primary-700 dark:hover:text-indigo-300 transition truncate">
                  {p.title}
                </div>
                <div className="text-right pr-2">
                  <span className={`inline-flex border rounded-full px-2.5 py-1 text-xs font-semibold ${getDiff(p.level)}`}>
                    {p.level}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4 mb-8">
              <button
                className="px-3 py-1.5 rounded-lg bg-primary-100 dark:bg-slate-800 text-primary-800 dark:text-slate-200 font-semibold disabled:opacity-50"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >Prev</button>
              {[...Array(totalPages).keys()].map(num => (
                <button
                  key={num}
                  onClick={() => setPage(num + 1)}
                  className={`
                    px-3 py-1.5 rounded-lg font-semibold transition
                    ${page === num + 1 ? 'bg-primary-700 text-white shadow' : 'bg-white dark:bg-slate-900 text-primary-800 dark:text-slate-200 border border-primary-200 dark:border-indigo-200/20 hover:bg-primary-50 dark:hover:bg-slate-800'}
                  `}
                >{num + 1}</button>
              ))}
              <button
                className="px-3 py-1.5 rounded-lg bg-primary-100 dark:bg-slate-800 text-primary-800 dark:text-slate-200 font-semibold disabled:opacity-50"
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
