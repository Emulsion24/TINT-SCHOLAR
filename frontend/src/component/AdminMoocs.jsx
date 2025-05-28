import React, { useState } from "react";
import { motion } from "framer-motion";

const AdminMoocs = () => {
  const [moocs, setMoocs] = useState([
    {
      certificateName: "React.js Essentials",
      certificatePdf: null,
      verificationUrl: "https://verify-url.com/12345",
    },
    {
      certificateName: "Advanced Python Programming",
      certificatePdf: null,
      verificationUrl: "https://verify-url.com/67890",
    },
  ]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMoocName, setDeleteMoocName] = useState("");
  const [newMooc, setNewMooc] = useState({
    certificateName: "",
    certificatePdf: null,
    verificationUrl: "",
  });

  const handleUploadMooc = () => {
    setMoocs((prev) => [...prev, { ...newMooc }]);
    setShowUploadModal(false);
    setNewMooc({
      certificateName: "",
      certificatePdf: null,
      verificationUrl: "",
    });
  };

  const handleDeleteMooc = () => {
    setMoocs((prev) => prev.filter((mooc) => mooc.certificateName !== deleteMoocName));
    setShowDeleteModal(false);
    setDeleteMoocName("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-semibold text-blue-400 mb-4">MOOCs</h3>
      <p className="text-gray-400">Manage your MOOC certificates here.</p>

      {/* MOOCs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {moocs.map((mooc, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden transition-transform transform hover:scale-105"
          >
            <div className="p-6 space-y-4">
              <h4 className="text-blue-400 font-bold text-lg">{mooc.certificateName}</h4>
              <p className="text-gray-300">
                <span className="font-semibold">Verification URL: </span>
                <a
                  href={mooc.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 underline hover:text-green-600"
                >
                  Verify Here
                </a>
              </p>
            </div>

            <div className="bg-gray-900 p-4 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setDeleteMoocName(mooc.certificateName);
                  setShowDeleteModal(true);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Button */}
      <button
        onClick={() => setShowUploadModal(true)}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
      >
        Upload Certificate
      </button>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96 space-y-4">
            <h3 className="text-lg font-bold text-blue-400">Upload Certificate</h3>

            {/* Grid Layout for Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Certificate Name"
                value={newMooc.certificateName}
                onChange={(e) =>
                  setNewMooc({ ...newMooc, certificateName: e.target.value })
                }
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                placeholder="Verification URL"
                value={newMooc.verificationUrl}
                onChange={(e) =>
                  setNewMooc({ ...newMooc, verificationUrl: e.target.value })
                }
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="file"
                accept=".pdf"
                onChange={(e) =>
                  setNewMooc({ ...newMooc, certificatePdf: e.target.files[0] })
                }
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadMooc}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96 space-y-4">
            <h3 className="text-lg font-bold text-red-400">Delete Certificate</h3>
            <p className="text-gray-400">
              Are you sure you want to delete the certificate{" "}
              <span className="text-white">{deleteMoocName}</span>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMooc}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminMoocs;
