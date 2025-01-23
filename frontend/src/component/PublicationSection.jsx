import React, { useState } from "react";

const PublicationSection = () => {
  const [publications, setPublications] = useState([
    {
      id: 1,
      title: "Research on Machine Learning",
      journal: "International Journal of AI",
      year: 2022,
    },
    {
      id: 2,
      title: "Advanced Web Development",
      journal: "Web Tech Today",
      year: 2021,
    },
  ]);

  const [newPublication, setNewPublication] = useState({
    title: "",
    journal: "",
    year: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPublication({ ...newPublication, [name]: value });
  };

  const handleAddPublication = () => {
    if (!newPublication.title || !newPublication.journal || !newPublication.year) {
      alert("Please fill all fields before adding a publication.");
      return;
    }

    const newId = publications.length > 0 ? publications[publications.length - 1].id + 1 : 1;
    setPublications([
      ...publications,
      { id: newId, ...newPublication },
    ]);
    setNewPublication({ title: "", journal: "", year: "" });
  };

  const handleDeletePublication = (id) => {
    setPublications(publications.filter((pub) => pub.id !== id));
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-white mb-6">Publications</h1>

      {/* Add Publication Form */}
      <div className="mb-6 p-4 bg-gray-700 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Add New Publication</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="title"
            value={newPublication.title}
            onChange={handleInputChange}
            placeholder="Title"
            className="p-2 rounded-lg bg-gray-600 text-white focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="journal"
            value={newPublication.journal}
            onChange={handleInputChange}
            placeholder="Journal"
            className="p-2 rounded-lg bg-gray-600 text-white focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="year"
            value={newPublication.year}
            onChange={handleInputChange}
            placeholder="Year"
            className="p-2 rounded-lg bg-gray-600 text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleAddPublication}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add Publication
        </button>
      </div>

      {/* Publications List */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Publication List</h2>
        {publications.length > 0 ? (
          <table className="w-full text-left text-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Journal</th>
                <th className="px-4 py-2">Year</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {publications.map((pub) => (
                <tr key={pub.id} className="hover:bg-gray-600">
                  <td className="px-4 py-2">{pub.title}</td>
                  <td className="px-4 py-2">{pub.journal}</td>
                  <td className="px-4 py-2">{pub.year}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDeletePublication(pub.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400">No publications added yet.</p>
        )}
      </div>
    </div>
  );
};

export default PublicationSection;
