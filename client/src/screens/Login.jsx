import Navbar from '../components/Navbar'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import { jwtDecode } from 'jwt-decode'
import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
const SERVER_URL = import.meta.env.VITE_SERVER_URL

export default function Login() {

  const [user, setUser] = useState({ userId: "", password: "" });
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
      const response = await fetch(`${SERVER_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });

      const json = await response.json();
      if (!json.success) {
        throw new Error(json.error);
      }
      const token = jwtDecode(json.authToken);
      localStorage.setItem("email", token.email);
      localStorage.setItem("username", token.username);
      localStorage.setItem("isAdmin", token.isAdmin);
      localStorage.setItem("authToken", json.authToken)
      if(token.image){
        localStorage.setItem("userImage", token.image)
      }
      
      // Redirect back to where the user came from, or to home if no redirect location
      const from = location.state?.from || '/';
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
          <div className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white p-8 sm:p-10 shadow-2xl">
            <p className="text-xs uppercase tracking-widest text-white/70">Welcome Back</p>
            <h1 className="text-4xl font-bold leading-tight mt-3">Pick up where you left off.</h1>
            <p className="text-white/80 mt-4 leading-relaxed">
              Continue your coding streak, revisit solved problems, and keep your momentum strong.
            </p>
            <div className="mt-8 space-y-3 text-sm text-white/90">
              <p>Fast submissions</p>
              <p>Focused problem workflow</p>
              <p>Contest-ready environment</p>
            </div>
          </div>

          <div className="lg:col-span-3 glass-card rounded-3xl p-6 sm:p-8">
            <ErrorAlert
              error={error}
              show={showError}
              onClose={() => setShowError(false)}
              className="mb-4"
            />
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-900 dark:text-slate-100">Login to GenoCode</h2>
            <p className="text-primary-900/70 dark:text-slate-300 mt-2 mb-6">Use your username or email to continue.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="userId" className="block mb-2 text-sm font-semibold text-primary-900 dark:text-slate-100">Username or Email</label>
                <input
                  type="text"
                  name="userId"
                  onChange={onChange}
                  className="bg-white/70 dark:bg-slate-900/80 border border-primary-200 dark:border-indigo-200/20 text-primary-900 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 block w-full p-3"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-semibold text-primary-900 dark:text-slate-100">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={onChange}
                  placeholder="••••••••"
                  className="bg-white/70 dark:bg-slate-900/80 border border-primary-200 dark:border-indigo-200/20 text-primary-900 dark:text-slate-100 text-sm rounded-xl focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 block w-full p-3"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-primary-700 hover:bg-primary-800 font-semibold rounded-xl text-sm px-5 py-3 text-center flex items-center justify-center disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    <span className="ml-2">Logging in...</span>
                  </>
                ) : (
                  "Login"
                )}
              </button>
              <p className="text-sm text-primary-900/80 dark:text-slate-300">
                Don't have an account? <Link to="/register" className="font-semibold text-primary-700 dark:text-indigo-300 hover:underline">Register</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
