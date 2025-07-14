// run once the document is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    let score = 0; // track user score
    let currentIndex = 0; // track how many questions have been shown
    const asked = new Set(); // keep track of previously asked questions

    // select necessary DOM elements
    const scoreText = document.getElementById("final-score-text");
    const scoreInput = document.getElementById("final-score-value");
    const title = document.querySelector(".card-title");
    const questionEl = document.querySelector(".card-content p");
    const buttons = document.querySelectorAll(".option");
    const difficultyBadge = document.querySelector(".difficulty-badge");

    // get the first question from the server-injected global variable
    let currentQuestion = window.firstQuestion;
    renderQuestion(currentQuestion);

    // handle option button clicks
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const selected = button.dataset.selectedAnswer;
            const correct = button.dataset.correctAnswer;

            disableButtons(); // prevent clicking multiple answers

            // if selected answer is correct -> increase question difficulty
            if (selected === correct) {
                score++;
                button.classList.add("correct");
                window.currentDifficulty = increaseDifficulty(window.currentDifficulty);
            } else { // else decrease difficulty
                button.classList.add("wrong");
                window.currentDifficulty = decreaseDifficulty(window.currentDifficulty);
            }

            setTimeout(() => {
                if (currentIndex === 9) {
                    showFinalCard(); // end the quiz after 10 questions
                    return;
                }

                const nextQuestion = getNextQuestion();

                // end the quiz early if no more questions are available
                if (!nextQuestion.options || nextQuestion.options.length === 0) {
                    showFinalCard();
                    return;
                }

                currentIndex++;
                currentQuestion = nextQuestion;
                renderQuestion(currentQuestion);
                resetButtons();
            }, 500);
        });
    });

    // returns the next question based on current difficulty and asked questions Set()
    function getNextQuestion() {
        let group = window.groupedByDifficulty[window.currentDifficulty] || [];

        // remove already asked questions from the current difficulty pool
        group = group.filter(q => !asked.has(q.question));

        if (group.length === 0) {
            // fallback: search all remaining questions in other difficulties
            const all = [ "easy", "medium", "hard" ]
                .flatMap(d => window.groupedByDifficulty[d])
                .filter(q => !asked.has(q.question));

            if (all.length === 0) {
                return { question: "No more questions.", correct_answer: "", options: [] };
            }
            group = all;
        }

        // randomly pick a question from the remaining pool
        const q = group[Math.floor(Math.random() * group.length)];

        // mark the question as asked
        asked.add(q.question);

        return q;
    }

    // renders the question and its options on the screen
    function renderQuestion(q) {
        title.textContent = `Question ${currentIndex + 1}`;
        questionEl.textContent = q.question;

        // update the difficulty label and styling
        difficultyBadge.textContent = q.difficulty;
        difficultyBadge.classList.remove('easy', 'medium', 'hard');
        difficultyBadge.classList.add(q.difficulty.toLowerCase());

        // render each answer option into a button
        buttons.forEach((btn, i) => {
            const span = btn.querySelector("span");
            if (span) span.textContent = q.options[i];
            btn.dataset.selectedAnswer = q.options[i];
            btn.dataset.correctAnswer = q.correct_answer;
            btn.classList.remove("correct", "wrong");
            btn.disabled = false;
        });
    }

    // resets button states before showing a new question
    function resetButtons() {
        buttons.forEach((btn) => {
            btn.classList.remove("correct", "wrong");
            btn.disabled = false;
        });
    }

    // disables all buttons to prevent double clicking
    function disableButtons() {
        buttons.forEach((btn) => (btn.disabled = true));
    }

    // increases the difficulty level
    function increaseDifficulty(level) {
        if (level === "easy") return "medium";
        if (level === "medium") return "hard";
        return "hard";
    }

    // decreases the difficulty level
    function decreaseDifficulty(level) {
        if (level === "hard") return "medium";
        if (level === "medium") return "easy";
        return "easy";
    }

    // shows the final score card and focus on the username input
    function showFinalCard() {
        document.querySelector(".quiz-card").style.display = "none";
        document.querySelector(".result-card").style.display = "block";
        scoreText.textContent = `You scored ${score} out of 10`;
        scoreInput.value = score;
        document.querySelector('input[name="username"]').focus();
    }
});