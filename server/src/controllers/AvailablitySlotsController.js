import { AvailablityValidation } from "../validations/availablityValidation.js";
import { Availablity } from "../models/Availablity.js";
import { Booking } from "../models/Booking.js";
import { BookingLinks } from "../models/BookingLinks.js";
import crypto from "crypto";

export const AvailablitySlotsController = async (req, res) => {
    try {
        const { error } = AvailablityValidation.availablityValidation(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { Host, Date: slotDate, StartTime, EndTime } = req.body;

        const existingSlot = await Availablity.findOne({ Host, Date: slotDate, StartTime, EndTime });
        if (existingSlot) {
            return res.status(400).json({ message: "Slot already exists, Please create new one." });
        }

        const generateBookingNumber = () => {
            return `BK-${Math.floor(100000 + Math.random() * 900000)}`;
        };

        const newSlot = new Availablity({
            Host,
            Date: slotDate,
            BookingId: generateBookingNumber(),
            StartTime,
            EndTime
        });
        await newSlot.save();

        res.json({ message: "Slot created successfully", slot: newSlot });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const BookSlotsController = async (req, res) => {
    try {
        const { error } = AvailablityValidation.bookingValidation(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { email, BookingId, Date: bookingDate, StartTime, EndTime } = req.body;

        const existingBooking = await Booking.findOne({ BookingId, Date: bookingDate, StartTime, EndTime });
        if (existingBooking) {
            return res.status(400).json({ message: "This slot has already been booked." });
        }

        const newBooking = new Booking({ email, BookingId, Date: bookingDate, StartTime, EndTime });
        await newBooking.save();

        res.json({ message: "Booking created successfully", booking: newBooking });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const GetSlotsController = async (req, res) => {
    try {
        const token = req.params.token || req.query.token || req.body.token;
        if (!token) {
            return res.status(400).json({ message: "Booking token is required" });
        }

        const bookingLink = await BookingLinks.findOne({ token });
        if (!bookingLink) {
            return res.status(404).json({ message: "Booking link not found" });
        }

        const availabilities = await Availablity.find({ Host: bookingLink.host });
        const bookingIds = availabilities.map(a => a.BookingId).filter(Boolean);
        const bookings = await Booking.find({ BookingId: { $in: bookingIds } });

        res.json({
            message: "Booking link found",
            host: bookingLink.host,
            availabilities,
            bookings
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const GenerateLinkController = async (req, res) => {
    try {
        const { error } = AvailablityValidation.generateLinkValidation(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { host } = req.body;

        let bookingLink = await BookingLinks.findOne({ host });
        if (!bookingLink) {
            const token = crypto.randomBytes(16).toString("hex");
            bookingLink = new BookingLinks({ token, host });
            await bookingLink.save();
        }

        res.json({
            message: "Booking link generated successfully",
            token: bookingLink.token,
            host: bookingLink.host
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};