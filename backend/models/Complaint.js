const { pool } = require('../config/database');

class Complaint {
  static async create(complaintData) {
    const { student_id, title, description, category, priority = 'medium' } = complaintData;

    try {
      const [result] = await pool.execute(
        'INSERT INTO complaints (student_id, title, description, category, priority) VALUES (?, ?, ?, ?, ?)',
        [student_id, title, description, category, priority]
      );

      return await this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM complaints WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findByStudentId(student_id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM complaints WHERE student_id = ? ORDER BY created_at DESC',
        [student_id]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getComplaintsSummary(student_id) {
    try {
      const [rows] = await pool.execute(
        `
        SELECT 
          status,
          COUNT(*) as count
        FROM complaints 
        WHERE student_id = ? 
        GROUP BY status
      `,
        [student_id]
      );

      const summary = {
        pending: 0,
        inProgress: 0,
        resolved: 0,
        total: 0,
      };

      rows.forEach((row) => {
        const count = parseInt(row.count);
        summary.total += count;

        switch (row.status) {
          case 'Pending':
            summary.pending = count;
            break;
          case 'In Progress':
            summary.inProgress = count;
            break;
          case 'Resolved':
            summary.resolved = count;
            break;
        }
      });

      return summary;
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(id, status, student_id) {
    try {
      await pool.execute('UPDATE complaints SET status = ? WHERE id = ? AND student_id = ?', [
        status,
        id,
        student_id,
      ]);
      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  static async update(id, complaintData, student_id) {
    const { title, description, category, priority = 'medium' } = complaintData;

    try {
      await pool.execute(
        'UPDATE complaints SET title = ?, description = ?, category = ?, priority = ? WHERE id = ? AND student_id = ?',
        [title, description, category, priority, id, student_id]
      );
      return await this.findById(id);
    } catch (error) {
      throw error;
    }
  }

  static async delete(id, student_id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM complaints WHERE id = ? AND student_id = ?',
        [id, student_id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Complaint;
