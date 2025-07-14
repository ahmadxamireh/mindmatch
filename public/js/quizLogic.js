// run once the document is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    let score = 0; // track user score
    let currentQuestion = 0; // track current question index

    // get all question cards
    const cards = document.querySelectorAll(".card");
    const totalQuestions = cards.length - 1; // the last card is the result card so subtract 1

    // get score display elements
    const scoreText = document.getElementById("final-score-text");
    const scoreInput = document.getElementById("final-score-value");

    // show the result card if present (this is to counter some logic in adaptiveLogic.js)
    const resultCard = document.querySelector(".result-card");
    if (resultCard) resultCard.style.display = "block";

    // handle answer button clicks
    const buttons = document.querySelectorAll(".option");
    buttons.forEach((button) => {
        button.addEventListener("click", (e) => {

            // get the selected answer by the user and the correct answer of the question
            const selected = button.dataset.selectedAnswer;
            const correct = button.dataset.correctAnswer;

            // check if the selected answer is correct
            if (selected === correct) {
                score++;
                button.classList.add("correct"); // highlight green
            } else {
                button.classList.add("wrong"); // highlight red
            }

            // prevent multiple selections by disabling answer buttons
            document.querySelectorAll(".option").forEach(btn => {
                btn.disabled = true;
            });

            currentQuestion++;

            // re-enable the buttons for the next question after a delay (equal to swipe action delay + 50 ms)
            setTimeout(() => {
                document.querySelectorAll(".option").forEach(btn => {
                    btn.disabled = false;
                });
            }, 550);

            // if it's the last question, show the result card
            if (currentQuestion === totalQuestions) {
                showFinalCard();
            }
        });
    });

    // display the final score card and focus on the username input
    function showFinalCard() {
        scoreText.textContent = `You scored ${score} out of ${totalQuestions}`;
        scoreInput.value = score;
        document.querySelector('.result-card input[name="username"]').focus();
    }

    // validate username before submitting
    document.querySelector('.result-card form').addEventListener('submit', (e) => {
        const input = document.querySelector('input[name="username"]');
        const username = input.value.trim();

        input.value = username; // apply trimmed value

        // check username length
        if (username.length < 2 || username.length > 15) {
            e.preventDefault();
            alert("Username must be 2–15 characters long.");
            return;
        }

        // prevent double submission
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerText = "Submitting...";

        // validate allowed characters (letters, numbers, underscores, and one optional space)
        const isValid = /^\w+(?: \w+)?$/.test(username);
        if (!isValid) {
            e.preventDefault();
            alert("Username can only contain letters, numbers, underscores, and one space between two words.");
        }
    });
});