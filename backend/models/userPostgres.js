const { pgPool } = require('../config/database');

class UserPostgres {
  static async create(username, email, hashedPassword) {
    const query = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at
    `;
    const result = await pgPool.query(query, [username, email, hashedPassword]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pgPool.query(query, [email]);
    return result.rows[0];
  }

  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pgPool.query(query, [username]);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT id, username, email, created_at FROM users ORDER BY id';
    const result = await pgPool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT id, username, email, created_at FROM users WHERE id = $1';
    const result = await pgPool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, username, email) {
    const query = `
      UPDATE users 
      SET username = $1, email = $2
      WHERE id = $3
      RETURNING id, username, email, created_at
    `;
    const result = await pgPool.query(query, [username, email, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const result = await pgPool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = UserPostgres;
