import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import authServices from '../api/authServices'

const Register = () => {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleRegister = async (e) => {
        e.preventDefault()

        if (!name || !email || !password || !confirmPassword) {
            setError('All fields are required')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await authServices.register({ name, email, password })

            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token)
                if (response.data.user) {
                    localStorage.setItem('user', JSON.stringify(response.data.user))
                }
                window.dispatchEvent(new Event('auth-change'))
                navigate('/')
            } else {
                setError('Registration failed')
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mx-auto mt-16 max-w-md rounded border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-center text-2xl font-semibold">Sign Up</h2>

            {error && (
                <div className="mb-4 rounded bg-red-50 p-2 text-center text-sm text-red-600 border border-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value)
                            setError('')
                        }}
                        placeholder="Enter your name"
                        className="w-full rounded border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setError('')
                        }}
                        placeholder="Enter your email"
                        className="w-full rounded border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                            setError('')
                        }}
                        placeholder="Create a password"
                        className="w-full rounded border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value)
                            setError('')
                        }}
                        placeholder="Confirm your password"
                        className="w-full rounded border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:underline">
                    Login
                </Link>
            </div>
        </div>
    )
}

export default Register