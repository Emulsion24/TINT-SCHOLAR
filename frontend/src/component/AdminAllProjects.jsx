import React, { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";

const PAGE_SIZE = 5;

const AdminAllProjects = () => {
  const fetchProjects = useAuthStore((state) => state.fetchProjects);
  const projects = useAuthStore((state) => state.projects);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState("All");
  const [filtered, setFiltered] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    setFiltered(projects);
  }, [projects]);

  const debouncedFilter = useMemo(() => {
    return debounce((query, year) => {
      let data = [...projects];

      if (query) {
        data = data.filter((item) =>
          item.projectName.toLowerCase().includes(query.toLowerCase())
        );
      }

      if (year !== "All") {
        data = data.filter(
          (item) => new Date(item.startDate).getFullYear() === parseInt(year)
        );
      }

      setFiltered(data);
      setCurrentPage(1);
    }, 300);
  }, [projects]);

  useEffect(() => {
    debouncedFilter(search, selectedYear);
  }, [search, selectedYear, debouncedFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const yearA = new Date(a.startDate).getFullYear();
      const yearB = new Date(b.startDate).getFullYear();
      return sortOrder === "asc" ? yearA - yearB : yearB - yearA;
    });
  }, [filtered, sortOrder]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, currentPage]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const years = useMemo(() => {
    const yearSet = new Set(
      projects.map((p) => new Date(p.startDate).getFullYear())
    );
    return ["All", ...Array.from(yearSet).sort((a, b) => b - a)];
  }, [projects]);

  const handleRowClick = (project) => setSelectedProject(project);
  const handleCloseDetails = () => setSelectedProject(null);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg text-black">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">All Projects</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center justify-between">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by project name..."
          className="p-3 rounded-lg border border-gray-300 w-full md:w-1/3"
        />

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 w-full md:w-1/4"
        >
          {years.map((year, i) => (
            <option key={i} value={year}>
              {year}
            </option>
          ))}
        </select>

        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Sort Year ({sortOrder === "asc" ? "↑" : "↓"})
        </button>
      </div>

      <div className="overflow-auto max-h-[60vh] rounded-xl">
        <table className="w-full table-auto border-collapse bg-gray-50">
          <thead className="bg-blue-200 text-blue-900">
            <tr>
              <th className="p-3 border">Project Name</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Tech Stack</th>
              <th className="p-3 border">Start Year</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((proj, i) => (
              <motion.tr
                key={proj._id}
                onClick={() => handleRowClick(proj)}
                className={`cursor-pointer border-t hover:bg-blue-100 ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-100"
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <td className="p-3">{proj.projectName}</td>
                <td className="p-3">{proj.status}</td>
                <td className="p-3">{proj.techStack?.join(", ")}</td>
                <td className="p-3">{new Date(proj.startDate).getFullYear()}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Prev
        </button>
        <span className="text-blue-900 font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Next
        </button>
      </div>

      {selectedProject && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white p-8 rounded-xl w-11/12 max-w-xl text-black shadow-xl"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-blue-800">Project Details</h3>
            <p className="mb-2"><strong>ID:</strong> {selectedProject._id}</p>
            <p className="mb-2"><strong>Name:</strong> {selectedProject.projectName}</p>
            <p className="mb-2"><strong>Description:</strong> {selectedProject.description}</p>
            <p className="mb-2"><strong>Status:</strong> {selectedProject.status}</p>
            <p className="mb-2">
              <strong>Tech Stack:</strong> {selectedProject.techStack?.join(", ")}
            </p>
            <p className="mb-2">
              <strong>Mentor:</strong>{" "}
              {typeof selectedProject.mentor === "object"
                ? selectedProject.mentor.name
                : selectedProject.mentor}
            </p>
            <p className="mb-2">
              <strong>Contributors:</strong>{" "}
              {Array.isArray(selectedProject.contributors)
                ? selectedProject.contributors
                    .map((c) =>
                      typeof c === "object" ? c.name : c
                    )
                    .join(", ")
                : selectedProject.contributors}
            </p>
            <p className="mb-2">
              <strong>Project Link:</strong>{" "}
              <a
                href={selectedProject.projectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {selectedProject.projectLink}
              </a>
            </p>
            <p className="mb-2">
              <strong>PDF:</strong>{" "}
              <a
                href={selectedProject.pdfLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View PDF
              </a>
            </p>
            <p className="mb-4">
              <strong>Start Date:</strong>{" "}
              {new Date(selectedProject.startDate).toLocaleDateString()}
            </p>
            <button
              onClick={handleCloseDetails}
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminAllProjects;
