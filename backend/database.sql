CREATE DATABASE token_system;

CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL
);
 
CREATE TABLE tokens (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id),
  token_number VARCHAR(255) NOT NULL
);

CREATE TABLE current_token (
  id INTEGER PRIMARY KEY,
  token_number VARCHAR(255) NOT NULL
);

INSERT INTO current_token (id, token_number) VALUES (1, 'T-100');
