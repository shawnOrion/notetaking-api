const { dropUsersTable, dropNotesTable, dropTagsTable } = require('./queries');

async function main() {
    try {
        console.log('Dropping the Notes table...');
        await dropNotesTable();
        console.log('Dropped the Notes table.');

        console.log('Dropping the Tags table...');
        await dropTagsTable();
        console.log('Dropped the Tags table.');

        console.log('Dropping the Users table...');
        await dropUsersTable();
        console.log('Dropped the Users table.');

    } catch (error) {
        console.error('Error during table drop execution:', error.message);
    } finally {
        console.log('Drop tables script complete.');
        process.exit();
    }
}

main();
