const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class Student {
  static async create(studentData) {
    const { student_id, name, email, department, password } = studentData;

    try {
      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const [result] = await pool.execute(
        'INSERT INTO students (student_id, name, email, department, password) VALUES (?, ?, ?, ?, ?)',
        [student_id, name, email, department, hashedPassword]
      );

      return { id: result.insertId, student_id, name, email, department };
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute('SELECT * FROM students WHERE email = ?', [email]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, student_id, name, email, department, created_at FROM students WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findByStudentId(student_id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM students WHERE student_id = ?', [
        student_id,
      ]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateProfile(id, updateData) {
    const { name, department } = updateData;
    try {
      await pool.execute('UPDATE students SET name = ?, department = ? WHERE id = ?', [
        name,
        department,
        id,
      ]);
      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Student;
