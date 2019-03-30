const path = require('path');

const BASE_PATH = path.join(__dirname, 'src', 'db');

module.exports = {
    test: {
        connection: 'postgres://postgres:hunter2@localhost:5432/zombieaggies_test',
        migrations: {
            directory: path.join(BASE_PATH, 'migrations'),
        },
        seeds: {
            directory: path.join(BASE_PATH, 'seeds'),
        },
        client: 'pg',
    },
    development: {
        connection: 'postgres://postgres:hunter2@localhost:5432/zombieaggies_dev',
        migrations: {
            directory: path.join(BASE_PATH, 'migrations'),
        },
        seeds: {
            directory: path.join(BASE_PATH, 'seeds'),
        },
        client: 'pg',
    },
    production: {
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: path.join(BASE_PATH, 'migrations'),
        },
        seeds: {
            directory: path.join(BASE_PATH, 'seeds'),
        },
        client: 'pg',
    },
};
