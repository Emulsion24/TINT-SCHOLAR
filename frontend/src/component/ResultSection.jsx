import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";

const ResultSection = () => {
  const { user, addSemesterResult, deleteSemesterResult } = useAuthStore((state) => ({
    user: state.user,
    addSemesterResult: state.addSemesterResult,
    deleteSemesterResult: state.deleteSemesterResult,
  }));

  const [showModal, setShowModal] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [averageCGPA, setAverageCGPA] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  useEffect(() => {
    if (user && user.results) {
      setResults(user.results);
    }
  }, [user]);

  const handleModalSubmit = async () => {
    if (!user || !user.results || user.results.length >= 8) return;

    const newResult = {
      semester: selectedSemester,
      averageCGPA,
      pdflink: selectedFile ? selectedFile.name : "No File Uploaded",
    };

    setIsLoading(true); // Start spinner

    try {
      await addSemesterResult(selectedFile, newResult);
      const updatedResults = [...user.results, newResult];
      setResults(updatedResults);
      setShowModal(false);
      setSelectedSemester(null);
      setAverageCGPA("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading result:", error);
    } finally {
      setIsLoading(false); // Stop spinner
    }
  };

  const handleDelete = (semester) => {
    if (!user || !user.results) return;
    deleteSemesterResult(semester);
    const updatedResults = results.filter((result) => result.semester !== semester);
    setResults(updatedResults);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h3 className="text-3xl font-semibold text-teal-500 mb-4">Results</h3>
      <p className="text-gray-400 text-lg">
        Manage your semester-wise results by entering CGPA and uploading related PDFs.
      </p>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300"
          disabled={results.length >= 8}
        >
          Upload Result
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results?.map((result, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-teal-700 via-teal-800 to-teal-900 rounded-xl shadow-xl border-2 border-gray-700 overflow-hidden hover:scale-105 transition-transform duration-300 p-4"
          >
            <h4 className="text-white font-bold text-xl">Semester {result.semester}</h4>
            <p className="text-gray-300">
              <span className="font-semibold">CGPA: </span>
              {result.averageCGPA}
            </p>
            <p className="text-gray-300 hover: cursor: pointer">
              <span className="font-semibold">PDF: </span>
              <a
                href={result.pdflink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 underline hover:text-green-600"
              >
                Download
              </a>
            </p>
            <button
              onClick={() => handleDelete(result.semester)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96 space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center">
                <div className="w-16 h-16 border-4 border-t-transparent border-teal-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-teal-400">Upload Your Result</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">Select Semester:</label>
                    <select
                      value={selectedSemester || ""}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      className="w-full mt-2 px-3 py-2 bg-teal-700 text-white rounded-lg border border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    >
                      <option value="">Select Semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Enter Average CGPA:</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      className="w-full mt-2 px-3 py-2 bg-teal-700 text-white rounded-lg border border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      value={averageCGPA}
                      onChange={(e) => setAverageCGPA(e.target.value)}
                      placeholder="Enter CGPA"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Choose File:</label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      className="w-full mt-2 px-3 py-2 bg-teal-700 text-white rounded-lg border border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleModalSubmit}
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                    disabled={!selectedSemester || !averageCGPA || !selectedFile}
                  >
                    Upload
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ResultSection;
