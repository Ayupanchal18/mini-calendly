import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import availabilityServices from '../api/availabilityServices'

const Availability = () => {
    const isLoggedIn = !!localStorage.getItem('token')
    const defaultHostId = 101

    const [date, setDate] = useState('')
    const [startTime, setStartTime] = useState('09:00')
    const [endTime, setEndTime] = useState('17:00')
    const [savedSlots, setSavedSlots] = useState([])
    const [bookingLink, setBookingLink] = useState('')
    const [loading, setLoading] = useState(false)
    const [linkLoading, setLinkLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [copied, setCopied] = useState(false)

    const isFormFilled = Boolean(date && startTime && endTime) || savedSlots.length > 0

    const handleSaveSlot = async (e) => {
        e.preventDefault()
        if (!isLoggedIn) {
            setError('Please login to create availability slots.')
            return
        }

        if (!date || !startTime || !endTime) {
            setError('All fields are required')
            return
        }
        if (startTime >= endTime) {
            setError('Start time must be before end time')
            return
        }

        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const payload = { Host: defaultHostId, Date: date, StartTime: startTime, EndTime: endTime }
            const res = await availabilityServices.createSlot(payload)

            if (res.data?.slot) {
                setSavedSlots((prev) => [...prev, res.data.slot])
                setSuccess('Slot saved successfully')
                setDate('')
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save slot')
        } finally {
            setLoading(false)
        }
    }

    const handleGenerateLink = async () => {
        if (!isLoggedIn) {
            setError('Please login to generate booking links.')
            return
        }

        setLinkLoading(true)
        setError('')
        setCopied(false)

        try {
            const res = await availabilityServices.generateLink({ host: defaultHostId })
            if (res.data?.token) {
                setBookingLink(`${window.location.origin}/book/${res.data.token}`)
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate link')
        } finally {
            setLinkLoading(false)
        }
    }

    const handleCopyLink = () => {
        if (!bookingLink) return
        navigator.clipboard.writeText(bookingLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="max-w-xl mx-auto py-6 px-4">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
                <div>
                    <h1 className="text-lg font-bold text-gray-800">Set Availability</h1>
                    <p className="text-xs text-gray-500">Define slots when you are available</p>
                </div>

                <button
                    onClick={handleGenerateLink}
                    disabled={!isFormFilled || linkLoading}
                    className={`px-3 py-1.5 text-xs text-white rounded ${
                        !isFormFilled || linkLoading ? 'bg-gray-300' : 'bg-blue-600'
                    }`}
                >
                    {linkLoading ? 'Generating...' : 'Generate Link'}
                </button>
            </div>

            {!isLoggedIn && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-2.5 rounded text-xs mb-4 flex justify-between items-center">
                    <span>Please login to create slots.</span>
                    <div className="flex gap-2">
                        <Link to="/login" className="bg-yellow-600 text-white px-2 py-0.5 rounded">Login</Link>
                        <Link to="/register" className="border border-yellow-600 text-yellow-700 px-2 py-0.5 rounded">Register</Link>
                    </div>
                </div>
            )}

            {bookingLink && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded mb-4 text-xs">
                    <p className="font-medium text-blue-900 mb-1">Booking Link:</p>
                    <div className="flex gap-2">
                        <input type="text" readOnly value={bookingLink} className="w-full bg-white border p-1.5 rounded text-gray-700" />
                        <button onClick={handleCopyLink} className="bg-blue-600 text-white px-3 py-1.5 rounded">
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                </div>
            )}

            {error && <div className="bg-red-50 text-red-600 border border-red-200 p-2 rounded text-xs mb-4">{error}</div>}
            {success && <div className="bg-green-50 text-green-700 border border-green-200 p-2 rounded text-xs mb-4">{success}</div>}

            <form onSubmit={handleSaveSlot} className="bg-white border rounded p-4 mb-6">
                <h2 className="text-sm font-semibold mb-3">Add Slot</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Date</label>
                        <input
                            type="date"
                            value={date}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border p-1.5 text-xs rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full border p-1.5 text-xs rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">End Time</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full border p-1.5 text-xs rounded"
                        />
                    </div>
                </div>
                <div className="text-right">
                    <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-1.5 rounded text-xs">
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>

            <div>
                <h2 className="text-sm font-semibold mb-2">Saved Availability Slots</h2>
                {savedSlots.length === 0 ? (
                    <div className="border border-dashed p-3 text-center text-xs text-gray-400 rounded">
                        No slots saved yet.
                    </div>
                ) : (
                    <div className="space-y-2">
                        {savedSlots.map((slot, idx) => (
                            <div key={slot._id || idx} className="flex justify-between items-center border p-2.5 rounded bg-white text-xs">
                                <div>
                                    <span className="font-medium text-gray-800">
                                        {new Date(slot.Date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </span>
                                    <span className="text-gray-500 ml-2">({slot.StartTime} - {slot.EndTime})</span>
                                </div>
                                <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded">Saved</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Availability
