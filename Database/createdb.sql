DROP DATABASE IF EXISTS docexplorer;
create database docexplorer;
use docexplorer;

DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS users;

CREATE TABLE jobs(
    id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    status varchar(5000),
    userid int NOT NULL,
    result varchar(10),
    images varchar(10)
);

CREATE TABLE users(
    id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    first_name varchar(10),
    last_name varchar(10),
    email varchar(10) NOT NULL,
    password varchar(10) NOT NULL
);

INSERT INTO users VALUES(1, 'explorer', 'explorer', 'explorer', 'explorer');