// database-related logic for users

import db from '../config/db.js';

// check if the username already exists
export async function findUser(username) {
    const [ existingUser ] = await db('users').where({ username });
    if (existingUser) return existingUser;
}

// create a new user
export async function createUser(username) {
    // insert the new username into the db
    try {
        const [ newUser ] = await db('users').insert({ username }).returning('*');
        return newUser;
    } catch (err) {
        throw new Error('Username creation failed: ' + err.message);
    }
}