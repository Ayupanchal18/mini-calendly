import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    const isLoggedIn = !!localStorage.getItem('token')

    return (
        <div className="max-w-md mx-auto py-12 text-center px-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Scheduling System</h1>
            <p className="text-gray-600 text-sm mb-6">
                Set availability slots, generate booking links, and book your appointments.
            </p>

            <div className="flex justify-center gap-3">
                {isLoggedIn ? (
                    <Link to="/availability" className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
                        Manage Availability
                    </Link>
                ) : (
                    <>
                        <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
                            Login
                        </Link>
                        <Link to="/register" className="border text-gray-700 px-4 py-2 rounded text-sm">
                            Create Account
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}

export default Home