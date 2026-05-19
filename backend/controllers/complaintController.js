const Complaint = require('../models/Complaint');

exports.addComplaint = async (req, res) => {
  const { name, email, title, description, category, location, aiAnalysis } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Validation error: Missing title field' });
  }
  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Validation error: Invalid email' });
  }

  try {
    const complaint = new Complaint({
      name,
      email,
      title,
      description,
      category,
      location,
      aiAnalysis
    });

    const createdComplaint = await complaint.save();
    res.status(201).json(createdComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
      complaint.status = req.body.status || complaint.status;

      const updatedComplaint = await complaint.save();
      res.json(updatedComplaint);
    } else {
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchComplaints = async (req, res) => {
  try {
    const keyword = req.query.location
      ? {
          location: {
            $regex: req.query.location,
            $options: 'i',
          },
        }
      : {};

    const complaints = await Complaint.find({ ...keyword });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
