// helper function to shuffle questions and their options
export function shuffleArray(array) {
    return array
        // map each element to an object with a random sort key
        // ex: { value: 'Option A', sort: 0.52 }
        .map(value => ({ value, sort: Math.random() }))

        // sort the array based on the random sort key
        .sort((a, b) => a.sort - b.sort)

        // extract just the original values back (shuffled)
        .map(({ value }) => value);
}