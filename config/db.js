// import the 'knex' query builder and 'dotenv' for loading environment variables
import knex from 'knex';
import dotenv from 'dotenv';

// load environment variables from a .env file into process.env
dotenv.config();

// initialize knex with PostgreSQL configuration
const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 5432
    },
    seeds: {
        directory: '../db/seeds'
    }
})

export default db;