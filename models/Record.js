class Record {
  static async create(recordData) {
    const { amount, type, category, description, userId } = recordData;
    const [result] = await pool.query(
      `INSERT INTO records 
       (amount, type, category, description, user_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [amount, type, category, description, userId]
    );
    return result.insertId;
  }

  static async findByUser(userId) {
    const [rows] = await pool.query(
      `SELECT id, amount, type, category, description, created_at 
       FROM records WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  }
}

module.exports = Record;