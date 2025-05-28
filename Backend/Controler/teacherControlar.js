import { excelfile } from '../middleware/multer.js';
import InternalResults from '../models/InternalResults.js';
import {Publication} from '../models/Publication.js';
import { Teacher } from '../models/Teacher.js';
import fs from 'fs'; 

import xlsx from 'xlsx';
export const uploadexcelfile=excelfile.single('file');

export const addPublication = async (req, res) => {
  try {
    const { title, journal, year } = req.body;
    const teacherId = req.userId;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const publication = new Publication({ title, journal, year, owner: teacherId });
    await publication.save();

    // Optional: Add to teacher.publications if referenced
    teacher.publications.push(publication._id);
    await teacher.save();

    res.status(201).json(publication);
  } catch (err) {
    console.error("Error adding publication:", err);
    res.status(500).json({ message: "Server error" });
  }
};




export const getPublications = async (req, res) => {
  try {
    const teacherId = req.userId;
    const publications = await Publication.find({ owner: teacherId }).sort({ createdAt: -1 });
    res.status(200).json(publications);
  } catch (err) {
    console.error("Error fetching publications:", err);
    res.status(500).json({ message: "Server error" });
  }
};




export const deletePublication = async (req, res) => {
  try {
    const teacherId = req.userId;
    const { pubId } = req.params;

    const publication = await Publication.findOneAndDelete({ _id: pubId, owner: teacherId });
    if (!publication) {
      return res.status(404).json({ message: 'Publication not found or unauthorized' });
    }

    // Optional: Remove from Teacher if referenced
    await Teacher.findByIdAndUpdate(teacherId, {
      $pull: { publications: pubId }
    });

    res.status(200).json({ message: 'Publication deleted successfully' });
  } catch (err) {
    console.error("Error deleting publication:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const uploadMarks = async (req, res) => {
  try {
    const { subject, semester, internal } = req.body;
  
    // Ensure that all required fields are provided
    if (!subject || !semester || !internal) {
      return res.status(400).json({ message: 'Subject, Semester, and Internal are required' });
    }

    // Ensure `internal` can be parsed as a number
 

    // Check if file is provided
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Ensure that the uploaded file is an Excel file
    const allowedMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];

    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: 'Only Excel files (.xls, .xlsx) are allowed' });
    }

    // Parse Excel buffer using xlsx
    const fileBuffer = fs.readFileSync(req.file.path);
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    if (!sheet) {
      return res.status(400).json({ message: 'No sheet found in the uploaded Excel file' });
    }

    const rows = xlsx.utils.sheet_to_json(sheet);

    if (!rows.length) {
      return res.status(400).json({ message: 'Uploaded Excel file is empty' });
    }

    const resultsToInsert = [];
    const invalidRows = [];
    const mentorName = await Teacher.findById(req.userId).select("name");
    
    // Validate each row in the Excel file
    for (const row of rows) {
      const { rollNumber, marksObtained, totalMarks } = row;

      // Skip rows with missing or invalid data
      if (!rollNumber || marksObtained == null || totalMarks == null) {
        invalidRows.push(row);
        continue;
      }

      resultsToInsert.push({
        subjectCode: subject,
        semester: parseInt(semester),
        internalNumber: internal,  // Use the validated internalNumber here
        totalMarks: Number(totalMarks),
        marksObtained: Number(marksObtained),
        rollNumber: String(rollNumber),
        mentor: mentorName.name,
      
      });
    }

    // Insert valid rows into the database
    if (resultsToInsert.length) {
      await InternalResults.insertMany(resultsToInsert);
    }

    // Return a success message with the count of valid rows inserted and invalid rows skipped
    res.status(200).json({
      message: 'Marks uploaded successfully',
      insertedCount: resultsToInsert.length,
      skippedCount: invalidRows.length,
      invalidRows: invalidRows,
    });
  } catch (error) {
    console.error('Error uploading marks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Controller to fetch internal results based on query parameters
