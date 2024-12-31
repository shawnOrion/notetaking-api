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

// Drop Users Table
const dropUsersTable = async () => {
  const query = `
      DROP TABLE IF EXISTS Users CASCADE;
  `;
  try {
      await pool.query(query);
      console.log('Users table dropped.');
  } catch (error) {
      console.error('Error dropping Users table:', error.message);
      throw error;
  }
};

// Drop Notes Table
const dropNotesTable = async () => {
  const query = `
      DROP TABLE IF EXISTS Notes CASCADE;
  `;
  try {
      await pool.query(query);
      console.log('Notes table dropped.');
  } catch (error) {
      console.error('Error dropping Notes table:', error.message);
      throw error;
  }
};

// Drop Tags Table
const dropTagsTable = async () => {
  const query = `
      DROP TABLE IF EXISTS Tags CASCADE;
  `;
  try {
      await pool.query(query);
      console.log('Tags table dropped.');
  } catch (error) {
      console.error('Error dropping Tags table:', error.message);
      throw error;
  }
};

// Create a new user
const insertUser = async (username) => {
  const query = `
    INSERT INTO Users (username)
    VALUES ($1)
    RETURNING id, username;
  `;
  try {
    const { rows } = await pool.query(query, [username]);
    return rows[0]; // Return the newly created user
  } catch (error) {
    console.error('Error inserting user:', error.message);
    throw error;
  }
};

// Get all users
const getAllUsers = async () => {
  const query = `
    SELECT id, username FROM Users;
  `;
  try {
    const { rows } = await pool.query(query);
    return rows; // Return an array of users
  } catch (error) {
    console.error('Error fetching users:', error.message);
    throw error;
  }
};

// Get user by ID
const getUserById = async (userId) => {
  const query = `
    SELECT id, username FROM Users WHERE id = $1;
  `;
  try {
    const { rows } = await pool.query(query, [userId]);
    if (rows.length === 0) {
      console.log(`No user found with ID: ${userId}`);
      return null;
    }
    return rows[0]; // Return the user object
  } catch (error) {
    console.error('Error fetching user by ID:', error.message);
    throw error;
  }
};

// Update an existing user
const updateUser = async (userId, username) => {
  const query = `
    UPDATE Users
    SET username = $1
    WHERE id = $2
    RETURNING id, username;
  `;
  try {
    const { rows } = await pool.query(query, [username, userId]);
    if (rows.length === 0) {
      console.log(`No user found to update with ID: ${userId}`);
      return null;
    }
    return rows[0]; // Return the updated user object
  } catch (error) {
    console.error('Error updating user:', error.message);
    throw error;
  }
};

// Delete a user by ID
const deleteUser = async (userId) => {
  const query = `
    DELETE FROM Users WHERE id = $1 RETURNING id;
  `;
  try {
    const { rows } = await pool.query(query, [userId]);
    if (rows.length === 0) {
      console.log(`No user found to delete with ID: ${userId}`);
      return null;
    }
    return rows[0]; // Return the ID of the deleted user
  } catch (error) {
    console.error('Error deleting user:', error.message);
    throw error;
  }
};




// Insert Note
// Insert Note
const insertNote = async (title, content, userId, tagIds = []) => {
  console.log('Data before insertion:', { title, content, userId, tagIds }); // Log data structure before insertion

  const query = `
    INSERT INTO Notes (title, content, userId, tagIds)
    VALUES ($1, $2, $3, $4)
    RETURNING id, title, content, createdAt, updatedAt, isArchived, userId, tagIds;
  `;
  try {
    const { rows } = await pool.query(query, [title, content, userId, tagIds]);
    console.log('Inserted note data:', rows[0]); // Log the data returned from the database
    return rows[0]; // Return full note data for verification
  } catch (error) {
    console.error('Error inserting note:', error.message);
    throw error; // Rethrow error for handling in the calling function
  }
};


// Insert Tag
const insertTag = async (name, userId) => {
  const query = `
    INSERT INTO Tags (name, userId)
    VALUES ($1, $2)
    RETURNING id, name, userId;
  `;
  try {
    const { rows } = await pool.query(query, [name, userId]);
    return rows[0]; // Return the newly created tag
  } catch (error) {
    console.error('Error inserting tag:', error.message);
    throw error;
  }
};

// Get all tags for a user
const getTagsForUser = async (userId) => {
  const query = `
    SELECT id, name, userId FROM Tags
    WHERE userId = $1;
  `;
  try {
    const { rows } = await pool.query(query, [userId]);
    return rows; // Return an array of tags
  } catch (error) {
    console.error('Error fetching tags for user:', error.message);
    throw error;
  }
};

// Get a tag by ID
const getTagById = async (tagId) => {
  const query = `
    SELECT id, name, userId FROM Tags
    WHERE id = $1;
  `;
  try {
    const { rows } = await pool.query(query, [tagId]);
    if (rows.length === 0) {
      console.log(`No tag found with ID: ${tagId}`);
      return null;
    }
    return rows[0]; // Return the tag object
  } catch (error) {
    console.error('Error fetching tag by ID:', error.message);
    throw error;
  }
};

// Update an existing tag
const updateTag = async (tagId, name) => {
  const query = `
    UPDATE Tags
    SET name = $1
    WHERE id = $2
    RETURNING id, name, userId;
  `;
  try {
    const { rows } = await pool.query(query, [name, tagId]);
    if (rows.length === 0) {
      console.log(`No tag found to update with ID: ${tagId}`);
      return null;
    }
    return rows[0]; // Return the updated tag object
  } catch (error) {
    console.error('Error updating tag:', error.message);
    throw error;
  }
};

// Delete a tag by ID
const deleteTag = async (tagId) => {
  const query = `
    DELETE FROM Tags WHERE id = $1 RETURNING id;
  `;
  try {
    const { rows } = await pool.query(query, [tagId]);
    if (rows.length === 0) {
      console.log(`No tag found to delete with ID: ${tagId}`);
      return null;
    }
    return rows[0]; // Return the ID of the deleted tag
  } catch (error) {
    console.error('Error deleting tag:', error.message);
    throw error;
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


// Update a note
const updateNote = async (noteId, title, content, tagIds = []) => {
  const query = `
    UPDATE Notes
    SET title = $1, content = $2, tagIds = $3, updatedAt = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING id, title, content, createdAt, updatedAt, isArchived, userId, tagIds;
  `;
  try {
    const { rows } = await pool.query(query, [title, content, tagIds, noteId]);
    if (rows.length === 0) {
      console.log(`No note found to update with ID: ${noteId}`);
      return null;
    }
    return rows[0]; // Return the updated note
  } catch (error) {
    console.error('Error updating note in database:', error.message);
    throw error;
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

// Search notes for a user
const searchNotes = async (userId, searchTerm) => {
  const query = `
    SELECT DISTINCT n.*
    FROM Notes n
    LEFT JOIN Tags t
    ON t.id = ANY(n.tagIds)
    WHERE n.userId = $1
    AND (
      $2::TEXT IS NULL 
      OR n.title ILIKE '%' || $2 || '%' 
      OR n.content ILIKE '%' || $2 || '%' 
      OR t.name ILIKE '%' || $2 || '%'
    )
    ORDER BY n.updatedAt DESC;
  `;
  try {
    const { rows } = await pool.query(query, [userId, searchTerm]);
    return rows;
  } catch (error) {
    console.error('Error searching notes:', error.message);
    throw error; // Re-throw for caller to handle
  }
};



module.exports = {
  insertUser,       // Create a new user
  getAllUsers,      // Fetch all users
  getUserById,      // Fetch a user by ID
  updateUser,       // Update an existing user
  deleteUser,       // Delete a user by ID
  dropUsersTable,
  dropNotesTable,
  dropTagsTable,
  createUsersTable,
  createNotesTable,
  createTagsTable,
  insertNote,
  insertTag,      // Create a new tag
  getTagsForUser, // Get all tags for a user
  getTagById,     // Get a tag by its ID
  updateTag,      // Update an existing tag
  deleteTag,      // Delete a tag by its ID
  getAllUsers,
  getNotesForUser,
  updateNote,
  deleteNote,
  toggleArchiveNote,
  searchNotes,
};
