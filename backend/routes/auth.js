const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const router = express.Router();

// Register endpoint
router.post(
  '/register',
  [
    body('student_id').notEmpty().withMessage('Student ID is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('department').notEmpty().withMessage('Department is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
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

      const { student_id, name, email, department, password } = req.body;

      // Check if student already exists
      const existingStudentByEmail = await Student.findByEmail(email);
      if (existingStudentByEmail) {
        return res.status(400).json({
          success: false,
          message: 'Student with this email already exists',
        });
      }

      const existingStudentById = await Student.findByStudentId(student_id);
      if (existingStudentById) {
        return res.status(400).json({
          success: false,
          message: 'Student with this ID already exists',
        });
      }

      // Create new student
      const newStudent = await Student.create({
        student_id,
        name,
        email,
        department,
        password,
      });

      res.status(201).json({
        success: true,
        message: 'Student registered successfully',
        data: newStudent,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
);

// Login endpoint
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
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

      const { email, password } = req.body;

      // Find student by email
      const student = await Student.findByEmail(email);
      if (!student) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // Verify password
      const isPasswordValid = await Student.verifyPassword(password, student.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: student.id,
          email: student.email,
          student_id: student.student_id,
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Remove password from response
      const { password: _, ...studentData } = student;

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          student: studentData,
          token,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
);

module.exports = router;
