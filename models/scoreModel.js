// database-related logic for leaderboard

import db from '../config/db.js';

// add a new score to the leaderboard
export async function addScore(user_id, score, category, difficulty) {
    return db("scores").insert({ user_id, score, category, difficulty });
}

// get top 10 scores, optionally filtered by category
export async function getTopScores(category) {
    const query = db("scores")
        .join("users", "scores.user_id", "users.id")
        .select(
            "users.username",
            "scores.score",
            "scores.category",
            "scores.difficulty",
            "scores.created_at"
        )
        .orderBy("scores.score", "desc")
        .limit(10);

    // filter the results if a specific category is provided
    if (category && category !== "All Categories") {
        query.where("scores.category", category);
    }

    return query;
}