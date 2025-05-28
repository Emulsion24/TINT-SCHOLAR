import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import { useAuthStore } from "../store/authStore"; // adjust the path as needed

const MarksUpload = () => {
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState("");
  const [internal, setInternal] = useState("");
  const [file, setFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const { uploadMarks, isLoading, error } = useAuthStore(); // ✅ FIXED: Added isLoading, error

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject || !semester || !internal || !file) {
      alert("Please fill all fields and select a file before submitting.");
      return;
    }

    try {
      await uploadMarks({ subject, semester, internal, file });
      setUploadSuccess(true);
      setSubject("");
      setSemester("");
      setInternal("");
      setFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-gray-900 rounded-2xl shadow-2xl text-white">
      <h1 className="text-3xl font-bold mb-6 text-blue-400 text-center">Upload Internal Marks</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Subject Code or Name"
            className="p-3 rounded-lg bg-gray-700 focus:ring-2 focus:ring-blue-500"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="p-3 rounded-lg bg-gray-700 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Semester</option>
            {[...Array(8)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Semester {i + 1}
              </option>
            ))}
          </select>

          <select
            value={internal}
            onChange={(e) => setInternal(e.target.value)}
            className="p-3 rounded-lg bg-gray-700 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Internal</option>
            <option value="CA1">CA1</option>
            <option value="CA2">CA2</option>
            <option value="CA3">CA3</option>
            <option value="CA4">CA4</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm text-gray-400">Upload Excel File</label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="w-full p-3 rounded-lg bg-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-semibold transition duration-200 ${
            isLoading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? "Uploading..." : "Upload Marks"}
        </button>
      </form>

      {uploadSuccess && (
        <div className="flex items-center justify-center mt-6 text-green-400 text-lg font-medium animate-pulse">
          <CheckCircle className="mr-2" size={22} />
          Marks uploaded successfully!
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-400 text-sm text-center">{error}</div>
      )}
    </div>
  );
};

export default MarksUpload;
