import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Main from './layout/Main'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Availability from './pages/Availability'
import PublicBooking from './pages/PublicBooking'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/availability" element={<Availability />} />
        <Route path="/book/:token" element={<PublicBooking />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
