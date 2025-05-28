import React, { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore"; 

const PAGE_SIZE = 3;

const AdminAllPublications = () => {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState("All");

  // ✅ Get from store
  const getAllPublications = useAuthStore((state) => state.getAllPublications);
  const Allpublications = useAuthStore((state) => state.Allpublications);

  const [filtered, setFiltered] = useState([]);

  // ✅ Fetch publications on mount
  useEffect(() => {
    getAllPublications();
  }, []);

  // ✅ Debounced search + year filter
  const debouncedFilter = useMemo(
    () =>
      debounce((query) => {
        let data = Allpublications;
        if (query) {
          data = data.filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase())
          );
        }
        if (selectedYear !== "All") {
          data = data.filter((item) => item.year === parseInt(selectedYear));
        }
        setFiltered(data);
        setCurrentPage(1);
      }, 300),
    [Allpublications, selectedYear]
  );

  useEffect(() => {
    debouncedFilter(search);
  }, [search, selectedYear, Allpublications]);

  // ✅ Sorting
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) =>
      sortOrder === "asc" ? a.year - b.year : b.year - a.year
    );
  }, [filtered, sortOrder]);

  // ✅ Pagination
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, currentPage]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const years = useMemo(() => {
    const yearSet = new Set(Allpublications.map((p) => p.year));
    return ["All", ...Array.from(yearSet).sort((a, b) => b - a)];
  }, [Allpublications]);

  return (
    <div className="p-6 bg-gradient-to-r from-teal-100 to-pink-100 rounded-lg shadow text-black w-full h-full">
      <h2 className="text-3xl font-bold mb-6 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
        All Publications
      </h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title..."
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
            <th className="p-3">Title</th>
            <th className="p-3">Author</th>
            <th className="p-3">Year</th>
            <th className="p-3">Journal</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((pub, i) => (
            <motion.tr
              key={i}
              className="border-t hover:bg-gradient-to-r from-teal-200 to-pink-200 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <td className="p-3">{pub.title}</td>
              <td className="p-3">{pub.owner?.name}</td>
              <td className="p-3">{pub.year}</td>
              <td className="p-3">{pub.journal}</td>
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
    </div>
  );
};

export default AdminAllPublications;
