import mongoose from 'mongoose';

const publicationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  journal: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  }
}, {
  timestamps: true
});

const Publication = mongoose.model('Publication', publicationSchema);
export  {Publication}
