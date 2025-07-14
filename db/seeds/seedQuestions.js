import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../../config/db.js'; // database connection (Knex)

// get the directory where this seed file is located
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedsFolder = path.join(__dirname); // assumes JSON files are in same folder

// helper function to validate the structure of a question object
function isValidQuestion(q) {
    return (
        typeof q.category === 'string' &&          // category must be a string
        typeof q.difficulty === 'string' &&        // difficulty must be a string
        typeof q.question === 'string' &&          // question must be a string
        typeof q.correct_answer === 'string' &&    // correct answer must be a string
        Array.isArray(q.options) &&                // options must be an array
        q.options.length === 4 &&                  // exactly 4 options are required
        q.options.includes(q.correct_answer)       // correct answer must be one of the options
    );
}

// main function to seed questions into the database
async function seed() {
    try {
        // clear the existing questions
        await db('questions').del();
        console.log('Existing questions deleted');

        // reset the ID sequence to start from 1
        await db.raw('ALTER SEQUENCE questions_id_seq RESTART WITH 1');
        console.log('ID sequence reset');

        // read all the .json files in the /seeds folder
        // !synchronous call to block the execution of the code until all the files are red!
        const files = fs.readdirSync(seedsFolder).filter(f => f.endsWith('.json'));

        for (const file of files) {
            // parse each JSON file into a JavaScript array of question objects
            const raw = fs.readFileSync(path.join(seedsFolder, file), 'utf-8');

            // if parsing fails, log the error and skip the file
            let data;
            try {
                // attempt to parse the JSON content
                data = JSON.parse(raw);
            } catch (err) {
                console.error(`Error parsing ${file}:`, err.message);
                continue; // skip invalid files
            }

            // validate and filter the questions
            const validQuestions = data.filter(isValidQuestion);
            if (validQuestions.length > 0) {
                try {
                    // insert valid questions into the database
                    await db('questions').insert(validQuestions);
                    console.log(`Inserted ${validQuestions.length} questions from ${file}`);
                } catch (err) {
                    console.error(`Error inserting from ${file}:`, err.message);
                }
            } else {
                console.log(`No valid questions in ${file}`);
            }
        }

        console.log('Done seeding all questions.');
    } catch (err) {
        console.error('Seeding failed:', err.message);
    } finally {
        // always close the DB connection regardless
        await db.destroy();
    }
}

// run the seeding
seed();