import React, { useState } from "react";
import { motion } from "framer-motion";

const FdpWorkshopSection = () => {
  const [workshops, setWorkshops] = useState([
    { id: 1, title: "AI and ML Workshop", date: "2025-01-10", organizer: "TechWorld" },
    { id: 2, title: "Web Development Bootcamp", date: "2025-02-15", organizer: "CodeAcademy" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", date: "", organizer: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddWorkshop = () => {
    if (formData.title && formData.date && formData.organizer) {
      setWorkshops([
        ...workshops,
        { id: Date.now(), title: formData.title, date: formData.date, organizer: formData.organizer },
      ]);
      setFormData({ title: "", date: "", organizer: "" });
      setShowForm(false);
    }
  };

  const handleDeleteWorkshop = (id) => {
    setWorkshops(workshops.filter((workshop) => workshop.id !== id));
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">FDP/Workshops</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        >
          {showForm ? "Cancel" : "Add Workshop"}
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-white rounded-lg shadow-md"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              name="title"
              placeholder="Workshop Title"
              value={formData.title}
              onChange={handleInputChange}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  text-cyan-400"
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  text-cyan-400"
            />
            <input
              type="text"
              name="organizer"
              placeholder="Organizer"
              value={formData.organizer}
              onChange={handleInputChange}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-cyan-400"
            />
          </div>
          <button
            onClick={handleAddWorkshop}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
          >
            Add Workshop
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workshops.map((workshop) => (
          <motion.div
            key={workshop.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-bold text-gray-700">{workshop.title}</h3>
            <p className="text-sm text-gray-600">Date: {workshop.date}</p>
            <p className="text-sm text-gray-600">Organizer: {workshop.organizer}</p>
            <button
              onClick={() => handleDeleteWorkshop(workshop.id)}
              className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FdpWorkshopSection;
