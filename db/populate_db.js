const { createTables, createUser } = require('./queries');

async function main() {
    try {
        await createTables();

        console.log('Populating database with sample data...');
        await createUser('John Doe', 'https://example.com/image1.png');
        await createUser('Jane Smith', 'https://example.com/image2.png');
        console.log('Sample data added successfully.');
    } catch (error) {
        console.error('Error populating database:', error.message);
    }
}

main();
