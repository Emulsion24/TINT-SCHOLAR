import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";

const AddTeacher = () => {
  const [teacherData, setTeacherData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    employeeId: "",
  });

  const [success, setSuccess] = useState(false); // Success state
  const [error, setError] = useState(""); // Error state for displaying error messages

  const addTeacher = useAuthStore((state) => state.addTeacher);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setTeacherData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      await addTeacher(
        teacherData.email,
        teacherData.password,
        teacherData.name,
        teacherData.department,
        teacherData.employeeId
      );
      setTeacherData({
        name: "",
        email: "",
        password: "",
        department: "",
        employeeId: "",
      });
      setSuccess(true); // Show success
      setTimeout(() => setSuccess(false), 3000); // Hide after 3 seconds
    } catch (err) {
      setError("Failed to add teacher. Please try again."); // Show error
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="w-full max-w-3xl p-6 bg-white/30 backdrop-blur-md rounded-2xl shadow-xl border border-white/50">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">Add Teacher</h2>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 text-green-800 bg-green-200 border border-green-400 rounded-md text-center">
            ✅ Teacher added successfully!
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
            <label htmlFor="name" className="block text-sm font-medium mb-1 text-indigo-800">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter Teacher's Name"
              value={teacherData.name}
              onChange={handleChange}
              required
              className="w-full bg-white/60 text-gray-800 p-3 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-indigo-800">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter Teacher's Email"
              value={teacherData.email}
              onChange={handleChange}
              required
              className="w-full bg-white/60 text-gray-800 p-3 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-indigo-800">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter Password"
              value={teacherData.password}
              onChange={handleChange}
              required
              className="w-full bg-white/60 text-gray-800 p-3 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Department */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium mb-1 text-indigo-800">
              Department
            </label>
            <select
              id="department"
              value={teacherData.department}
              onChange={handleChange}
              required
              className="w-full bg-white/60 text-gray-800 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="" disabled>Select Department</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="ME">ME</option>
            </select>
          </div>

          {/* Employee ID */}
          <div className="md:col-span-2">
            <label htmlFor="employeeId" className="block text-sm font-medium mb-1 text-indigo-800">
              Employee ID
            </label>
            <input
              id="employeeId"
              type="text"
              placeholder="Enter Employee ID"
              value={teacherData.employeeId}
              onChange={handleChange}
              required
              className="w-full bg-white/60 text-gray-800 p-3 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold py-3 rounded-md transition"
            >
              Add Teacher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeacher;
