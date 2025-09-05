const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const Complaint = require('../models/Complaint');
const router = express.Router();

// Get all complaints for logged-in student
router.get('/', authenticateToken, async (req, res) => {
  try {
    const complaints = await Complaint.findByStudentId(req.user.id);

    res.json({
      success: true,
      data: complaints,
    });
  } catch (error) {
    console.error('Complaints fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

// Create new complaint
router.post(
  '/',
  authenticateToken,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category')
      .isIn(['hostel', 'classroom', 'teacher', 'administrative', 'other'])
      .withMessage('Invalid category'),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { title, description, category, priority = 'medium' } = req.body;

      const newComplaint = await Complaint.create({
        student_id: req.user.id,
        title,
        description,
        category,
        priority,
      });

      res.status(201).json({
        success: true,
        message: 'Complaint submitted successfully',
        data: newComplaint,
      });
    } catch (error) {
      console.error('Complaint creation error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
);

// Get complaint by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Check if complaint belongs to the logged-in student
    if (complaint.student_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    console.error('Complaint fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

// Update complaint status (for students - limited)
router.put(
  '/:id/status',
  authenticateToken,
  [body('status').isIn(['Pending', 'In Progress', 'Resolved']).withMessage('Invalid status')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { status } = req.body;
      const complaintId = req.params.id;

      const updatedComplaint = await Complaint.updateStatus(complaintId, status, req.user.id);

      if (!updatedComplaint) {
        return res.status(404).json({
          success: false,
          message: 'Complaint not found or access denied',
        });
      }

      res.json({
        success: true,
        message: 'Complaint status updated successfully',
        data: updatedComplaint,
      });
    } catch (error) {
      console.error('Complaint status update error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
);

// Update complaint (full update)
router.put(
  '/:id',
  authenticateToken,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category')
      .isIn(['hostel', 'classroom', 'teacher', 'administrative', 'other'])
      .withMessage('Invalid category'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { title, description, category, priority = 'medium' } = req.body;
      const complaintId = req.params.id;

      const updatedComplaint = await Complaint.update(
        complaintId,
        { title, description, category, priority },
        req.user.id
      );

      if (!updatedComplaint) {
        return res.status(404).json({
          success: false,
          message: 'Complaint not found or access denied',
        });
      }

      res.json({
        success: true,
        message: 'Complaint updated successfully',
        data: updatedComplaint,
      });
    } catch (error) {
      console.error('Complaint update error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
);

// Update complaint status only
router.put(
  '/:id/status',
  authenticateToken,
  [body('status').isIn(['Pending', 'In Progress', 'Resolved']).withMessage('Invalid status')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { status } = req.body;
      const complaintId = req.params.id;

      const updatedComplaint = await Complaint.updateStatus(complaintId, status, req.user.id);

      if (!updatedComplaint) {
        return res.status(404).json({
          success: false,
          message: 'Complaint not found or access denied',
        });
      }

      res.json({
        success: true,
        message: `Complaint status updated to ${status}`,
        data: updatedComplaint,
      });
    } catch (error) {
      console.error('Complaint status update error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
);

// Delete complaint
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const complaintId = req.params.id;
    const deleted = await Complaint.delete(complaintId, req.user.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found or access denied',
      });
    }

    res.json({
      success: true,
      message: 'Complaint deleted successfully',
    });
  } catch (error) {
    console.error('Complaint deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

// Get complaints summary
router.get('/summary/stats', authenticateToken, async (req, res) => {
  try {
    const summary = await Complaint.getComplaintsSummary(req.user.id);

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Complaints summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

module.exports = router;
