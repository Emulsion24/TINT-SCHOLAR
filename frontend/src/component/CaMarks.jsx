import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore"; // Import your auth store

const CaMarks = () => {
  const { user, CAresults, getResults, isLoading, error } = useAuthStore((state) => state);
  const [semester, setSemester] = useState("1");
  const [activeCA, setActiveCA] = useState("CA1");

  useEffect(() => {
    
    if (user && user.rollnumber) {
      console.log("Fetching data for:", semester, activeCA, user.rollnumber); // Check if the roll number is correct
      getResults(semester, activeCA,user.rollnumber); // Ensure getResults is invoked with the correct params
    }
  }, [semester, activeCA, getResults]);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-8 bg-gray-900 rounded-2xl shadow-2xl text-white">
      <h1 className="text-3xl font-bold mb-6 text-blue-400 text-center">Internal Marks & Attendance</h1>

      <div className="mb-6 flex justify-center">
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="p-3 rounded-lg bg-gray-700 focus:ring-2 focus:ring-blue-500"
        >
          {[...Array(8)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Semester {i + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-center mb-6 space-x-4">
        {["CA1", "CA2", "CA3", "CA4"].map((ca) => (
          <button
            key={ca}
            onClick={() => setActiveCA(ca)}
            className={`px-4 py-2 rounded-full transition duration-200 font-semibold ${
              activeCA === ca
                ? "bg-blue-500 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-gray-300"
            }`}
          >
            {ca}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border border-gray-700">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-4 py-3 border-b border-gray-700">Subject</th>
              <th className="px-4 py-3 border-b border-gray-700">Marks</th>
              <th className="px-4 py-3 border-b border-gray-700">Mentor</th>
              <th className="px-4 py-3 border-b border-gray-700">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
                  {error}
                </td>
              </tr>
            ) : CAresults.length > 0 ? (
              CAresults.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-800">
                  <td className="px-4 py-2 border-b border-gray-700">{row.subjectCode}</td>
                  <td className="px-4 py-2 border-b border-gray-700">{row.marksObtained}</td>
                  <td className="px-4 py-2 border-b border-gray-700">{row.mentor || "N/A"}</td>
                  <td className="px-4 py-2 border-b border-gray-700">{row.attendance}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
                  No data available for {activeCA} of Semester {semester}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CaMarks;
