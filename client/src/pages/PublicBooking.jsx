import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import availabilityServices from '../api/availabilityServices'
import NotFound from './NotFound'

const PublicBooking = () => {
    const { token } = useParams()

    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [availabilities, setAvailabilities] = useState([])
    const [bookings, setBookings] = useState([])
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [email, setEmail] = useState('')
    const [bookingLoading, setBookingLoading] = useState(false)
    const [bookingError, setBookingError] = useState('')
    const [bookingSuccess, setBookingSuccess] = useState('')

    useEffect(() => {
        const fetchBookingData = async () => {
            setLoading(true)
            try {
                const res = await availabilityServices.getSlotsByToken(token)
                if (res.data) {
                    const availList = res.data.availabilities || []
                    setAvailabilities(availList)
                    setBookings(res.data.bookings || [])
                    if (availList.length > 0) {
                        setSelectedDate(availList[0].Date)
                    }
                }
            } catch (err) {
                setNotFound(true)
            } finally {
                setLoading(false)
            }
        }
        if (token) fetchBookingData()
    }, [token])

    if (loading) {
        return <div className="text-center py-12 text-gray-500 text-sm">Loading slots...</div>
    }

    if (notFound) {
        return <NotFound />
    }

    const uniqueDates = Array.from(new Set(availabilities.map((a) => a.Date))).sort()

    const generateTimeSlotsForDate = (dateStr) => {
        const matchingAvailabilities = availabilities.filter((a) => a.Date === dateStr)
        const slots = []

        matchingAvailabilities.forEach((avail) => {
            const startParts = (avail.StartTime || '09:00').split(':')
            const endParts = (avail.EndTime || '17:00').split(':')

            let startMinutes = parseInt(startParts[0], 10) * 60 + parseInt(startParts[1], 10)
            const endMinutes = parseInt(endParts[0], 10) * 60 + parseInt(endParts[1], 10)

            while (startMinutes + 30 <= endMinutes) {
                const slotStartHour = String(Math.floor(startMinutes / 60)).padStart(2, '0')
                const slotStartMin = String(startMinutes % 60).padStart(2, '0')

                const nextMinutes = startMinutes + 30
                const slotEndHour = String(Math.floor(nextMinutes / 60)).padStart(2, '0')
                const slotEndMin = String(nextMinutes % 60).padStart(2, '0')

                const slotStartTime = `${slotStartHour}:${slotStartMin}`
                const slotEndTime = `${slotEndHour}:${slotEndMin}`

                const isBooked = bookings.some(
                    (b) =>
                        (b.BookingId === avail.BookingId || b.Date === dateStr) &&
                        b.StartTime === slotStartTime &&
                        b.EndTime === slotEndTime
                )

                if (!isBooked) {
                    slots.push({
                        bookingId: avail.BookingId,
                        startTime: slotStartTime,
                        endTime: slotEndTime,
                        displayLabel: `${slotStartTime} - ${slotEndTime}`
                    })
                }

                startMinutes += 30
            }
        })

        return slots
    }

    const availableTimeSlots = selectedDate ? generateTimeSlotsForDate(selectedDate) : []

    const handleConfirmBooking = async (e) => {
        e.preventDefault()
        if (!selectedSlot || !email) {
            setBookingError('Select a slot and enter your email')
            return
        }

        setBookingLoading(true)
        setBookingError('')
        setBookingSuccess('')

        try {
            const payload = {
                email,
                BookingId: selectedSlot.bookingId,
                Date: selectedDate,
                StartTime: selectedSlot.startTime,
                EndTime: selectedSlot.endTime
            }

            const res = await availabilityServices.bookSlot(payload)
            if (res.data) {
                setBookingSuccess(`Booked for ${selectedDate} (${selectedSlot.displayLabel})`)
                setBookings((prev) => [...prev, payload])
                setSelectedSlot(null)
                setEmail('')
            }
        } catch (err) {
            setBookingError(err.response?.data?.message || 'Booking failed')
        } finally {
            setBookingLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-6 px-4">
            <div className="text-center border-b pb-4 mb-6">
                <h1 className="text-xl font-bold text-gray-800">Book Appointment</h1>
                <p className="text-xs text-gray-500">Pick an available date and time slot</p>
            </div>

            {bookingSuccess && <div className="bg-green-50 text-green-700 border border-green-200 p-3 rounded text-xs mb-4">{bookingSuccess}</div>}
            {bookingError && <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded text-xs mb-4">{bookingError}</div>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded p-4 bg-white shadow-sm">
                    <h2 className="text-xs font-semibold mb-3 text-gray-700">Available Dates</h2>
                    {uniqueDates.length === 0 ? (
                        <p className="text-xs text-gray-400">No dates available.</p>
                    ) : (
                        <div className="space-y-2">
                            {uniqueDates.map((dateStr) => (
                                <button
                                    key={dateStr}
                                    onClick={() => {
                                        setSelectedDate(dateStr)
                                        setSelectedSlot(null)
                                    }}
                                    className={`w-full text-left p-2 rounded text-xs border ${
                                        selectedDate === dateStr ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700'
                                    }`}
                                >
                                    {new Date(dateStr).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border rounded p-4 bg-white shadow-sm md:col-span-2">
                    <h2 className="text-xs font-semibold mb-3 text-gray-700">Available Time Slots</h2>

                    {!selectedDate ? (
                        <p className="text-xs text-gray-400">Select a date first.</p>
                    ) : availableTimeSlots.length === 0 ? (
                        <p className="text-xs text-gray-400 border border-dashed p-4 text-center rounded">No slots left for this date.</p>
                    ) : (
                        <div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {availableTimeSlots.map((slot, idx) => {
                                    const isSelected = selectedSlot?.startTime === slot.startTime && selectedSlot?.endTime === slot.endTime
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`px-3 py-1.5 rounded-full text-xs border ${
                                                isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-50 text-blue-700 border-blue-200'
                                            }`}
                                        >
                                            {slot.displayLabel}
                                        </button>
                                    )
                                })}
                            </div>

                            {selectedSlot && (
                                <form onSubmit={handleConfirmBooking} className="border-t pt-3 flex gap-2">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter email to book"
                                        className="w-full border p-1.5 text-xs rounded"
                                    />
                                    <button
                                        type="submit"
                                        disabled={bookingLoading}
                                        className="bg-blue-600 text-white px-4 py-1.5 rounded text-xs font-medium hover:bg-blue-700"
                                    >
                                        {bookingLoading ? 'Booking...' : 'Book'}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PublicBooking
