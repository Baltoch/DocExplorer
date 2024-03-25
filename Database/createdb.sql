DROP DATABASE IF EXISTS docexplorer;
create database docexplorer;
use docexplorer;

DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS users;

CREATE TABLE jobs(
    id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    title varchar(100),
    status enum ('Queuing', 'Processing', 'Succeeded', 'Failed'),
    nextstep enum ('ocr', 'done'),
    userid int NOT NULL,
    result varchar(100),
    images varchar(100),
    date DATETIME NOT NULL DEFAULT NOW()
);

CREATE TABLE users(
    id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    first_name varchar(100),
    last_name varchar(100),
    email varchar(100) NOT NULL,
    password varchar(100) NOT NULL,
    tags json,
    avatar varchar(100)
);

INSERT INTO users VALUES(1, 'explorer', 'explorer', 'explorer@docexplorer.com', 'explorer', NULL, NULL);