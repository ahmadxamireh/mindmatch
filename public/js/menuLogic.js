// run once the document is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // select all chip inputs that belong to a category or difficulty group
    const allChips = document.querySelectorAll('.chip[data-group]');

    // select the start button
    const startBtn = document.getElementById("startBtn");

    // check if both category and difficulty are selected
    function checkSelections() {
        const categorySelected = document.querySelector('.chip[data-group="category"]:checked');
        const difficultySelected = document.querySelector('.chip[data-group="difficulty"]:checked');

        // enable start button only if both are selected
        startBtn.disabled = !(categorySelected && difficultySelected);
    }

    // handle chip selection logic
    allChips.forEach(chip => {
        chip.addEventListener('change', () => {
            const group = chip.dataset.group;

            // uncheck all in the same group except the clicked one
            if (chip.checked) {
                document.querySelectorAll(`.chip[data-group="${group}"]`).forEach(el => {
                    if (el !== chip) el.checked = false;
                });

                // update hidden input value based on selected chip
                if (group === "category") {
                    document.getElementById("selectedCategory").value = chip.value;
                } else if (group === "difficulty") {
                    document.getElementById("selectedDifficulty").value = chip.value;
                }
            }

            // re-check if both selections are made to enable the start button
            checkSelections();
        });
    });

    // run initial check in case a selection is pre-checked on load
    checkSelections();
});