import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";

const AddStudent = () => {
  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    rollnumber: "",
    phnumber: "",
  });

  const [success, setSuccess] = useState(false); // Success state
  const [error, setError] = useState(""); // Error state

  const addStudent = useAuthStore((state) => state.addStudent);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setStudentData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error message
    setSuccess(false); // Reset success before attempting to submit

    console.log("Submitting student data:", studentData); // Log data being submitted

    try {
      await addStudent(
        studentData.email,
        studentData.password,
        studentData.name,
        studentData.branch,
        studentData.rollnumber,
        studentData.phnumber
      );

      console.log("Student added successfully."); // Log success message

      // Reset form
      setStudentData({
        name: "",
        email: "",
        password: "",
        branch: "",
        rollnumber: "",
        phnumber: "",
      });

      setSuccess(true); // Show success message
      setTimeout(() => setSuccess(false), 3000); // Hide success after 3 seconds
    } catch (err) {
      console.error("Error adding student:", err); // Log error
      setError("Failed to add student. Please try again."); // Show error message
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="w-full max-w-3xl p-6 bg-white/30 backdrop-blur-md rounded-2xl shadow-xl border border-white/50">
        <h2 className="text-3xl font-bold text-center text-cyan-700 mb-6">Add Student</h2>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 text-green-800 bg-green-200 border border-green-400 rounded-md text-center">
            ✅ Student added successfully!
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 text-red-800 bg-red-200 border border-red-400 rounded-md text-center">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1 text-cyan-800">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={studentData.name}
              onChange={handleChange}
              placeholder="Enter Student's Name"
              required
              className="w-full bg-white/60 text-gray-800 p-3 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-cyan-800">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={studentData.email}
              onChange={handleChange}
              placeholder="Enter Student's Email"
              required
              className="w-full bg-white/60 text-gray-800 p-3 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-cyan-800">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={studentData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              required
              className="w-full bg-white/60 text-gray-800 p-3 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Branch */}
          <div>
            <label htmlFor="branch" className="block text-sm font-medium mb-1 text-cyan-800">
              Branch
            </label>
            <select
              id="branch"
              value={studentData.branch}
              onChange={handleChange}
              required
              className="w-full bg-white/60 text-gray-800 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="" disabled>Select Branch</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="ME">ME</option>
            </select>
          </div>

          {/* Roll Number */}
          <div className="md:col-span-2">
            <label htmlFor="rollnumber" className="block text-sm font-medium mb-1 text-cyan-800">
              Roll Number
            </label>
            <input
              id="rollnumber"
              type="text"
              value={studentData.rollnumber}
              onChange={handleChange}
              placeholder="Enter Roll Number"
              required
              className="w-full bg-white/60 text-gray-800 p-3 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Phone Number */}
          <div className="md:col-span-2">
            <label htmlFor="phnumber" className="block text-sm font-medium mb-1 text-cyan-800">
              Phone Number
            </label>
            <input
              id="phnumber"
              type="text"
              value={studentData.phnumber}
              onChange={handleChange}
              placeholder="Enter Phone Number"
              required
              className="w-full bg-white/60 text-gray-800 p-3 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-lg font-semibold py-3 rounded-md transition"
            >
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
