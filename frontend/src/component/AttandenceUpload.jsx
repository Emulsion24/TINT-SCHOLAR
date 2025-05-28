import React, { useState } from "react";
import { CheckCircle } from "lucide-react"; // Optional icon

const AttendanceUpload = () => {
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState("");
  const [file, setFile] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject || !semester || !file) {
      setError("Please fill all fields and select an Excel file.");
      return;
    }

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("semester", semester);
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch("/api/upload-attendance", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setIsSuccess(true);
        setSubject("");
        setSemester("");
        setFile(null);
        setError("");
      } else {
        setError("Upload failed. Try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-8 bg-gray-800 rounded-xl shadow-lg text-white">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-400">Upload Attendance</h1>

      {error && (
        <div className="text-red-400 text-center mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subject, Semester Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Subject Code or Name"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="p-4 rounded-lg bg-gray-700 focus:ring-2 focus:ring-blue-500 text-white transition-all duration-200 ease-in-out"
          />

          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="p-4 rounded-lg bg-gray-700 focus:ring-2 focus:ring-blue-500 text-white transition-all duration-200 ease-in-out"
          >
            <option value="">Select Semester</option>
            {[...Array(8)].map((_, i) => (
              <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
            ))}
          </select>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-lg text-gray-400 mb-2">Upload Excel File</label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full p-4 rounded-lg bg-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition-all duration-200 ease-in-out"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-lg text-white font-semibold transition duration-200 ease-in-out ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Uploading..." : "Upload Attendance"}
        </button>
      </form>

      {/* Success Message */}
      {isSuccess && (
        <div className="flex items-center justify-center mt-8 text-green-400 text-xl font-semibold animate-pulse">
          <CheckCircle className="mr-3" size={26} />
          <span>Attendance uploaded successfully!</span>
        </div>
      )}
    </div>
  );
};

export default AttendanceUpload;
