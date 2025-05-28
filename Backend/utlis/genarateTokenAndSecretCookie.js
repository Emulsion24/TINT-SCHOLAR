import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: './path/to/.env' });

export const generateTokenAndSetCookie = (res, userId) => {
  // Use an environment variable for the JWT secret
  const token = jwt.sign({ userId },"myname", {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: "devolopment" === "production", // Set secure flag if in production
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  return token;
};
