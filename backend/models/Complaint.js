const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: "Pending"
  },
  aiAnalysis: {
    priority: String,
    department: String,
    summary: String,
    autoResponse: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
