# Mini Calendly 📅

A full-stack scheduling and appointment booking web application inspired by Calendly. Users can register an account, set up their weekly availability, generate shareable booking links, and allow others to book available time slots with them.

---

## 🚀 Tech Stack

### **Frontend**
- **React (v19)** with **Vite** for fast development and bundling
- **Tailwind CSS (v4)** for UI styling
- **React Router (v7)** for page navigation and routing
- **Axios** for API requests to the backend

### **Backend**
- **Node.js** & **Express.js (v5)** for RESTful API backend
- **MongoDB** & **Mongoose** for data modeling and database storage
- **JSON Web Tokens (JWT)** & **bcryptjs** for secure authentication and password hashing
- **Joi** for request body validation
- **Nanoid** for generating unique link slugs

---

## ✨ Features

- **User Authentication**: Secure user registration and login with JWT and hashed passwords.
- **Availability Management**: Set available working days and custom time slots (e.g., Mon–Fri, 9:00 AM – 5:00 PM).
- **Public Booking Page**: Shareable link where anyone can view open slots and book a meeting.
- **Booking Handling**: Saves bookings in MongoDB and prevents double-booking of busy slots.
- **Responsive Design**: Works on mobile and desktop screens.

---

## 📂 Project Structure

The repository is split into two main folders: `client` and `server`.

```text
mini-calendly/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── api/            # Centralized API service functions & Axios setup
│   │   ├── components/     # Reusable UI components (Navbar, buttons, cards)
│   │   ├── context/        # Auth state management / Context API
│   │   ├── layout/         # Page layout wrappers
│   │   ├── pages/          # Main views (Home, Login, Register, Availability, PublicBooking)
│   │   └── utils/          # Frontend helpers and formatters
│   └── package.json
│
└── server/                 # Backend Express Application
    ├── src/
    │   ├── config/         # Database connections & environment configs
    │   ├── controllers/    # Request handlers (HTTP status codes & JSON responses)
    │   ├── middleware/     # Auth checks, input validation, and error handlers
    │   ├── models/         # Mongoose schemas (User, Availability, Booking)
    │   ├── routes/         # Express route definitions
    │   ├── services/       # Core business logic separated from HTTP logic
    │   ├── utils/          # Response helper functions
    │   └── validations/    # Joi schema validation rules
    └── package.json
```

---

## 💡 Best Practices & Scalability Design

When I was building this project, I wanted to make sure it wasn't just a simple demo, but structured like a real-world app that can grow over time. This architecture is built to be highly scalable, and both the UI design and core feature set can be easily enhanced if required. Here are the key practices I followed:

### 1. **Layered Controller-Service Architecture (Backend)**
Instead of putting all database queries and business logic directly inside Express route controllers, I split them into **Controllers** and **Services**:
- **Controllers** only handle request parsing, sending HTTP status codes, and returning JSON.
- **Services** contain the actual business logic and database interactions.
- *Why it scales:* If we ever switch to WebSockets, a CLI, or add a background queue system (like BullMQ), we can reuse the exact same service logic without touching controller code.

### 2. **Strict Input Validation with Joi**
- Incoming request data (registration, login, availability settings, booking submissions) passes through Joi validation middleware before reaching the controllers.
- Invalid requests are rejected early with friendly error messages, keeping bad data out of MongoDB.

### 3. **Modular API Services (Frontend)**
- Component files don't make direct `axios.get()` or `axios.post()` calls.
- All backend calls are placed inside `client/src/api/` (like `authServices.js`, `availabilityServices.js`).
- An Axios instance with interceptors automatically attaches the user's Auth token and handles global API errors cleanly.

### 4. **Centralized Error Handling**
- Express middleware catches unhandled errors and formats them into a standard response `{ success: false, message: "..." }`. This prevents server crashes and makes debugging much easier.

### 5. **Environment Configuration & Security**
- Sensitive keys (JWT secrets, DB connection strings) live inside `.env` files and are excluded from Git.
- User passwords are saved using strong `bcryptjs` hashing.

---

## ⚙️ Running Locally

### **Prerequisites**
- Node.js (v18+ recommended)
- MongoDB (local instance or MongoDB Atlas URL)

### **1. Clone the repository**
```bash
git clone https://github.com/YourUsername/mini-calendly.git
cd mini-calendly
```

### **2. Setup & Run Backend**
```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mini-calendly
JWT_SECRET=your_secret_key_here
```

Start the server:
```bash
npm run dev
```
The server will run on `http://localhost:5000`.

### **3. Setup & Run Frontend**
In a new terminal:
```bash
cd client
npm install
```

Create a `.env` file inside the `client/` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the client:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔮 Future Improvements & Enhancements

This application is designed to be scalable, and its design and functionality can be enhanced further as needed. Here are a few planned additions:
- 📧 **Email Notifications**: Send booking confirmation emails using Nodemailer or Resend.
- 📅 **Google Calendar Integration**: Sync bookings directly with Google Calendar.
- 🌍 **Timezone Support**: Automatic timezone conversion for international bookings.
