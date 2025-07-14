// database-related logic for questions

import db from '../config/db.js';

// fetch a fixed number of questions by category and difficulty
export async function fetchQuestions(category, difficulty, numberOfQuestions = 10) {
    try {
        return await db('questions')
            .where({ category, difficulty })
            .select('id', 'category', 'difficulty', 'question', 'correct_answer', 'options')
            .limit(numberOfQuestions);
    } catch (err) {
        throw new Error(`Error fetching questions: ${err.message}`);
    }
}

// fetch all questions for a category (used in adaptive mode)
export async function adaptiveFetch(category) {
    try {
        return await db('questions')
            .where({ category })
            .select('id', 'category', 'difficulty', 'question', 'correct_answer', 'options');
    } catch (err) {
        throw new Error(`Error fetching one question: ${err.message}`);
    }
}

// get all distinct quiz categories from the database
export async function getAllCategories() {
    const rows = await db("questions").distinct("category").orderBy("category");
    return rows.map(row => row.category);
}