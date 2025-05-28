import React, { useState } from "react";

// Dummy attendance data (replace with API call later)
const dummyAttendance = {
  1: [
    { subject: "Math", total: 40, attended: 36 },
    { subject: "Physics", total: 42, attended: 38 },
    { subject: "English", total: 38, attended: 34 },
  ],
  2: [
    { subject: "DBMS", total: 45, attended: 41 },
    { subject: "OS", total: 44, attended: 39 },
    { subject: "Discrete Maths", total: 40, attended: 32 },
  ],
};

const Attendance = () => {
  const [semester, setSemester] = useState("1");
  const data = dummyAttendance[semester] || [];

  const calculatePercentage = (attended, total) => {
    return total === 0 ? "0%" : `${((attended / total) * 100).toFixed(1)}%`;
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-8 bg-gray-900 rounded-2xl shadow-2xl text-white">
      <h1 className="text-3xl font-bold mb-6 text-green-400 text-center">Attendance Overview</h1>

      {/* Semester Selection */}
      <div className="mb-6 flex justify-center">
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="p-3 rounded-lg bg-gray-700 focus:ring-2 focus:ring-green-500"
        >
          {[...Array(8)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Semester {i + 1}
            </option>
          ))}
        </select>
      </div>

      {/* Attendance Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-700">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-4 py-3 border-b border-gray-700">Subject</th>
              <th className="px-4 py-3 border-b border-gray-700">Total Classes</th>
              <th className="px-4 py-3 border-b border-gray-700">Classes Attended</th>
              <th className="px-4 py-3 border-b border-gray-700">Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-800">
                  <td className="px-4 py-2 border-b border-gray-700">{item.subject}</td>
                  <td className="px-4 py-2 border-b border-gray-700">{item.total}</td>
                  <td className="px-4 py-2 border-b border-gray-700">{item.attended}</td>
                  <td
                    className={`px-4 py-2 border-b border-gray-700 font-semibold ${
                      (item.attended / item.total) * 100 < 75 ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {calculatePercentage(item.attended, item.total)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
                  No attendance data available for Semester {semester}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
