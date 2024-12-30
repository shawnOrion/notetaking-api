const { createUserTable, getUsers, createUser } = require('./queries');

async function main() {
    try {
        console.log('Ensuring the users table exists...');
        await createUserTable();

        console.log('Adding a new user...');
        const user = await createUser('test_user');
        console.log('Created user:', user);

        console.log('Fetching all users...');
        const users = await getUsers();
        console.log('All users:', users);
    } catch (error) {
        console.error('Error during test script execution:', error.message);
    } finally {
        console.log('Test script complete.');
        process.exit();
    }
}

main();
