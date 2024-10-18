CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT null,
    gender VARCHAR(10),
    age INT,
    phone_number VARCHAR(15)
);

CREATE TABLE IF NOT EXISTS "Admin" (
    admin_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    gender VARCHAR(10),
    phone_number VARCHAR(15),
    email VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO "Admin" (username, password, gender, phone_number, email)
VALUES 
('gamemu', 'secure1234', 'Female', '123-456-7890', 'adminuser@gmail.com');

CREATE TABLE IF NOT EXISTS movies (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    duration INT NOT NULL,
    language VARCHAR(50),
    release_date VARCHAR(20),  -- Storing the date as a string
    genre VARCHAR(50),
    rating FLOAT,  -- Changed to FLOAT for storing as a floating-point number
    image BYTEA
);

DELETE FROM movies WHERE movie_id = 4;

UPDATE users
SET username = 'haha'
WHERE user_id = 1;

CREATE TABLE IF NOT EXISTS watchlists (
    watchlist_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE
);

SELECT * FROM watchlists WHERE user_id = 1;

CREATE TABLE IF NOT EXISTS booking (
    booking_id SERIAL PRIMARY KEY,  -- Unique ID for each booking
    user_id INT NOT NULL,  -- Foreign key referencing users table
    movie_id INT NOT NULL,  -- Foreign key referencing movies table
    seat_amount INT NOT NULL,  -- Number of seats booked

    -- Foreign Key Constraints
    CONSTRAINT fk_user
        FOREIGN KEY (user_id) 
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_movie
        FOREIGN KEY (movie_id) 
        REFERENCES movies(movie_id)
        ON DELETE CASCADE
);


DELETE FROM movies 
WHERE movie_id = 11;



INSERT INTO your_table_name (id, column1, column2)
SELECT 'new_id', 'value1', 'value2'
WHERE NOT EXISTS (
    SELECT 1 FROM your_table_name WHERE id = 'new_id'
);

SELECT user_id, username, password, email, gender, age, phone_number
FROM users
