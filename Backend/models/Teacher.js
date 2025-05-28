import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true }, // Unique teacher identifier
  department: { type: String, required: true },
  subjects: [{ type: String }], // List of subjects they teach
  phone: { type: String, },
  role: { type: String, default: 'teacher' }, // Default role
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  publications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Publication' }],

});

export const Teacher = mongoose.model('Teacher', teacherSchema);
