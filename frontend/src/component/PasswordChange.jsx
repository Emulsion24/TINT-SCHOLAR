import React, { useState } from "react";

const PasswordChange = ({ changeTeacherPassword, changeStudentPassword }) => {
  const [teacher, setTeacher] = useState({ employeeId: "", newPassword: "" });
  const [student, setStudent] = useState({ rollNumber: "", newPassword: "" });

  const handleTeacherChange = (e) => {
    const { id, value } = e.target;
    setTeacher((prev) => ({ ...prev, [id]: value }));
  };

  const handleStudentChange = (e) => {
    const { id, value } = e.target;
    setStudent((prev) => ({ ...prev, [id]: value }));
  };

  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    await changeTeacherPassword(teacher.employeeId, teacher.newPassword);
    setTeacher({ employeeId: "", newPassword: "" });
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    await changeStudentPassword(student.rollNumber, student.newPassword);
    setStudent({ rollNumber: "", newPassword: "" });
  };

  return (
    <div className="p-8 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-lg shadow-lg text-gray-800">
      <h2 className="text-3xl font-bold text-center mb-8 text-indigo-700">Change Password</h2>

      {/* Teacher Section */}
      <div className="mb-10 bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-semibold text-purple-600 mb-4">Teacher</h3>
        <form onSubmit={handleTeacherSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            id="employeeId"
            type="text"
            placeholder="Enter Employee ID"
            value={teacher.employeeId}
            onChange={handleTeacherChange}
            required
            className="p-4 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <input
            id="newPassword"
            type="password"
            placeholder="Enter New Password"
            value={teacher.newPassword}
            onChange={handleTeacherChange}
            required
            className="p-4 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full py-3 mt-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-md hover:from-purple-600 hover:to-pink-600 transition"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>

      {/* Student Section */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-semibold text-blue-600 mb-4">Student</h3>
        <form onSubmit={handleStudentSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            id="rollNumber"
            type="text"
            placeholder="Enter Roll Number"
            value={student.rollNumber}
            onChange={handleStudentChange}
            required
            className="p-4 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            id="newPassword"
            type="password"
            placeholder="Enter New Password"
            value={student.newPassword}
            onChange={handleStudentChange}
            required
            className="p-4 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full py-3 mt-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-md hover:from-blue-600 hover:to-cyan-600 transition"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChange;
