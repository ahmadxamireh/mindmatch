-- Database: mindrift

-- DROP DATABASE IF EXISTS mindrift;

-- CREATE DATABASE mindrift
--     WITH
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'C'
--     LC_CTYPE = 'C'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1
--     IS_TEMPLATE = False;

CREATE TABLE users
(
    id       SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE scores
(
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER     NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id),
    score      SMALLINT    NOT NULL,
    category   varchar(50) not null,
    difficulty VARCHAR(10) NOT NULL, -- 'easy', 'medium', 'hard', 'adaptive'
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE questions
(
    id             SERIAL PRIMARY KEY,
    category       VARCHAR(50) NOT NULL,
    difficulty     VARCHAR(10) NOT NULL,
    question       TEXT        NOT NULL,
    correct_answer TEXT        NOT NULL,
    options        TEXT[]      NOT NULL
);