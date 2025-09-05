const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const Student = require('../models/Student');
const Complaint = require('../models/Complaint');
const router = express.Router();

// Get student profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

// Get dashboard data (profile + complaints summary)
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    const complaintsSummary = await Complaint.getComplaintsSummary(req.user.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    res.json({
      success: true,
      data: {
        profile: student,
        complaintsSummary,
      },
    });
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

// Update student profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, department } = req.body;

    if (!name || !department) {
      return res.status(400).json({
        success: false,
        message: 'Name and department are required',
      });
    }

    const updatedStudent = await Student.updateProfile(req.user.id, {
      name,
      department,
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedStudent,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

module.exports = router;
