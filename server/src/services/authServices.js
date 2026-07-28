
import jwt from "jsonwebtoken";


export const generateToken = (user) => {
    const jwt_secret = process.env.JWT_SECRET;
    const accessToken = jwt.sign({ id: user._id, userId: user.userId, type: user.access }, jwt_secret, { expiresIn: "1h" });
    return accessToken;
}