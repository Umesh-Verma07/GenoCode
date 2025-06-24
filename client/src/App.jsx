import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './screens/Home'
import Login from './screens/Login'
import Register from './screens/Register'
import Create from './screens/Create'
import Update from './screens/Update'
import Problem from './screens/Problem'

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/create" element={<Create/>} />
        <Route exact path="/update/:id" element={<Update/>} />
        <Route exact path="/problem/:id" element={<Problem/>} />
      </Routes>
    </Router>
  )
}

export default App
