import 'dotenv/config';

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-unit-tests-min-32-chars!!';
process.env.DATABASE_URL = ''; // Use SQLite for tests
