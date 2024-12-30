const pool = require('./pool');

// Function to create the `users` table
async function createUserTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE
        );
    `;

    try {
        console.log('Creating users table...');
        await pool.query(query);
        console.log('Users table created successfully.');
    } catch (error) {
        console.error('Error creating users table:', error.message);
        throw error;
    }
}

// Function to fetch all users
async function getUsers() {
    const query = 'SELECT * FROM users ORDER BY id ASC';

    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching users:', error.message);
        throw error;
    }
}

// Function to create a new user
async function createUser(username) {
    const query = `
        INSERT INTO users (username)
        VALUES ($1)
        RETURNING *;
    `;
    const values = [username];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating user:', error.message);
        throw error;
    }
}

module.exports = {
    createUserTable,
    getUsers,
    createUser,
};
