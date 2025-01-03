require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db/queries'); // Import database queries

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret', // Load session secret from .env or use fallback
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      const isValid = await bcrypt.compare(password, user.hashed_password);
      if (!isValid) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});


// Routes
// Signup route
// Signup route
app.post('/api/signup', async (req, res) => {
  console.group('Signup Route');
  console.log('Request Body:', req.body);

  const { username, password, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.insertUser(username, email, hashedPassword);
    const response = { message: 'User registered successfully.', user };
    console.log('Response Data:', response);
    res.status(201).json(response);
  } catch (error) {
    console.error('Error during signup:', error.message);
    res.status(500).json({ error: 'Failed to register user.' });
  } finally {
    console.groupEnd();
  }
});


// Login route
// Login route
app.post('/api/login', (req, res, next) => {
  console.group('Login Route');
  console.log('Request Body:', req.body);

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Error during login:', err.message);
      return res.status(500).json({ error: 'Internal server error.' });
    }
    if (!user) {
      console.warn('Login failed:', info.message);
      return res.status(401).json({ error: info.message });
    }
    req.login(user, (err) => {
      if (err) {
        console.error('Error during session creation:', err.message);
        return res.status(500).json({ error: 'Failed to login.' });
      }
      const response = { message: 'Login successful.', user };
      console.log('Response Data:', response);
      res.status(200).json(response);
    });
  })(req, res, next);

  console.groupEnd();
});

// Logout route
app.post('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err.message);
      return res.status(500).json({ error: 'Failed to logout.' });
    }
    res.status(200).json({ message: 'Logout successful.' });
  });
});

// Check authentication status
// Check authentication status
app.get('/api/auth/status', (req, res) => {
  console.group('Auth Status Route');
  console.log('Session Data:', req.session);

  if (req.isAuthenticated()) {
    const response = { isAuthenticated: true, user: req.user };
    console.log('Response Data:', response);
    res.status(200).json(response);
  } else {
    const response = { isAuthenticated: false };
    console.log('Response Data:', response);
    res.status(200).json(response);
  }

  console.groupEnd();
});



// Routes
// Create a new user
app.post('/api/users', async (req, res) => {
  console.group('Create User');
  const { username, email, password } = req.body;
  console.log('Request Data:', { username, email });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.insertUser(username, email, hashedPassword);
    console.log('Response Data:', user);
    res.status(201).json({ id: user.id, username: user.username, email: user.email });
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ error: 'Failed to create user.' });
  } finally {
    console.groupEnd();
  }
});
app.get('/api/users', async (req, res) => {
  console.group('Get All Users');
  try {
    const users = await db.getAllUsers();
    console.log('Response Data:', users);
    res.status(200).json(users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
    }))); // Exclude hashed_password
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: 'Failed to fetch users.' });
  } finally {
    console.groupEnd();
  }
});
 
app.get('/api/users/:userId', async (req, res) => {
  console.group('Get User by ID');
  const { userId } = req.params;
  console.log('Request Params:', { userId });

  try {
    const user = await db.getUserById(userId);
    if (!user) {
      console.warn('User not found:', { userId });
      return res.status(404).json({ error: 'User not found.' });
    }
    console.log('Response Data:', user);
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email, // Exclude hashed_password
    });
  } catch (error) {
    console.error('Error fetching user by ID:', error.message);
    res.status(500).json({ error: 'Failed to fetch user.' });
  } finally {
    console.groupEnd();
  }
});

app.put('/api/users/:userId', async (req, res) => {
  console.group('Update User');
  const { userId } = req.params;
  const { username, email, password } = req.body;
  console.log('Request Params:', { userId });
  console.log('Request Body:', { username, email });

  try {
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const updatedUser = await db.updateUser(userId, username, email, hashedPassword);
    if (!updatedUser) {
      console.warn('User not found:', { userId });
      return res.status(404).json({ error: 'User not found.' });
    }
    console.log('Response Data:', updatedUser);
    res.status(200).json({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email, // Exclude hashed_password
    });
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ error: 'Failed to update user.' });
  } finally {
    console.groupEnd();
  }
});

// Delete user
app.delete('/api/users/:userId', async (req, res) => {
  console.group('Delete User');
  const { userId } = req.params;
  console.log('Request Params:', { userId });

  try {
    const deletedUser = await db.deleteUser(userId);
    if (!deletedUser) {
      console.warn('User not found:', { userId });
      return res.status(404).json({ error: 'User not found.' });
    }
    console.log('Response Data:', deletedUser);
    res.status(200).json(deletedUser);
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ error: 'Failed to delete user.' });
  } finally {
    console.groupEnd();
  }
});

  // Get notes for a user
// Get notes for a user
app.get('/api/users/:userId/notes', async (req, res) => {
  console.group('Get Notes for User');
  const { userId } = req.params;
  console.log('Request Params:', { userId });

  try {
    const notes = await db.getNotesForUser(userId);
    
    // Return an empty array if no notes are found, but the user exists
    if (!notes || notes.length === 0) {
      console.log('No notes found for user:', { userId });
      return res.status(200).json([]); // Respond with an empty array and 200 status
    }

    console.log('Response Data:', notes);
    res.status(200).json(notes); // Respond with the notes if found
  } catch (error) {
    console.error('Error fetching notes for user:', error.message);
    res.status(500).json({ error: 'Failed to fetch notes for the user.' });
  } finally {
    console.groupEnd();
  }
});

  
  // Update a note
  app.put('/api/notes/:noteId', async (req, res) => {
    console.group('Update Note');
    const { noteId } = req.params;
    const { title, content, tagIds } = req.body;
    console.log('Request Params:', { noteId });
    console.log('Request Body:', { title, content, tagIds });
  
    try {
      const updatedNote = await db.updateNote(noteId, title, content, tagIds || []);
      if (!updatedNote) {
        console.warn('Note not found:', { noteId });
        return res.status(404).json({ error: 'Note not found' });
      }
      console.log('Response Data:', updatedNote);
      res.status(200).json(updatedNote);
    } catch (error) {
      console.error('Error updating note:', error.message);
      res.status(500).json({ error: 'Failed to update note.' });
    } finally {
      console.groupEnd();
    }
  });
// Filter notes for a user
// Search notes for a user
app.get('/api/users/:userId/notes/search', async (req, res) => {
  console.group('Search Notes for User');
  const { userId } = req.params;
  const { searchTerm } = req.query; // Extract search term from query parameters
  console.log('Request Params:', { userId });
  console.log('Query Params:', { searchTerm });

  try {
    const notes = await db.searchNotes(userId, searchTerm);
    console.log('Response Data:', notes);
    res.status(200).json(notes); // Return the matching notes
  } catch (error) {
    console.error('Error searching notes for user:', error.message);
    res.status(500).json({ error: 'Failed to search notes for the user.' });
  } finally {
    console.groupEnd();
  }
});


// Get tags for a user
app.get('/api/users/:userId/tags', async (req, res) => {
  console.group('Get Tags for User');
  const { userId } = req.params;
  console.log('Request Params:', { userId });

  try {
    const tags = await db.getTagsForUser(userId);
    console.log('Response Data:', tags);
    res.status(200).json(tags);
  } catch (error) {
    console.error('Error fetching tags for user:', error.message);
    res.status(500).json({ error: 'Failed to fetch tags.' });
  } finally {
    console.groupEnd();
  }
});

// Create a new note
app.post('/api/notes', async (req, res) => {
  console.group('Create Note');
  const { title, content, userId, tagIds } = req.body;
  console.log('Request Body:', req.body);

  try {
    const note = await db.insertNote(title, content, userId, tagIds || []);
    console.log('Response Data:', note);
    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note:', error.message);
    res.status(500).json({ error: 'Failed to create note.' });
  } finally {
    console.groupEnd();
  }
});

// Create a new tag
app.post('/api/tags', async (req, res) => {
  console.group('Create Tag');
  const { name, userId } = req.body;
  console.log('Request Body:', req.body);

  try {
    const tag = await db.insertTag(name, userId);
    console.log('Response Data:', tag);
    res.status(201).json(tag);
  } catch (error) {
    console.error('Error creating tag:', error.message);
    res.status(500).json({ error: 'Failed to create tag.' });
  } finally {
    console.groupEnd();
  }
});

// Get a tag by ID
app.get('/api/tags/:tagId', async (req, res) => {
  console.group('Get Tag by ID');
  const { tagId } = req.params;
  console.log('Request Params:', { tagId });

  try {
    const tag = await db.getTagById(tagId);
    if (!tag) {
      console.warn('Tag not found:', { tagId });
      return res.status(404).json({ error: 'Tag not found.' });
    }
    console.log('Response Data:', tag);
    res.status(200).json(tag);
  } catch (error) {
    console.error('Error fetching tag by ID:', error.message);
    res.status(500).json({ error: 'Failed to fetch tag.' });
  } finally {
    console.groupEnd();
  }
});

// Update a tag
app.put('/api/tags/:tagId', async (req, res) => {
  console.group('Update Tag');
  const { tagId } = req.params;
  const { name } = req.body;
  console.log('Request Params:', { tagId });
  console.log('Request Body:', { name });

  try {
    const updatedTag = await db.updateTag(tagId, name);
    if (!updatedTag) {
      console.warn('Tag not found:', { tagId });
      return res.status(404).json({ error: 'Tag not found.' });
    }
    console.log('Response Data:', updatedTag);
    res.status(200).json(updatedTag);
  } catch (error) {
    console.error('Error updating tag:', error.message);
    res.status(500).json({ error: 'Failed to update tag.' });
  } finally {
    console.groupEnd();
  }
});

// Delete a tag
app.delete('/api/tags/:tagId', async (req, res) => {
  console.group('Delete Tag');
  const { tagId } = req.params;
  console.log('Request Params:', { tagId });

  try {
    const deletedTag = await db.deleteTag(tagId);
    if (!deletedTag) {
      console.warn('Tag not found:', { tagId });
      return res.status(404).json({ error: 'Tag not found.' });
    }
    console.log('Response Data:', deletedTag);
    res.status(200).json(deletedTag);
  } catch (error) {
    console.error('Error deleting tag:', error.message);
    res.status(500).json({ error: 'Failed to delete tag.' });
  } finally {
    console.groupEnd();
  }
});

// Delete a note
app.delete('/api/notes/:noteId', async (req, res) => {
  console.group('Delete Note');
  const { noteId } = req.params;
  console.log('Request Params:', { noteId });

  try {
    const deletedNote = await db.deleteNote(noteId);
    if (!deletedNote) {
      console.warn('Note not found:', { noteId });
      return res.status(404).json({ error: 'Note not found.' });
    }
    console.log('Response Data:', deletedNote);
    res.status(200).json(deletedNote);
  } catch (error) {
    console.error('Error deleting note:', error.message);
    res.status(500).json({ error: 'Failed to delete note.' });
  } finally {
    console.groupEnd();
  }
});

// Archive/Unarchive a note
app.put('/api/notes/:noteId/archive', async (req, res) => {
  console.group('Archive/Unarchive Note');
  const { noteId } = req.params;
  const { isArchived } = req.body;
  console.log('Request Params:', { noteId });
  console.log('Request Body:', { isArchived });

  try {
    const updatedNote = await db.toggleArchiveNote(noteId, isArchived);
    if (!updatedNote) {
      console.warn('Note not found:', { noteId });
      return res.status(404).json({ error: 'Note not found.' });
    }
    console.log('Response Data:', updatedNote);
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error('Error toggling archive status:', error.message);
    res.status(500).json({ error: 'Failed to toggle archive status.' });
  } finally {
    console.groupEnd();
  }
});
  

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
