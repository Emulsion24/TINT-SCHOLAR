import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config({ path: './path/to/.env' });

export const isAdmin = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access Denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token,'myname');
    // Fetch user details from the database
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    // Attach user ID to request object
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error('JWT Error:', error.message); // Log error details
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
