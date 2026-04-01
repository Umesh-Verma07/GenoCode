import './App.css'
import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoadingSpinner from './components/LoadingSpinner'

const Home = lazy(() => import('./screens/Home'))
const Login = lazy(() => import('./screens/Login'))
const Register = lazy(() => import('./screens/Register'))
const Create = lazy(() => import('./screens/Create'))
const Update = lazy(() => import('./screens/Update'))
const Problem = lazy(() => import('./screens/Problem'))
const User = lazy(() => import('./screens/User'))
const EditUser = lazy(() => import('./screens/EditUser'))
const Practice = lazy(() => import('./screens/Practice'))
const Contest = lazy(() => import('./screens/Contest'))

const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <LoadingSpinner size="xl" color="primary" text="Loading page..." />
  </div>
)

function App() {
  return (
    <Router>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route exact path="/practice" element={<Practice/>} />
          <Route exact path="/contest" element={<Contest/>} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/create" element={<Create/>} />
          <Route exact path="/update/:id" element={<Update/>} />
          <Route exact path="/problem/:id" element={<Problem/>} />
          <Route exact path="/user/:id" element={<User/>} />
          <Route exact path="/user/edit/:id" element={<EditUser/>} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
