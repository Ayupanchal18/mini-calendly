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
            return res.status(401).json({ error: "Unexpected Error related to your credentials, contact administrator" });
        }

        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        if (!user.userId) {
            user.userId = `USR-${Math.floor(100000 + Math.random() * 900000)}`;
            await user.save();
        }

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
            user: {
                id: user._id,
                userId: user.userId,
                name: user.name,
                email: user.email
            }
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

        const userId = `USR-${Math.floor(100000 + Math.random() * 900000)}`;

        const user = new User({
            userId,
            name,
            email,
            password: hashedPassword
        });

        await user.save();

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
            user: {
                id: user._id,
                userId: user.userId,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
