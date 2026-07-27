import { User } from "../models/users.js";
import { generateToken } from "../services/authServices.js";
import { Validation } from "../validations/authValidation.js";
import bcrypt from "bcryptjs";

export const loginController = async (req, res) => {
    try {
        const validationError = await Validation.loginValidation(req.body);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const hashedPassword = user.password;
        if (!hashedPassword) {
            return res.status(401).json({ error: "Password not found, contact administrator" });
        }

        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // generateToken returns the token string directly
        const accessToken = generateToken(user);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000 // 1 hour
        });

        res.json({
            success: true,
            token: accessToken,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const registerController = async (req, res) => {
    try {
        const validationError = await Validation.SignupValidation(req.body);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        // generateToken returns the token string directly
        const accessToken = generateToken(user);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000 // 1 hour
        });

        res.json({
            success: true,
            token: accessToken,
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
