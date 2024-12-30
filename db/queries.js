const pool = require('./pool');

// Create Users Table
const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL
    );
  `;
  try {
    await pool.query(query);
    console.log('Users table created successfully.');
  } catch (error) {
    console.error('Error creating Users table:', error.message);
  }
};

// Create Notes Table
const createNotesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Notes (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      isArchived BOOLEAN DEFAULT FALSE,
      userId INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
      tagIds INTEGER[] DEFAULT '{}' -- Default to an empty array
    );
  `;
  try {
    await pool.query(query);
    console.log('Notes table created successfully.');
  } catch (error) {
    console.error('Error creating Notes table:', error.message);
  }
};

// Create Tags Table
const createTagsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Tags (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      userId INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
      UNIQUE(name, userId)
    );
  `;
  try {
    await pool.query(query);
    console.log('Tags table created successfully.');
  } catch (error) {
    console.error('Error creating Tags table:', error.message);
  }
};

// Insert User
const insertUser = async (username) => {
  const query = `
    INSERT INTO Users (username)
    VALUES ($1)
    RETURNING id;
  `;
  try {
    const { rows } = await pool.query(query, [username]);
    return rows[0].id;
  } catch (error) {
    console.error('Error inserting user:', error.message);
  }
};

// Insert Note
const insertNote = async (title, content, userId, tagIds = []) => {
  const query = `
    INSERT INTO Notes (title, content, userId, tagIds)
    VALUES ($1, $2, $3, $4)
    RETURNING id;
  `;
  try {
    const { rows } = await pool.query(query, [title, content, userId, tagIds]);
    return rows[0].id;
  } catch (error) {
    console.error('Error inserting note:', error.message);
  }
};

// Insert Tag
const insertTag = async (name, userId) => {
  const query = `
    INSERT INTO Tags (name, userId)
    VALUES ($1, $2)
    RETURNING id;
  `;
  try {
    const { rows } = await pool.query(query, [name, userId]);
    return rows[0].id;
  } catch (error) {
    console.error('Error inserting tag:', error.message);
  }
};

// Get All Users
const getAllUsers = async () => {
  const query = `
    SELECT * FROM Users;
  `;
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error fetching users:', error.message);
  }
};

// Get Notes for a User
const getNotesForUser = async (userId) => {
  const query = `
    SELECT * FROM Notes
    WHERE userId = $1;
  `;
  try {
    const { rows } = await pool.query(query, [userId]);
    return rows;
  } catch (error) {
    console.error('Error fetching notes for user:', error.message);
  }
};

// Get Tags for a User
const getTagsForUser = async (userId) => {
  const query = `
    SELECT * FROM Tags
    WHERE userId = $1;
  `;
  try {
    const { rows } = await pool.query(query, [userId]);
    return rows;
  } catch (error) {
    console.error('Error fetching tags for user:', error.message);
  }
};
// Get user by ID
const getUserById = async (userId) => {
  const query = `
    SELECT * FROM Users WHERE id = $1;
  `;
  try {
    const { rows } = await pool.query(query, [userId]);
    return rows[0]; // Return the first user (ID is unique)
  } catch (error) {
    console.error('Error fetching user by ID:', error.message);
  }
};

// Update a note
const updateNote = async (noteId, title, content) => {
  const query = `
    UPDATE Notes
    SET title = $1, content = $2, updatedAt = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *;
  `;
  try {
    const { rows } = await pool.query(query, [title, content, noteId]);
    return rows[0];
  } catch (error) {
    console.error('Error updating note:', error.message);
  }
};

// Delete a note
const deleteNote = async (noteId) => {
  const query = `
    DELETE FROM Notes WHERE id = $1 RETURNING id;
  `;
  try {
    const { rows } = await pool.query(query, [noteId]);
    return rows[0];
  } catch (error) {
    console.error('Error deleting note:', error.message);
  }
};

// Archive/Unarchive a note
const toggleArchiveNote = async (noteId, isArchived) => {
  const query = `
    UPDATE Notes
    SET isArchived = $1, updatedAt = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *;
  `;
  try {
    const { rows } = await pool.query(query, [isArchived, noteId]);
    return rows[0];
  } catch (error) {
    console.error('Error toggling archive status:', error.message);
  }
};

// Filter notes for a user
const filterNotes = async (userId, archived, title) => {
  const query = `
    SELECT * FROM Notes
    WHERE userId = $1
    AND ($2::BOOLEAN IS NULL OR isArchived = $2)
    AND ($3::TEXT IS NULL OR title ILIKE '%' || $3 || '%');
  `;
  try {
    const { rows } = await pool.query(query, [userId, archived, title]);
    return rows;
  } catch (error) {
    console.error('Error filtering notes:', error.message);
  }
};

module.exports = {
  createUsersTable,
  createNotesTable,
  createTagsTable,
  insertUser,
  insertNote,
  insertTag,
  getAllUsers,
  getNotesForUser,
  getTagsForUser,
  getUserById,
  updateNote,
  deleteNote,
  toggleArchiveNote,
  filterNotes,
};
