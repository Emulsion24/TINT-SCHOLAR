import { User } from "../models/User.js";
import { Teacher } from "../models/Teacher.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from '../utlis/genarateTokenAndSecretCookie.js';

// Fetch all users
export const getuser = async (req, res) => {
  try {
    const users = await User.find(); // Get all users
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Fetch all teachers
export const getteacher = async (req, res) => {
  try {
    const teachers = await Teacher.find(); // Get all teachers
    res.status(200).json({ teachers });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachers' });
  }
};

// Add a new teacher
export const addTeacher = async (req, res) => {
  const { email, password, name, department, employeeId } = req.body;
  console.log(email, password, name, department, employeeId);

  try {
    // Check for missing fields
    if (!email || !password || !name || !department || !employeeId) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if the user already exists
    const userAlreadyExists = await Teacher.findOne({ $or: [{ email }, { employeeId }] });
    if (userAlreadyExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create a new user instance
    const teacher = new Teacher({
      email,
      password: hashedPassword,
      name,
      department,
      employeeId,
      isVerified: true,
    });

    // Save the user to the database
    await teacher.save();

    console.log("Teacher created successfully");

    // Generate a JWT token and set it as a cookie
    generateTokenAndSetCookie(res, teacher._id);

    // Send a success response
    res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      teachers: {
        ...teacher.toObject(),
        password: undefined, // Remove the password from the response
      },
    });
  } catch (error) {
    // Handle any errors
    console.error(error); // Log the error for debugging
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a student
export const deleteStudent = async (req, res) => {
  try {
    // Find and delete the user by ID
    const user = await User.findByIdAndDelete(req.params.id);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Respond with a success message
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    // Handle any errors
    res.status(500).json({ message: err.message });
  }
};
