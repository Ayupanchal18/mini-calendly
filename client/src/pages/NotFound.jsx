import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className="text-center py-16 px-4">
            <h1 className="text-5xl font-bold text-gray-800 mb-2">404</h1>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Booking Link Not Found</h2>
            <p className="text-gray-500 mb-6">The booking link you opened is invalid or does not exist.</p>
            <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
                Back to Home
            </Link>
        </div>
    )
}

export default NotFound
