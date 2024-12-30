const {
    getAllUsers,
    getNotesForUser,
  } = require('./queries');
  
  const testDatabase = async () => {
    try {
      // Fetch all users
      const users = await getAllUsers();
      console.log('Users:', users);
  
      if (users.length === 0) {
        console.log('No users found. Please add users to test further.');
        return;
      }
  
      // Fetch notes for the first user
      const firstUserId = users[0].id;
      const notes = await getNotesForUser(firstUserId);
      console.log(`Notes for user ID ${firstUserId}:`, notes);
    } catch (error) {
      console.error('Error testing database:', error.message);
    }
  };
  
  testDatabase();
  