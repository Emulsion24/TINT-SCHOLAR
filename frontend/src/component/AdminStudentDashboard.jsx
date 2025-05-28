import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { PDFDownloadLink } from '@react-pdf/renderer';
import StudentReportPDF from './StudentReportPDF';
import {
  FaUser,
  FaIdBadge,
  FaUniversity,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaClipboardList,
  FaFileDownload,
} from "react-icons/fa";





const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-4">
    <div className="text-purple-700 text-2xl">{icon}</div>
    <div>
      <p className="text-gray-700 font-bold">{label}</p>
      <p className="text-gray-900">{value}</p>
    </div>
  </div>
);

const AdminStudentDashboard = ({ user }) => {


  const {
    CAresults,
    getResults,
    getProjectsByContributor,
    studentProjects,
  } = useAuthStore((state) => state);

  const [activeTab, setActiveTab] = useState("profile");
  const [selectedSemester, setSelectedSemester] = useState("1");
  const [selectedCA, setSelectedCA] = useState("CA1");

  // Local loading and error states for CA results
  const [loadingCA, setLoadingCA] = useState(false);
  const [errorCA, setErrorCA] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoadingCA(true);
      setErrorCA(null);
      try {
        // Await the async call to get results
        await getResults(selectedSemester, selectedCA, user.rollnumber);
      } catch (err) {
        if (err?.response?.status === 404) {
          setErrorCA("No data available");
        } else {
          setErrorCA("Error fetching data");
        }
      } finally {
        setLoadingCA(false);
      }
    };

    if (user?.rollnumber) {
      fetchResults();
      getProjectsByContributor(user._id);
    }
  }, [selectedSemester, selectedCA, user, getResults, getProjectsByContributor]);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-purple-700 mb-6">Profile</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <img
                src={
                  user.profilePicture ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff`
                }
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-purple-500 object-cover shadow-lg"
              />
              <div className="flex flex-col md:flex-row gap-8 w-full">
                <div className="flex-1 bg-purple-50 rounded-xl p-6 shadow-lg">
                  <ProfileItem icon={<FaUser />} label="Name" value={user.name} />
                  <ProfileItem icon={<FaIdBadge />} label="Roll No" value={user.rollnumber} />
                  <ProfileItem icon={<FaUniversity />} label="Branch" value={user.branch} />
                  <ProfileItem icon={<FaCalendarAlt />} label="Year" value={user.year} />
                </div>
                <div className="flex-1 bg-purple-50 rounded-xl p-6 shadow-lg">
                  <ProfileItem icon={<FaEnvelope />} label="Email" value={user.email} />
                  <ProfileItem icon={<FaPhone />} label="Phone" value={user.phnumber} />
                </div>
              </div>
            </div>
          </div>
        );

      case "results":
        return (
          <div className="bg-pink-50 p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-pink-700">Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.results?.length === 0 && <p className="text-pink-700 font-semibold">No results available.</p>}
              {user.results?.map((result, idx) => (
                <div
                  key={idx}
                  className="bg-pink-200 p-6 rounded-xl shadow hover:shadow-xl transition cursor-pointer"
                >
                  <p className="font-semibold mb-2 text-indigo-600">
                    <strong>Semester:</strong> {result.semester}
                  </p>
                  <p className="font-semibold mb-4 text-indigo-600">
                    <strong>CGPA:</strong> {result.averageCGPA}
                  </p>
                  <a
                    href={result.pdflink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-pink-900 underline hover:text-pink-800 font-semibold"
                  >
                    View Marksheet
                  </a>
                </div>
              ))}
            </div>
          </div>
        );

      case "projects":
        const projects = studentProjects || [];
        return (
          <div className="bg-green-50 p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-green-700">Projects</h2>
            {projects.length === 0 ? (
              <p className="text-green-700 font-semibold">No projects available.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, idx) => (
                  <div
                    key={idx}
                    className="bg-green-200 p-6 rounded-xl shadow hover:shadow-xl transition cursor-pointer"
                  >
                    <h3 className="font-semibold text-xl mb-2 text-black">{project.projectName}</h3>
                    <p className="mb-4 text-violet-600">{project.description}</p>
                    <p className="font-semibold mb-2 text-purple-700">
                      <strong>Mentor:</strong> {project.mentor?.name || "N/A"}
                    </p>
                    <a
                      href={project.pdfLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-green-900 underline hover:text-green-800 font-semibold"
                    >
                      View Project
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "internal":
        const caOptions = ["CA1", "CA2", "CA3", "CA4"];
        const semesterOptions = ["1", "2", "3", "4", "5", "6", "7", "8"];
        return (
          <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-indigo-700">Internal Marks</h2>
            <div className="flex gap-4 mb-6">
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="border border-indigo-400 rounded px-3 py-2 text-indigo-800 font-semibold"
              >
                {semesterOptions.map((s) => (
                  <option key={s} value={s}>{`Semester ${s}`}</option>
                ))}
              </select>
              <select
                value={selectedCA}
                onChange={(e) => setSelectedCA(e.target.value)}
                className="border border-indigo-400 rounded px-3 py-2 text-indigo-800 font-semibold"
              >
                {caOptions.map((ca) => (
                  <option key={ca} value={ca}>{ca}</option>
                ))}
              </select>
            </div>

            {loadingCA ? (
              <p className="text-indigo-700 font-semibold">Loading data...</p>
            ) : errorCA ? (
              <p className="text-red-600 font-semibold">{errorCA}</p>
            ) : CAresults?.length === 0 ? (
              <p className="text-indigo-700 font-semibold">No internal data available.</p>
            ) : (
              <table className="w-full border bg-white rounded-xl shadow overflow-hidden">
                <thead className="bg-indigo-100">
                  <tr>
                    <th className="p-3 border text-indigo-800 text-indigo-600">Subject</th>
                    <th className="p-3 border text-indigo-800 text-indigo-600">Obtained</th>
                    <th className="p-3 border text-indigo-800 text-indigo-600">Total</th>
                    <th className="p-3 border text-indigo-800 text-indigo-600">Mentor</th>
                    <th className="p-3 border text-indigo-800 text-indigo-600">Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {CAresults.map((item, idx) => (
                    <tr key={idx} className="odd:bg-white even:bg-indigo-50">
                      <td className="p-3 border text-indigo-800">{item.subjectCode}</td>
                      <td className="p-3 border text-indigo-800">{item.marksObtained}</td>
                      <td className="p-3 border text-indigo-800">{item.totalMarks}</td>
                      <td className="p-3 border text-indigo-800">{item.mentor}</td>
                      <td className="p-3 border text-indigo-800">{item.attendance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );

      case "attendance":
        return (
          <div className="bg-blue-50 p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-blue-700 mb-6">Overall Attendance</h2>
            {user?.attendance?.length > 0 ? (
              <table className="w-full border bg-white rounded-xl shadow overflow-hidden">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="p-3 border">Semester</th>
                    <th className="p-3 border">Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {user.attendance.map((sem, idx) => (
                    <tr key={idx} className="odd:bg-white even:bg-blue-50">
                      <td className="p-3 border">{sem.semester}</td>
                      <td className="p-3 border">{sem.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-blue-700 font-semibold">No attendance data available.</p>
            )}
          </div>
        );

      
         case "report":
  return (
    <div className="text-center py-12 bg-red-50 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-red-700 mb-8">Generate Full Report</h2>

      <PDFDownloadLink
        document={
          <StudentReportPDF
            user={user}
            studentProjects={studentProjects}
            CAresults={CAresults}
          />
        }
        fileName={`${user.name}_report.pdf`}
      >
        {({ loading }) => (
          <button
            className="bg-red-600 text-white px-8 py-3 rounded shadow hover:bg-red-700 transition inline-flex items-center justify-center mx-auto"
          >
            <FaFileDownload className="inline mr-2" />
            {loading ? 'Preparing PDF...' : 'Download Report'}
          </button>
        )}
      </PDFDownloadLink>
    </div>
  );


      default:
        return null;
    }
  };

  const tabs = [
    { key: "profile", label: "Profile" },
    { key: "results", label: "Results" },
    { key: "projects", label: "Projects" },
    { key: "internal", label: "Internal Marks" },
    { key: "attendance", label: "Attendance" },
    { key: "report", label: "Generate Report" },
  ];

  return (
    <div className="bg-white rounded-xl p-8 shadow-xl w-full max-w-7xl mx-auto">
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-5 py-3 rounded-lg font-semibold transition ${
              activeTab === key
                ? "bg-purple-700 text-white shadow-lg"
                : "bg-gray-100 text-gray-800 hover:bg-purple-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div>{renderContent()}</div>
    </div>
  );
};

export default AdminStudentDashboard;
