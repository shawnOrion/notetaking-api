const express = require('express');
const cors = require('cors');
const db = require('./db/queries'); // Import database queries

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes

// Create a new user
app.post('/api/users', async (req, res) => {
    const { username } = req.body;
  
    try {
      const user = await db.insertUser(username);
      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error.message);
      res.status(500).json({ error: 'Failed to create user.' });
    }
  });
  
  // Get all users
  app.get('/api/users', async (req, res) => {
    try {
      const users = await db.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error.message);
      res.status(500).json({ error: 'Failed to fetch users.' });
    }
  });
  
  // Get user by ID
  app.get('/api/users/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await db.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user by ID:', error.message);
      res.status(500).json({ error: 'Failed to fetch user.' });
    }
  });
  
  // Update user
  app.put('/api/users/:userId', async (req, res) => {
    const { userId } = req.params;
    const { username } = req.body;
  
    try {
      const updatedUser = await db.updateUser(userId, username);
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found.' });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error.message);
      res.status(500).json({ error: 'Failed to update user.' });
    }
  });
  
  // Delete user
  app.delete('/api/users/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const deletedUser = await db.deleteUser(userId);
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found.' });
      }
      res.status(200).json(deletedUser);
    } catch (error) {
      console.error('Error deleting user:', error.message);
      res.status(500).json({ error: 'Failed to delete user.' });
    }
  });
  

// Get notes for a user
// Get notes for a user
app.get('/api/users/:userId/notes', async (req, res) => {
    const { userId } = req.params;
  
    console.log('Request received for fetching notes:', { userId }); // Log the incoming request
  
    try {
      const notes = await db.getNotesForUser(userId);
      
      if (!notes || notes.length === 0) {
        console.log('No notes found for user:', { userId }); // Log if no notes are found
        return res.status(404).json({ error: 'No notes found for the user.' });
      }
  
      console.log('Fetched notes for user:', { userId, notes }); // Log the fetched notes
      res.status(200).json(notes);
    } catch (error) {
      console.error('Error fetching notes for user:', { userId, error: error.message }); // Log the error details
      res.status(500).json({ error: 'Failed to fetch notes for the user.' });
    }
  });
  
// Get tags for a user
app.get('/api/users/:userId/tags', async (req, res) => {
    const { userId } = req.params;
    try {
        const tags = await db.getTagsForUser(userId);
        res.status(200).json(tags);
    } catch (error) {
        console.error(`Error fetching tags for user ID ${userId}:`, error.message);
        res.status(500).json({ error: 'Failed to fetch tags.' });
    }
});

// Filter notes for a user
app.get('/api/users/:userId/notes/filter', async (req, res) => {
    const { userId } = req.params;
    const { archived, title } = req.query;
    try {
        const notes = await db.filterNotes(userId, archived === 'true', title);
        res.status(200).json(notes);
    } catch (error) {
        console.error('Error filtering notes:', error.message);
        res.status(500).json({ error: 'Failed to filter notes.' });
    }
});

// Create a new user
app.post('/api/users', async (req, res) => {
    const { username } = req.body;
    try {
        const userId = await db.insertUser(username);
        res.status(201).json({ id: userId });
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).json({ error: 'Failed to create user.' });
    }
});

// Create a new note
app.post('/api/notes', async (req, res) => {
    const { title, content, userId, tagIds } = req.body;

    console.log('Received request body:', req.body); // Log the incoming request body

    try {
        const note = await db.insertNote(title, content, userId, tagIds || []);
        res.status(201).json(note); // Return the entire note object directly
    } catch (error) {
        console.error('Error creating note:', error.message);
        res.status(500).json({ error: 'Failed to create note.' });
    }
});


// Create a new tag
app.post('/api/tags', async (req, res) => {
  const { name, userId } = req.body;

  try {
    const tag = await db.insertTag(name, userId);
    res.status(201).json(tag);
  } catch (error) {
    console.error('Error creating tag:', error.message);
    res.status(500).json({ error: 'Failed to create tag.' });
  }
});

// Get all tags for a user
app.get('/api/users/:userId/tags', async (req, res) => {
  const { userId } = req.params;

  try {
    const tags = await db.getTagsForUser(userId);
    res.status(200).json(tags);
  } catch (error) {
    console.error('Error fetching tags for user:', error.message);
    res.status(500).json({ error: 'Failed to fetch tags.' });
  }
});

// Get a tag by ID
app.get('/api/tags/:tagId', async (req, res) => {
  const { tagId } = req.params;

  try {
    const tag = await db.getTagById(tagId);
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found.' });
    }
    res.status(200).json(tag);
  } catch (error) {
    console.error('Error fetching tag by ID:', error.message);
    res.status(500).json({ error: 'Failed to fetch tag.' });
  }
});

// Update a tag
app.put('/api/tags/:tagId', async (req, res) => {
  const { tagId } = req.params;
  const { name } = req.body;

  try {
    const updatedTag = await db.updateTag(tagId, name);
    if (!updatedTag) {
      return res.status(404).json({ error: 'Tag not found.' });
    }
    res.status(200).json(updatedTag);
  } catch (error) {
    console.error('Error updating tag:', error.message);
    res.status(500).json({ error: 'Failed to update tag.' });
  }
});

// Delete a tag
app.delete('/api/tags/:tagId', async (req, res) => {
  const { tagId } = req.params;

  try {
    const deletedTag = await db.deleteTag(tagId);
    if (!deletedTag) {
      return res.status(404).json({ error: 'Tag not found.' });
    }
    res.status(200).json(deletedTag);
  } catch (error) {
    console.error('Error deleting tag:', error.message);
    res.status(500).json({ error: 'Failed to delete tag.' });
  }
});

// Update a note
app.put('/api/notes/:noteId', async (req, res) => {
    const { noteId } = req.params;
    const { title, content, tagIds } = req.body;
  
    console.log('Update request received for note:', { noteId, title, content, tagIds }); // Log incoming data
  
    try {
      const updatedNote = await db.updateNote(noteId, title, content, tagIds || []);
      if (!updatedNote) {
        console.error('Note not found:', { noteId });
        return res.status(404).json({ error: 'Note not found' });
      }
  
      console.log('Successfully updated note:', updatedNote); // Log success
      res.status(200).json(updatedNote);
    } catch (error) {
      console.error('Error updating note:', error.message); // Log error
      res.status(500).json({ error: 'Failed to update note.' });
    }
});
  
// Delete a note
app.delete('/api/notes/:noteId', async (req, res) => {
    const { noteId } = req.params;
    try {
        const deletedNote = await db.deleteNote(noteId);
        if (!deletedNote) return res.status(404).json({ error: 'Note not found' });
        res.status(200).json(deletedNote);
    } catch (error) {
        console.error('Error deleting note:', error.message);
        res.status(500).json({ error: 'Failed to delete note.' });
    }
});

// Archive/Unarchive a note
app.put('/api/notes/:noteId/archive', async (req, res) => {
    const { noteId } = req.params;
    const { isArchived } = req.body;
    try {
        const updatedNote = await db.toggleArchiveNote(noteId, isArchived);
        if (!updatedNote) return res.status(404).json({ error: 'Note not found' });
        res.status(200).json(updatedNote);
    } catch (error) {
        console.error('Error toggling archive status:', error.message);
        res.status(500).json({ error: 'Failed to toggle archive status.' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
