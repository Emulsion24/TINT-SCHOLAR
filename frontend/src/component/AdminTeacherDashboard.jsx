import React, { useState } from "react";

const samplePublications = [
  { id: 1, title: "Deep Learning Advances", year: 2023, journal: "AI Journal" },
  { id: 2, title: "Quantum Computing Basics", year: 2022, journal: "Tech Today" },
];

const sampleProjects = [
  {
    id: 1,
    name: "Smart Home Automation",
    domain: "IoT",
    year: 2023,
    description: "Automate home devices via app.",
  },
  {
    id: 2,
    name: "Blockchain Voting",
    domain: "Blockchain",
    year: 2024,
    description: "Secure voting system using blockchain.",
  },
];

const sampleFDAWorkshops = [
  { id: 1, name: "AI Workshop", date: "2024-01-15", description: "Hands-on AI development." },
  { id: 2, name: "Cybersecurity Seminar", date: "2024-02-10", description: "Best practices in cybersecurity." },
];

const sampleEvents = [
  { id: 1, name: "Tech Fest 2024", date: "2024-03-20", location: "Auditorium" },
  { id: 2, name: "Hackathon Spring", date: "2024-04-12", location: "Lab 5" },
];

const tabs = [
  { key: "profile", label: "Profile", color: "from-blue-400 to-blue-600" },
  { key: "publications", label: "Publications", color: "from-purple-400 to-purple-600" },
  { key: "projects", label: "Projects", color: "from-green-400 to-green-600" },
  { key: "fda", label: "FDA / Workshops", color: "from-indigo-400 to-indigo-600" },
  { key: "events", label: "Events", color: "from-pink-400 to-pink-600" },
];

const AdminTeacherDashboard = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState("profile");

  const renderProfile = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gradient-to-r from-blue-200 to-blue-400 shadow-lg rounded-lg p-6 text-blue-900">
        <h3 className="text-xl font-semibold mb-4">Personal Info</h3>
        <p><span className="font-semibold">Name:</span> {user.name}</p>
        <p><span className="font-semibold">Email:</span> {user.email}</p>
      </div>
      <div className="bg-gradient-to-r from-blue-300 to-blue-500 shadow-lg rounded-lg p-6 text-blue-900">
        <h3 className="text-xl font-semibold mb-4">Contact Details</h3>
        <p><span className="font-semibold">Department:</span> {user.department}</p>
        <p><span className="font-semibold">Phone:</span> {user.phnumber}</p>
      </div>
    </div>
  );

  const renderPublications = () =>
    samplePublications.length === 0 ? (
      <p className="text-gray-600">No publications available.</p>
    ) : (
      <div className="grid sm:grid-cols-2 gap-6">
        {samplePublications.map(({ id, title, journal, year }) => (
          <div
            key={id}
            className="bg-gradient-to-r from-purple-200 to-purple-400 shadow-lg rounded-lg p-5 hover:from-purple-300 hover:to-purple-500 transition cursor-pointer"
          >
            <h4 className="font-bold text-purple-900 text-lg">{title}</h4>
            <p><span className="font-semibold">Journal:</span> {journal}</p>
            <p><span className="font-semibold">Year:</span> {year}</p>
          </div>
        ))}
      </div>
    );

  const renderProjects = () =>
    sampleProjects.length === 0 ? (
      <p className="text-gray-600">No projects available.</p>
    ) : (
      <div className="grid sm:grid-cols-2 gap-6">
        {sampleProjects.map(({ id, name, domain, year, description }) => (
          <div
            key={id}
            className="bg-gradient-to-r from-green-200 to-green-400 shadow-lg rounded-lg p-5 hover:from-green-300 hover:to-green-500 transition cursor-pointer"
          >
            <h4 className="font-bold text-green-900 text-lg">{name}</h4>
            <p><span className="font-semibold">Domain:</span> {domain}</p>
            <p><span className="font-semibold">Year:</span> {year}</p>
            <p className="mt-2">{description}</p>
          </div>
        ))}
      </div>
    );

  const renderFDA = () =>
    sampleFDAWorkshops.length === 0 ? (
      <p className="text-gray-600">No FDA or workshops available.</p>
    ) : (
      <div className="grid sm:grid-cols-2 gap-6">
        {sampleFDAWorkshops.map(({ id, name, date, description }) => (
          <div
            key={id}
            className="bg-gradient-to-r from-indigo-200 to-indigo-400 shadow-lg rounded-lg p-5 hover:from-indigo-300 hover:to-indigo-500 transition cursor-pointer"
          >
            <h4 className="font-bold text-indigo-900 text-lg">{name}</h4>
            <p><span className="font-semibold">Date:</span> {date}</p>
            <p className="mt-2">{description}</p>
          </div>
        ))}
      </div>
    );

  const renderEvents = () =>
    sampleEvents.length === 0 ? (
      <p className="text-gray-600">No events available.</p>
    ) : (
      <div className="grid sm:grid-cols-2 gap-6">
        {sampleEvents.map(({ id, name, date, location }) => (
          <div
            key={id}
            className="bg-gradient-to-r from-pink-200 to-pink-400 shadow-lg rounded-lg p-5 hover:from-pink-300 hover:to-pink-500 transition cursor-pointer"
          >
            <h4 className="font-bold text-pink-900 text-lg">{name}</h4>
            <p><span className="font-semibold">Date:</span> {date}</p>
            <p><span className="font-semibold">Location:</span> {location}</p>
          </div>
        ))}
      </div>
    );

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfile();
      case "publications":
        return renderPublications();
      case "projects":
        return renderProjects();
      case "fda":
        return renderFDA();
      case "events":
        return renderEvents();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 font-sans flex flex-col">
      {/* Header with back button */}
      <header className="mb-6 flex items-center space-x-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-lg shadow-md hover:from-red-500 hover:to-red-700 transition font-semibold"
          aria-label="Back to Admin Panel"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-extrabold text-gray-900">Teacher Dashboard</h1>
      </header>

      {/* Tabs */}
      <nav className="border-b border-gray-300 mb-8">
        <ul className="flex space-x-6 overflow-x-auto">
          {tabs.map(({ key, label, color }) => (
            <li key={key}>
              <button
                className={`pb-3 font-semibold rounded-t-lg text-lg ${
                  activeTab === key
                    ? `bg-gradient-to-r ${color} text-white shadow-lg`
                    : "text-gray-700 hover:text-gray-900"
                } px-5 transition`}
                onClick={() => setActiveTab(key)}
                aria-current={activeTab === key ? "page" : undefined}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Content */}
      <main className="flex-grow max-w-6xl mx-auto">{renderContent()}</main>
    </div>
  );
};

export default AdminTeacherDashboard;
