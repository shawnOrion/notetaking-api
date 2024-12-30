const {
    createUsersTable,
    createNotesTable,
    createTagsTable,
    insertUser,
    insertTag,
    insertNote,
  } = require('./queries');
  
  const seedData = async () => {
    try {
      // Step 1: Create tables
      await createUsersTable();
      await createNotesTable();
      await createTagsTable();
  
      // Step 2: Insert seed data
      const userId = await insertUser('jane_23');
  
      await insertNote('Meeting Notes', 'Discuss project deadlines.', userId);
      await insertNote('Grocery List', 'Buy milk, eggs, and bread.', userId);
  
      console.log('Seed data inserted successfully.');
    } catch (error) {
      console.error('Error during database seeding:', error.message);
    }
  };
  
  seedData();
  