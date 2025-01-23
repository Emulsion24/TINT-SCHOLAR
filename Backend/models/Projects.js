import mongoose from 'mongoose';

const { Schema } = mongoose;

// Project Schema
const projectSchema = new Schema(
  {
    projectName: {
      type: String,
      required:[ true,"Project name required"],
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    techStack: {
      type: [String],
      required: true,
      default: [],
    },
    status: {
      type: String,
      enum: ['Active', 'Completed', 'On Hold', 'Archived'],
      default: 'Active',
    },
    mentor: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher', // Reference to the Teacher (mentor) model
      required: true,
    },
    contributors:[{type:Schema.Types.ObjectId, 
      ref: "User" },],
    projectLink: {
      type: String,
      required: false,
      trim: true,
    },
    pdfLink: {
      type: String,
      required: false,
      trim: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create the Project model from the schema
const Project = mongoose.model('Project', projectSchema);

export { Project };
