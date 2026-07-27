import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'))

    useEffect(() => {
        const handleAuthChange = () => {
            setIsLoggedIn(!!localStorage.getItem('token'))
        }

        window.addEventListener('auth-change', handleAuthChange)
        return () => {
            window.removeEventListener('auth-change', handleAuthChange)
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        window.dispatchEvent(new Event('auth-change'))
        navigate('/login')
    }

    return (
        <nav className="flex items-center justify-between border-b px-6 py-4 bg-white shadow-sm">
            <Link to="/availability" className="text-xl font-semibold text-gray-800">
                ScheduleMe
            </Link>

            <div className="flex items-center gap-6">
                <Link to="/availability" className="text-gray-600 hover:text-blue-600 font-medium">
                    Availability
                </Link>

                {isLoggedIn ? (
                    <>
                        <button
                            onClick={handleLogout}
                            className="text-gray-600 hover:text-red-600 font-medium cursor-pointer"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">
                            Login
                        </Link>
                        <Link to="/register" className="text-gray-600 hover:text-blue-600 font-medium">
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar