import Navbar from '../components/Navbar'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
const SERVER_URL = import.meta.env.VITE_SERVER_URL

export default function Register() {
  const [user, setUser] = useState({ name: "", email: "", password: "", username: "" });
  const [error, setError] = useState('')
  const [showError, setShowError] = useState(true)
  const [loading, setLoading] = useState(false)

  let navigate = useNavigate();
  const location = useLocation();

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowError(true);
    
    try {
      const response = await fetch(`${SERVER_URL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })

      const json = await response.json();
      if (!json.success) {
        throw new Error(json.error[0].msg);
      }
      // Redirect back to where the user came from, or to login if no redirect location
      const from = location.state?.from || '/login';
      navigate(from);
    } catch (err) {
      setError(err.message);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div><Navbar /></div>
      <section className="flex-grow flex items-start justify-center px-4 sm:px-6 py-10 navbar-spacing">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600 text-white p-8 sm:p-10 shadow-2xl">
            <p className="text-xs uppercase tracking-widest text-white/80">Get Started</p>
            <h1 className="text-4xl font-bold leading-tight mt-3">Create your coding identity.</h1>
            <p className="text-white/85 mt-4 leading-relaxed">
              Build your profile, solve consistently, and start climbing through practice and contests.
            </p>
            <div className="mt-8 space-y-3 text-sm text-white/90">
              <p>Track your progress</p>
              <p>Personalized profile</p>
              <p>Ready for competitive coding</p>
            </div>
          </div>

          <div className="lg:col-span-3 glass-card rounded-3xl p-6 sm:p-8">
            <ErrorAlert
              error={error}
              show={showError}
              onClose={() => setShowError(false)}
              className="mb-4"
            />
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-900 dark:text-slate-100">Create an account</h2>
            <p className="text-primary-900/70 dark:text-slate-300 mt-2 mb-6">Join GenoCode and start solving today.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-semibold text-primary-900 dark:text-slate-100">Name</label>
                <input type="text" name="name" onChange={onChange} className="bg-white/70 dark:bg-slate-900/80 border border-primary-200 dark:border-indigo-200/20 text-primary-900 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 block w-full p-3" placeholder="Enter your name" required />
              </div>
              <div>
                <label htmlFor="username" className="block mb-2 text-sm font-semibold text-primary-900 dark:text-slate-100">Username</label>
                <input type="text" name="username" onChange={onChange} className="bg-white/70 dark:bg-slate-900/80 border border-primary-200 dark:border-indigo-200/20 text-primary-900 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 block w-full p-3" placeholder="Enter a unique username" required />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-semibold text-primary-900 dark:text-slate-100">Email</label>
                <input type="email" name="email" onChange={onChange} className="bg-white/70 dark:bg-slate-900/80 border border-primary-200 dark:border-indigo-200/20 text-primary-900 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 block w-full p-3" placeholder="name@company.com" required />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-semibold text-primary-900 dark:text-slate-100">Password</label>
                <input type="password" name="password" onChange={onChange} placeholder="••••••••" className="bg-white/70 dark:bg-slate-900/80 border border-primary-200 dark:border-indigo-200/20 text-primary-900 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 block w-full p-3" required />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-primary-700 hover:bg-primary-800 font-semibold rounded-xl text-sm px-5 py-3 text-center flex items-center justify-center disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    <span className="ml-2">Creating account...</span>
                  </>
                ) : (
                  "Create an account"
                )}
              </button>
              <p className="text-sm text-primary-900/80 dark:text-slate-300">
                Already have an account? <Link to="/login" className="font-semibold text-primary-700 dark:text-indigo-300 hover:underline">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
