import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]||req.cookies.token;

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token,'myname');
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // Attach user ID from the token to the request object
    req.userId = decoded.userId;
    next(); // Proceed to the next middleware or route
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
