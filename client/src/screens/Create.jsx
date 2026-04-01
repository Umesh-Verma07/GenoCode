import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function CreateProblem() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('Easy');
  const [testCases, setTestCases] = useState([{ input: '', output: '' }]);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChangeCase = (idx, field, value) => {
    const updated = [...testCases];
    updated[idx][field] = value;
    setTestCases(updated);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', output: '' }]);
  };

  const removeTestCase = (idx) => {
    setTestCases(testCases.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowError(true);
    
    const problemData = { title, description, level, testCases, email: localStorage.getItem('email') };
    try {
      const response = await fetch(`${SERVER_URL}/problem/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : localStorage.getItem("authToken")
        },
        body: JSON.stringify(problemData),
      });
      
      const json = await response.json();
      if (!json.success){
        throw new Error(json.error);
      }
      
      // Redirect back to where the user came from
      const from = location.state?.from || '/practice';
      navigate(from);
    } catch (e) {
      console.error(e);
      setError(e.message);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow w-full max-w-6xl mx-auto navbar-spacing px-4 pb-10">
        <section className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 dark:from-slate-950 dark:via-[#111936] dark:to-[#1a2856] text-white shadow-2xl mb-6 border border-white/10">
          <h1 className="text-2xl sm:text-3xl font-bold">Create New Problem</h1>
          <p className="text-white/80 mt-2">Add a clean statement, difficulty, and reliable test cases.</p>
        </section>

        <div className="max-w-4xl mx-auto glass-card rounded-3xl p-6 sm:p-8 border border-primary-100 dark:border-indigo-200/20">

          <ErrorAlert 
            error={error} 
            show={showError} 
            onClose={() => setShowError(false)}
            className="mb-4"
          />

          <form onSubmit={handleSubmit} className="space-y-6 text-primary-900 dark:text-slate-100">
            <div>
              <label className="block mb-2 text-sm font-semibold">Title</label>
              <input type="text" className="w-full border border-primary-200 dark:border-indigo-200/20 bg-white/70 dark:bg-slate-900/75 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold">Description</label>
              <textarea className="w-full border border-primary-200 dark:border-indigo-200/20 bg-white/70 dark:bg-slate-900/75 rounded-xl px-3 py-2.5 h-40 focus:outline-none focus:ring-2 focus:ring-primary-500" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold">Difficulty Level</label>
              <select className="w-full border border-primary-200 dark:border-indigo-200/20 bg-white/70 dark:bg-slate-900/75 rounded-xl px-3 py-2.5" value={level} onChange={(e) => setLevel(e.target.value)} >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div className="space-y-4 rounded-2xl border border-primary-100 dark:border-indigo-200/20 p-4 bg-white/50 dark:bg-slate-900/45">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Test Cases</h2>
                <button type="button" onClick={addTestCase} className="text-sm font-semibold text-primary-700 dark:text-indigo-300 hover:underline">+ Add Case</button>
              </div>

              {testCases.map((tc, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end rounded-xl border border-primary-100 dark:border-indigo-200/20 p-3 bg-white/70 dark:bg-slate-900/60" >
                  <div className="sm:col-span-2">
                    <label className="block mb-1 text-sm font-medium">Input</label>
                    <textarea cols="10" className="w-full border border-primary-200 dark:border-indigo-200/20 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-900" value={tc.input} onChange={(e) => handleChangeCase(idx, 'input', e.target.value)} required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block mb-1 text-sm font-medium">Output</label>
                    <textarea className="w-full border border-primary-200 dark:border-indigo-200/20 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-900" value={tc.output} onChange={(e) => handleChangeCase(idx, 'output', e.target.value)} required/>
                  </div>
                  <div className="sm:col-span-2 text-right">
                    <button type="button" onClick={() => removeTestCase(idx)} className="text-red-600 dark:text-rose-300 hover:underline text-sm font-medium" >Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary-700 text-white py-3 rounded-xl hover:bg-primary-800 transition flex items-center justify-center disabled:opacity-50 font-semibold" 
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span className="ml-2">Creating Problem...</span>
                </>
              ) : (
                "Create Problem"
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
