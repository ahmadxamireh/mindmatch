// credit: https://codepen.io/emilandersson/pen/jEbOKed
// I modified the code slightly to match my requirements

// run once the document is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    let cards = [ ...document.querySelectorAll(".card") ];

    let nextDirection = 1; // keep track of alternation (-1 = left, 1 = right)
    let isSwiping = false;

    /* --------------- your helper functions ------------- */
    const getDurationFromCSS = (v, el = document.documentElement) => {
        const value = getComputedStyle(el)?.getPropertyValue(v)?.trim() || "0ms";
        return value.endsWith("ms")
            ? parseFloat(value)
            : value.endsWith("s")
                ? parseFloat(value) * 1000
                : parseFloat(value);
    };
    const getActiveCard = () => cards[0];
    const updatePositions = () => {
        cards.forEach((card, i) => {
            card.style.setProperty("--i", i + 1);
            card.style.setProperty("--swipe-x", "0px");
            card.style.setProperty("--swipe-rotate", "0deg");
            card.style.opacity = "1";
        });
    };

    /* -------------------- SWIPE helper ----------------- */
    function animateSwipe(direction) {
        const card = getActiveCard();
        if (!card) return;
        const duration = getDurationFromCSS("--card-swap-duration");

        /* move it off-screen */
        card.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
        card.style.setProperty("--swipe-x", `${direction * 800}px`);
        card.style.setProperty("--swipe-rotate", `${direction * 10}deg`);

        /* little overshoot for flavour */
        setTimeout(() => {
            card.style.setProperty("--swipe-rotate", `${-direction * 10}deg`);
        }, duration * 0.5);

        /* after animation is done, send card to the back */
        setTimeout(() => {
            cards = [ ...cards.slice(1), card ];
            updatePositions();
        }, duration);
    }

    /* ------------------ BUTTON HANDLER ----------------- */
    function handleButtonClick() {
        /* ignore if a swipe animation is currently running */
        if (isSwiping) return;
        isSwiping = true;

        /* perform the swipe */
        const dir = nextDirection;
        nextDirection = -nextDirection; // flip for next time
        /* ⏱ wait 1 second so the user sees the colour feedback */
        setTimeout(() => {
            animateSwipe(dir);

            /* re-enable swiping after the animation finishes */
            const duration = getDurationFromCSS("--card-swap-duration");
            setTimeout(() => (isSwiping = false), duration);
        }, 500); // 0.5 seconds delay
    }

    /* attach click to every answer button */
    document
        .querySelectorAll(".option")
        .forEach((btn) => btn.addEventListener("click", handleButtonClick));

    updatePositions();
});
