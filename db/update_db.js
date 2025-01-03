const { 
    dropUsersTable, 
    dropNotesTable, 
    dropTagsTable, 
    createUsersTable, 
    createNotesTable, 
    createTagsTable 
} = require('./queries');

async function main() {
    try {
        // Drop tables
        console.log('Dropping the Notes table...');
        await dropNotesTable();
        console.log('Dropped the Notes table.');

        console.log('Dropping the Tags table...');
        await dropTagsTable();
        console.log('Dropped the Tags table.');

        console.log('Dropping the Users table...');
        await dropUsersTable();
        console.log('Dropped the Users table.');

        // Recreate tables
        console.log('Creating the Users table...');
        await createUsersTable();
        console.log('Created the Users table.');

        console.log('Creating the Notes table...');
        await createNotesTable();
        console.log('Created the Notes table.');

        console.log('Creating the Tags table...');
        await createTagsTable();
        console.log('Created the Tags table.');

    } catch (error) {
        console.error('Error during table update execution:', error.message);
    } finally {
        console.log('Update database script complete.');
        process.exit();
    }
}

main();
