import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";

const AddTeacher = ({ onSubmit }) => {
  const [teacherData, setTeacherData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    employeeId: "",
  });
  const addTeacher=useAuthStore((state)=>state.addTeacher);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setTeacherData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addTeacher(teacherData.email, teacherData.password, teacherData.name, teacherData.department,teacherData.employeeId ); // Pass data to parent component or backend
    setTeacherData({ name: "", email: "", password: "", department: "", employeeId: "" });
  };

  return (
    <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-lg shadow-xl max-h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Add Teacher</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name Input */}
        <div className="col-span-1">
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter Teacher's Name"
            value={teacherData.name}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 text-white p-3 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email Input */}
        <div className="col-span-1">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter Teacher's Email"
            value={teacherData.email}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 text-white p-3 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password Input */}
        <div className="col-span-1">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter Password"
            value={teacherData.password}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 text-white p-3 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Department Input */}
        <div className="col-span-1">
          <label htmlFor="department" className="block text-sm font-medium mb-1">
            Department
          </label>
          <select
            id="department"
            value={teacherData.department}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select Department
            </option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="ME">ME</option>
          </select>
        </div>

        {/* Employee ID Input */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="employeeId" className="block text-sm font-medium mb-1">
            Employee ID
          </label>
          <input
            id="employeeId"
            type="text"
            placeholder="Enter Employee ID"
            value={teacherData.employeeId}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 text-white p-3 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Add Teacher Button */}
        <div className="col-span-1 md:col-span-2">
          <button
            onSubmit={handleSubmit}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-lg font-semibold py-3 rounded-md transition"
          >
            Add Teacher
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTeacher;
