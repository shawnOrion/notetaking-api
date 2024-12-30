const express = require('express');
const cors = require('cors');
const db = require('./db/queries'); // Import database queries

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes

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
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error.message);
        res.status(500).json({ error: 'Failed to fetch user.' });
    }
});

// Get notes for a user
app.get('/api/users/:userId/notes', async (req, res) => {
    const { userId } = req.params;
    try {
        const notes = await db.getNotesForUser(userId);
        res.status(200).json(notes);
    } catch (error) {
        console.error(`Error fetching notes for user ID ${userId}:`, error.message);
        res.status(500).json({ error: 'Failed to fetch notes.' });
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
    try {
        const noteId = await db.insertNote(title, content, userId, tagIds || []);
        res.status(201).json({ id: noteId });
    } catch (error) {
        console.error('Error creating note:', error.message);
        res.status(500).json({ error: 'Failed to create note.' });
    }
});

// Create a new tag
app.post('/api/tags', async (req, res) => {
    const { name, userId } = req.body;
    try {
        const tagId = await db.insertTag(name, userId);
        res.status(201).json({ id: tagId });
    } catch (error) {
        console.error('Error creating tag:', error.message);
        res.status(500).json({ error: 'Failed to create tag.' });
    }
});

// Update a note
app.put('/api/notes/:noteId', async (req, res) => {
    const { noteId } = req.params;
    const { title, content } = req.body;
    try {
        const updatedNote = await db.updateNote(noteId, title, content);
        if (!updatedNote) return res.status(404).json({ error: 'Note not found' });
        res.status(200).json(updatedNote);
    } catch (error) {
        console.error('Error updating note:', error.message);
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
