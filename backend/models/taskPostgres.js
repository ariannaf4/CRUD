const { pgPool } = require('../config/database');

class TaskPostgres {
  static async create(title, description, dueDate, userId) {
    const query = `
      INSERT INTO tasks (title, description, due_date, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, title, description, due_date, completed, user_id, created_at
    `;
    const result = await pgPool.query(query, [title, description, dueDate, userId]);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = 'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await pgPool.query(query, [userId]);
    return result.rows;
  }

  static async findById(id, userId) {
    const query = 'SELECT * FROM tasks WHERE id = $1 AND user_id = $2';
    const result = await pgPool.query(query, [id, userId]);
    return result.rows[0];
  }

  static async update(id, title, description, dueDate, completed, userId) {
    const query = `
      UPDATE tasks 
      SET title = $1, description = $2, due_date = $3, completed = $4
      WHERE id = $5 AND user_id = $6
      RETURNING *
    `;
    const result = await pgPool.query(query, [title, description, dueDate, completed, id, userId]);
    return result.rows[0];
  }

  static async delete(id, userId) {
    const query = 'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id';
    const result = await pgPool.query(query, [id, userId]);
    return result.rows[0];
  }
}

module.exports = TaskPostgres;
