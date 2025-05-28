// models/InternalResults.js

import mongoose from 'mongoose';

const internalResultsSchema = new mongoose.Schema({
  subjectCode: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  internalNumber: {
    type: String, // e.g., "1" for first internal
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  marksObtained: {
    type: Number,
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
  },
  mentor: {
    type: String,
    default: "N/A", // optional: defaults to "N/A" if not provided
  },
  attendance: {
    type: String,
    enum: ["Yes", "No"], // restricts value to "Yes" or "No"
    default: "Yes", // optional default
  }
}, {
  timestamps: true // adds createdAt and updatedAt fields
});

const InternalResults = mongoose.model('InternalResults', internalResultsSchema);

export default InternalResults;
