# 🧠 MindRift

**MindRift** is a smart, dynamic quiz game that adapts to your skill level in real time. Choose a category and difficulty — or let the game challenge you with an adaptive mode that gets harder (or easier) based on your performance.

Built with: Node.js, Express, PostgreSQL, Knex, EJS, and Vanilla JS

---

## 🚀 Features

- 🎯 **Adaptive Difficulty Mode** – Questions adjust in real time based on correct/incorrect answers
- 🃏 **Card Stack UI** – Animated, swipe-style cards for smooth transitions
- 🧩 **Category & Difficulty Selection** – Choose your path or let the app choose for you
- 📊 **Leaderboard** – View top scores by category
- 🎨 **Responsive Design** – Works across desktop and tablet-sized screens
- ✅ **No Libraries** – All logic and animation handled with raw HTML, CSS, and JS

---

## 💾 Tech Stack

| Layer       | Tech                   |
|-------------|------------------------|
| Backend     | Node.js, Express       |
| Database    | PostgreSQL, Knex       |
| Frontend    | EJS, HTML, CSS, JS     |
| Styling     | Pure CSS               |

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/ahmadxamireh/mindrift.git
cd mindrift
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up `.env`

Create a `.env` file based on `.env.example`:

```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_password
DB_NAME=mindrift
DB_PORT=5432
PORT=3000
```

### 4. Create the PostgreSQL Database

Assuming PostgreSQL is installed and running:

```bash
createdb mindrift
psql mindrift < db/schema.sql
```

### You can confirm tables exist by running:
```bash
psql mindrift -c '\dt'
```

### 5. Seed your database
This script loads all JSON files in `db/seeds/` and inserts validated questions into the database.
```bash
node db/seeds/seedQuestions.js
```

### 6. Run the app

```bash
npm start
```

Visit: `http://localhost:3000/mindrift`

---

## ✍️ Author

**Ahmad Amireh**  
[GitHub Profile](https://github.com/ahmadxamireh)

---

## 📝 License

This project is licensed under the MIT License.
