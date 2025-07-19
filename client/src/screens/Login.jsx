import Navbar from '../components/Navbar'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import { jwtDecode } from 'jwt-decode'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const SERVER_URL = import.meta.env.VITE_SERVER_URL

export default function Login() {

  const [user, setUser] = useState({ userId: "", password: "" });
  const [error, setError] = useState('')
  const [showError, setShowError] = useState(true)
  const [loading, setLoading] = useState(false)

  let navigate = useNavigate();

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
      navigate('/');
    } catch (err) {
      setError(err.message);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div><Navbar /></div>
        <section className="flex-grow bg-gray-50 flex items-start justify-center px-6 py-20 navbar-spacing">
          <div className="w-full bg-white rounded-lg shadow border sm:max-w-sm xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <ErrorAlert 
                error={error} 
                show={showError} 
                onClose={() => setShowError(false)}
                className="mb-4"
              />
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">Login</h1>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <label htmlFor="userId" className="block mb-2 text-sm font-medium text-gray-900">Username or Email</label>
                  <input type="text" name="userId" onChange={onChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="name@company.com" required />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                  <input type="password" name="password" id="password" onChange={onChange} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center justify-center disabled:opacity-50"
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
                <p className="text-sm font-light text-gray-500">
                  Don't have an account? <a href="/register" className="font-medium text-primary-600 hover:underline">Register</a>
                </p>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
