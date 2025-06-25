import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function Home() {

  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProblem() {
      try {
        const response = await fetch(`${SERVER_URL}/problem/list`);
        const data = await response.json();
        if (!data.success) {
          throw new Error('Failed to fetch problems');
        }
        setProblems(data.problem || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProblem();
  }, []);

  return (
    <div>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow pt-20 p-6">
          <div className="w-full max-w-screen-lg mx-auto space-y-4">
            {loading && <p className="text-center">Loading problems...</p>}
            {error && <p className="text-center text-red-600">Error: {error}</p>}
            {problems.map((p, idx) => (
              <div key={idx} onClick={()=>{navigate(`/problem/${p._id}`)}} className="flex justify-between items-center bg-white p-4 rounded-lg shadow hover:shadow-md transition w-full">
                <span className="text-gray-800 font-medium">{p.title}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${p.level === 'Easy' ? 'bg-green-100 text-green-800' : p.level === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`} >{p.level}</span>
              </div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
