CREATE TABLE submission ( 
    id SERIAL PRIMARY KEY, 
    name VARCHAR(100) NOT NULL, 
    email VARCHAR(100) NOT NULL, 
    phone VARCHAR(100) NOT NULL,
    filename CHAR(32) NOT NULL UNIQUE, 
    type VARCHAR(10) NOT NULL,
    time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);