CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    savings_goal DECIMAL(10, 2) DEFAULT 0
);

CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(30),
    description VARCHAR(50)
);

CREATE TABLE incomes (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    category VARCHAR(30),
    amount DECIMAL(10, 2) NOT NULL,
    description VARCHAR(50)
);

