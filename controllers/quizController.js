// controller logic for quiz routes: fetches questions from the model and passes them to EJS views

import * as Questions from '../models/questionModel.js'; // import question model functions
import { shuffleArray } from '../utils/shuffleArray.js'; // import utility function to shuffle arrays

// renders the initial welcome screen
export function renderWelcome(req, res) {
    res.render("welcome");
}

// renders the category/difficulty selection menu
export function renderMenu(req, res) {
    res.render("menu");
}

// handles quiz start logic: fetches questions, shuffles them and their options, and renders the quiz view
export async function startQuiz(req, res) {
    try {
        const { category, difficulty } = req.body;

        if (!category || !difficulty) {
            // if either field is missing, redirect to main menu
            return res.redirect("/mindrift/menu");
        }

        // fetch questions from the DB based on quiz mode
        let questions;

        if (difficulty === 'Adaptive') {
            // fetch all questions for adaptive mode (all difficulties)
            questions = await Questions.adaptiveFetch(category);
        } else {
            questions = await Questions.fetchQuestions(category, difficulty);
        }

        // if no questions found, send an error response
        if (!questions || questions.length === 0) {
            console.log(req.body)
            console.log(questions)
            return res.status(400).send("No questions found for this category/difficulty.");
        }

        // shuffle questions order
        const shuffledQuestions = shuffleArray(questions);

        // shuffle options inside each question
        shuffledQuestions.forEach(q => {
            q.options = shuffleArray(q.options);
        });

        if (difficulty === 'Adaptive') {
            // group questions by difficulty for adaptive quizzes
            const groupedByDifficulty = {
                easy: shuffledQuestions.filter(q => q.difficulty === "Easy"),
                medium: shuffledQuestions.filter(q => q.difficulty === "Medium"),
                hard: shuffledQuestions.filter(q => q.difficulty === "Hard")
            };

            // by default, start with the first easy shuffled question
            const firstQuestion = groupedByDifficulty['easy'][0];

            // render adaptive quiz view
            res.render("adaptive-quiz", { firstQuestion, groupedByDifficulty, category, difficulty });
        } else {
            // render normal quiz view with shuffled questions
            res.render("quiz", { shuffledQuestions, category, difficulty });
        }
    } catch (err) {
        console.error("Error starting quiz:", err);
        res.status(500).send("Unable to start quiz right now.");
    }
}

// import user and leaderboard model logic
import * as Users from "../models/userModel.js";
import * as Leaderboard from "../models/scoreModel.js";

// handles score submission after the quiz ends
export async function submitScore(req, res) {
    let { username, score, category, difficulty } = req.body;

    // remove leading/trailing white spaces and validate username
    username = (username ?? "").trim();

    // length check: 2–15 characters
    if (username.length < 2 || username.length > 15) {
        return res.status(400).send("Username must be 2-15 characters long.");
    }

    // using regex: allow only letters, numbers, underscores, and at most one space between two words
    if (!/^\w+(?: \w+)?$/.test(username)) {
        return res.status(400).send("Username may contain letters, numbers, underscores, and a single space between two words.");
    }

    // ensure all fields are present and valid
    if (!username || isNaN(score) || !category || !difficulty) {
        return res.redirect("/mindrift/menu");
    }

    try {
        // check if user exists, otherwise create a new one
        let user = await Users.findUser(username);
        if (!user) user = await Users.createUser(username);

        // save the score to the leaderboard
        await Leaderboard.addScore(
            user.id,
            Number(score),
            category,
            difficulty
        );

        // redirect to leaderboard
        res.redirect("/mindrift/leaderboard");
    } catch (err) {
        console.error("Error saving score:", err);
        res.status(500).send("Failed to save score");
    }
}

// renders the leaderboard view, optionally filtered by category
export async function showLeaderboard(req, res) {
    const { category } = req.query;

    try {
        // get top scores (filtered if category provided)
        const scores = await Leaderboard.getTopScores(category);

        // get all available quiz categories for dropdown selection
        const categories = await Questions.getAllCategories();

        // render the leaderboard view
        res.render("leaderboard", {
            scores,
            selectedCategory: category || "All Categories",
            categories
        });
    } catch (err) {
        console.error("Error fetching leaderboard:", err);
        res.status(500).send("Could not load leaderboard.");
    }
}