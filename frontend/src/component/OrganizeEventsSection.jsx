import {React,useState} from 'react'

function OrganizeEventsSection() {

  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState({
    name: '',
    date: '',
    description: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleFileChange = (e) => {
    setEvent({ ...event, file: e.target.files[0] });
  };

  const handleAddEvent = () => {
    if (event.name && event.date && event.description && event.file) {
      const newEvent = {
        ...event,
        fileName: event.file.name,
        fileUrl: URL.createObjectURL(event.file),
      };
      setEvents([...events, newEvent]);
      setEvent({ name: '', date: '', description: '', file: null });
    } else {
      alert('Please fill in all fields and select a file!');
    }
  };

  const handleDeleteEvent = (index) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-5 rounded-lg shadow-xl mb-6">
        <h2 className="text-2xl font-semibold text-center">Organize Events</h2>
      </div>

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          name="name"
          value={event.name}
          onChange={handleChange}
          placeholder="Enter Event Name"
          className="p-3 rounded-lg shadow-md w-full text-black"
        />
        <input
          type="date"
          name="date"
          value={event.date}
          onChange={handleChange}
          className="p-3 rounded-lg shadow-md w-full text-black"
        />
        <textarea
          name="description"
          value={event.description}
          onChange={handleChange}
          placeholder="Enter Event Description"
          className="p-3 rounded-lg shadow-md w-full text-black"
        />
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="p-3 rounded-lg shadow-md w-full"
        />
        <button
          onClick={handleAddEvent}
          className="bg-green-500 text-white rounded-lg px-6 py-3 shadow-lg hover:bg-green-600"
        >
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((evt, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-blue-400 via-teal-500 to-green-400 p-5 rounded-lg shadow-xl"
          >
            <h3 className="text-xl font-semibold text-white">{evt.name}</h3>
            <p className="text-white mt-2">{evt.description}</p>
            <p className="text-white mt-2 font-semibold">Date: {evt.date}</p>
            <div className="mt-4">
              {evt.file && (
                <a
                  href={evt.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-blue-300"
                >
                  View Event Proof ({evt.fileName})
                </a>
              )}
            </div>
            <button
              onClick={() => handleDeleteEvent(index)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );

}

export default OrganizeEventsSection
