import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";

// Function to generate a random color for card
const getRandomColor = () => {
  const colors = [
    "bg-teal-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-purple-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-red-500",
    "bg-yellow-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const HackathonSection = () => {
  const hackathons = useAuthStore((state) => state.hackathons);
  const fetchHackathon = useAuthStore((state) => state.fetchHackathon);
  const setHackathons = useAuthStore((state) => state.setHackathons);
  const uploadHackathon = useAuthStore((state) => state.uploadHackathon);
  const deleteHackathon = useAuthStore((state) => state.deleteHackathon);
  
  const [newHackathon, setNewHackathon] = useState({
    name: "",
    organizer: "",
    dates: "",
    location: "",
    theme: "",
    teamName: "",
    teamMembers: "",
    problemStatement: "",
    solutionConcept: "",
    technologiesUsed: "",
    role: "",
    outcome: "",
    awards: "",
    pdfFile: null, // Changed from 'certificate' to 'pdfFile'
  });

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [loading, setLoading] = useState({ upload: false, delete: false, fetch: false });

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewHackathon((prev) => ({ ...prev, pdfFile: file })); // Update with 'pdfFile'
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading((prev) => ({ ...prev, fetch: true }));
      await fetchHackathon(); // Fetch hackathons on component mount
      setLoading((prev) => ({ ...prev, fetch: false }));
    };

    fetchData();
  }, [fetchHackathon]);

  // Handle hackathon upload
  const handleUploadHackathon = async () => {
    setLoading((prev) => ({ ...prev, upload: true }));
    const file = newHackathon.pdfFile;

    try {
      const uploadedHackathon = await uploadHackathon(file, newHackathon); // Call Zustand action to upload hackathon
      setHackathons((prev) => [...prev, uploadedHackathon]); // Update hackathons state
      setShowUploadModal(false);
      await fetchHackathon();

      // Reset form
      setNewHackathon({
        name: "",
        organizer: "",
        dates: "",
        location: "",
        theme: "",
        teamName: "",
        teamMembers: "",
        problemStatement: "",
        solutionConcept: "",
        technologiesUsed: "",
        role: "",
        outcome: "",
        awards: "",
        pdfFile: null, // Reset 'pdfFile'
      });
    } catch (error) {
      console.error("Error uploading hackathon:", error);
    } finally {
      setLoading((prev) => ({ ...prev, upload: false }));
    }
  };

  // Handle hackathon deletion
  const handleDeleteHackathon = async (id) => {
    setLoading((prev) => ({ ...prev, delete: true }));
    // Call the delete function with the hackathon ID
    await deleteHackathon(id);
    setHackathons((prev) => prev.filter((hackathon) => hackathon._id !== id));
    await fetchHackathon();
    setLoading((prev) => ({ ...prev, delete: false }));
  };

  // Show hackathon details
  const handleShowDetails = (hackathon) => {
    setSelectedHackathon(hackathon);
    setShowDetailsModal(true);
  };

  // Ensure hackathons is an array before rendering
  if (!Array.isArray(hackathons)) {
    return <div>Error: Hackathons data is not an array</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-semibold text-teal-400 mb-4">Hackathons</h3>
      <p className="text-gray-400">
        Manage your hackathon participation and projects here.
      </p>

      {/* Upload Hackathon Button */}
      <button
        onClick={() => setShowUploadModal(true)}
        className="px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:bg-gradient-to-l hover:from-teal-600 hover:to-blue-600 transition duration-200"
        disabled={loading.upload}
      >
        {loading.upload ? "Uploading..." : "Upload Hackathon"}
      </button>

      {/* Hackathons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading.fetch ? (
          <div className="text-gray-400">Loading Hackathons...</div>
        ) : hackathons && hackathons.length > 0 ? (
          hackathons.map((hackathon, index) => {
            const cardColor = getRandomColor();
            return (
              <motion.div
                key={index}
                className={`p-6 rounded-lg shadow-lg transition-all duration-300 space-y-3 ${cardColor}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleShowDetails(hackathon)}
              >
                <h4 className="text-white font-bold text-xl">{hackathon.name}</h4>
                <p className="text-gray-300">
                  <span className="font-semibold">Organizer:</span> {hackathon.organizer}
                </p>
                <p className="text-gray-300">
                  <span className="font-semibold">Dates:</span> {hackathon.dates}
                </p>

                {/* Show "View Certificate" link only if a valid certificate exists */}
                {hackathon.certificate && (
                  <button className="text-white mt-4 px-10 mr-10 py-2 rounded-lg hover:bg-green-600 transition duration-200">
                    <a
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      href={hackathon.certificate}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Certificate
                    </a>
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    handleDeleteHackathon(hackathon._id); // Pass hackathon id to delete function
                  }}
                  className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                  disabled={loading.delete}
                >
                  {loading.delete ? "Deleting..." : "Delete"}
                </button>
              </motion.div>
            );
          })
        ) : (
          <div className="text-gray-400">No hackathons available.</div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-4xl space-y-6"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
          >
            <h3 className="text-2xl font-bold text-teal-400">Upload Hackathon</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(newHackathon).map((key) =>
                key !== "pdfFile" ? ( // Skip 'pdfFile' field for text inputs
                  <input
                    key={key}
                    type="text"
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={newHackathon[key]}
                    onChange={(e) =>
                      setNewHackathon((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 rounded-lg text-gray-800"
                  />
                ) : (
                  <input
                    key={key}
                    type="file"
                    name="pdfFile" // Changed from 'certificate' to 'pdfFile'
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png,.docx"
                    className="w-full px-4 py-2 rounded-lg text-white"
                  />
                )
              )}
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleUploadHackathon}
                className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                disabled={loading.upload}
              >
                {loading.upload ? "Uploading..." : "Upload"}
              </button>
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Hackathon Details Modal */}
      {showDetailsModal && selectedHackathon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-4xl space-y-6"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
          >
            <h3 className="text-2xl font-bold text-teal-400">Hackathon Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(selectedHackathon).map((key) => {
                // Skip internal details like userId, createdAt, updatedAt
                if (
                  key === "_id" ||
                  key === "createdAt" ||
                  key === "updatedAt" ||
                  key === "__v" ||
                  key === "certificate"
                ) {
                  return null;
                }

                // Show PDF link if available
                if (key === "pdfFile" && selectedHackathon[key]) {
                  return (
                    <p key={key} className="text-white">
                      <span className="font-semibold">Certificate: </span>
                      <a
                        href={URL.createObjectURL(new Blob([selectedHackathon[key]]))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-400 underline"
                      >
                        View Certificate
                      </a>
                    </p>
                  );
                }

                // Display other details normally
                return (
                  <div key={key} className="text-white">
                    <span className="font-semibold">
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </span>{" "}
                    {selectedHackathon[key]}
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default HackathonSection;
