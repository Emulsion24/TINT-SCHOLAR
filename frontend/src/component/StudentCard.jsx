import React, { useState } from "react";

const StudentCard = ({ student, onClose, onDelete, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...student });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    onUpdate(formData);
    setEditMode(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-black p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">
          {editMode ? "Edit Student" : "Student Details"}
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block font-semibold">Name:</label>
            {editMode ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              />
            ) : (
              <p>{student.name}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold">Roll Number:</label>
            {editMode ? (
              <input
                type="text"
                name="rollnumber"
                value={formData.rollnumber}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              />
            ) : (
              <p>{student.rollnumber}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold">Branch:</label>
            {editMode ? (
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              />
            ) : (
              <p>{student.branch}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold">Year:</label>
            {editMode ? (
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              />
            ) : (
              <p>{student.year}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold">Verified:</label>
            {editMode ? (
              <select
                name="isVerified"
                value={formData.isVerified}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            ) : (
              <p>{student.isVerified ? "Yes" : "No"}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold">Role:</label>
            {editMode ? (
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              />
            ) : (
              <p>{student.role}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(student.id)}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
