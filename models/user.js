const db = require('../config/database');

class User {
    static async create(userData) {
        const { email, password_hash, first_name, last_name, phone_number, role } = userData;
        
        const query = `
            INSERT INTO users (email, password_hash, first_name, last_name, phone_number, role) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const values = [email, password_hash, first_name, last_name, phone_number, role || 'buyer'];
        
        try {
            const result = await db.query(query, values);
            return { id: result.lastID, ...userData };
        } catch (error) {
            throw error;
        }
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = ?';
        const result = await db.query(query, [email]);
        return result.rows[0];
    }

    static async findById(id) {
        const query = 'SELECT * FROM users WHERE id = ?';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    // Add other methods with SQLite syntax...
}