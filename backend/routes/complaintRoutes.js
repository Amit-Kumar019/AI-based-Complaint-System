const express = require('express');
const router = express.Router();
const { addComplaint, getComplaints, updateComplaintStatus, searchComplaints } = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addComplaint);
router.get('/', protect, getComplaints);
router.put('/:id', protect, updateComplaintStatus);
router.get('/search', protect, searchComplaints);

module.exports = router;
