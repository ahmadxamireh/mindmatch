// import express and the quiz controller
import express from "express";
import * as Controller from '../controllers/quizController.js';

const router = express.Router();

// route to render the welcome page
router.get("/", Controller.renderWelcome);

// route to show the quiz selection menu
router.get("/menu", Controller.renderMenu);

// route to start the quiz after user selects category and difficulty
router.post("/quiz", Controller.startQuiz);

// route to submit the user's score after finishing the quiz
router.post("/leaderboard", Controller.submitScore);

// route to display the leaderboard
router.get("/leaderboard", Controller.showLeaderboard);

export default router;