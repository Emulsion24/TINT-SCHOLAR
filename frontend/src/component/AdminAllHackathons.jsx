import React, { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";

const PAGE_SIZE = 3;

const AdminAllHackathons = () => {
  const getAllHackathon = useAuthStore((state) => state.getAllHackathon);
  const AllHackathons = useAuthStore((state) => state.AllHackathons);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState("All");
  const [filtered, setFiltered] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState(null);

  // Fetch hackathons on mount
  useEffect(() => {
    getAllHackathon();
  }, [getAllHackathon]);

  // Filter logic with debounce
  const debouncedFilter = useMemo(
    () =>
      debounce((query, year) => {
        let data = [...AllHackathons];

        if (query) {
          data = data.filter((item) =>
            item.name?.toLowerCase().includes(query.toLowerCase())
          );
        }

        if (year !== "All") {
          data = data.filter((item) => {
            const itemYear = new Date(item.createdAt).getFullYear();
            return itemYear === parseInt(year);
          });
        }

        setFiltered(data);
        setCurrentPage(1);
      }, 300),
    [AllHackathons]
  );

  useEffect(() => {
    debouncedFilter(search, selectedYear);
  }, [search, selectedYear, debouncedFilter]);

  // Re-filter when data loads for the first time
  useEffect(() => {
    if (AllHackathons.length) {
      setFiltered(AllHackathons);
    }
  }, [AllHackathons]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aYear = new Date(a.createdAt).getFullYear();
      const bYear = new Date(b.createdAt).getFullYear();
      return sortOrder === "asc" ? aYear - bYear : bYear - aYear;
    });
  }, [filtered, sortOrder]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, currentPage]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const years = useMemo(() => {
    const yearSet = new Set(AllHackathons.map(h => new Date(h.createdAt).getFullYear()));
    return ["All", ...Array.from(yearSet).sort((a, b) => b - a)];
  }, [AllHackathons]);

  return (
    <div className="p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg shadow text-black w-full h-full">
      <h2 className="text-3xl font-bold mb-6 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
        All Hackathons
      </h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="p-3 border border-gray-300 rounded w-full md:w-1/3 focus:ring-2 focus:ring-indigo-500"
        />

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="p-3 border border-gray-300 rounded w-full md:w-1/4 focus:ring-2 focus:ring-indigo-500"
        >
          {years.map((year, idx) => (
            <option key={idx} value={year}>
              {year}
            </option>
          ))}
        </select>

        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:ring-2 focus:ring-indigo-500"
        >
          Sort Year ({sortOrder === "asc" ? "↑" : "↓"})
        </button>
      </div>

      <table className="w-full text-left border border-gray-300 bg-white rounded-md shadow-md">
        <thead className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Organizer</th>
            <th className="p-3">Theme</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((hack, i) => (
            <motion.tr
              key={i}
              className="border-t hover:bg-gradient-to-r from-green-200 to-blue-200 cursor-pointer"
              onClick={() => setSelectedHackathon(hack)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <td className="p-3">{hack.name}</td>
              <td className="p-3">{hack.organizer}</td>
              <td className="p-3">{hack.theme}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between mt-6 items-center">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next
        </button>
      </div>

      {selectedHackathon && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white text-black p-8 rounded-lg w-2/3 h-3/4 overflow-auto shadow-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-4xl font-bold mb-4 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-orange-500">
              Hackathon Details
            </h2>
            <div className="mb-2"><strong>Name:</strong> {selectedHackathon.name}</div>
            <div className="mb-2"><strong>Organizer:</strong> {selectedHackathon.organizer}</div>
            <div className="mb-2"><strong>Dates:</strong> {selectedHackathon.dates}</div>
            <div className="mb-2"><strong>Location:</strong> {selectedHackathon.location}</div>
            <div className="mb-2"><strong>Theme:</strong> {selectedHackathon.theme}</div>
            <div className="mb-2"><strong>Team Name:</strong> {selectedHackathon.teamName}</div>
            <div className="mb-2"><strong>Team Members:</strong> {selectedHackathon.teamMembers}</div>
            <div className="mb-2"><strong>Problem Statement:</strong> {selectedHackathon.problemStatement}</div>
            <div className="mb-2"><strong>Solution Concept:</strong> {selectedHackathon.solutionConcept}</div>
            <div className="mb-2"><strong>Technologies Used:</strong> {selectedHackathon.technologiesUsed}</div>
            <div className="mb-2"><strong>Role:</strong> {selectedHackathon.role}</div>
            <div className="mb-2"><strong>Outcome:</strong> {selectedHackathon.outcome}</div>
            <div className="mb-2"><strong>Awards:</strong> {selectedHackathon.awards}</div>
            <div className="mb-2">
              <strong>Certificate:</strong>{" "}
              <a href={selectedHackathon.certificate} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                View Certificate
              </a>
            </div>
            <div className="mb-2"><strong>Created At:</strong> {new Date(selectedHackathon.createdAt).toLocaleDateString()}</div>
            <button
              onClick={() => setSelectedHackathon(null)}
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 mt-4"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminAllHackathons;
