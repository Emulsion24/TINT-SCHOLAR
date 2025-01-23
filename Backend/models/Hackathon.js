 import mongoose from "mongoose";
 const hackathonSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      organizer: {
        type: String,
        required: true,
      },
      dates: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      theme: {
        type: String,
        required: true,
      },
      teamName: {
        type: String,
        required: true,
      },
      teamMembers: {
        type: String,
        required: true,
      },
      problemStatement: {
        type: String,
        required: true,
      },
      solutionConcept: {
        type: String,
        required: true,
      },
      technologiesUsed: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
      },
      outcome: {
        type: String,
        required: true,
      },
      awards: {
        type: String,
        required: true,
      },
      certificate: {
        type: String, // Path to the uploaded certificate
        default: null,
      },
    },
    { timestamps: true }
  );
    export const Hackathon=mongoose.model("Hackathon", hackathonSchema);