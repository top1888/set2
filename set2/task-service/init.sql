CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  user_id INT,
  title TEXT,
  completed BOOLEAN DEFAULT false
);