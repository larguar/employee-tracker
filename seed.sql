DROP DATABASE IF EXISTS employeeDB;
CREATE DATABASE employeeDB;

USE employeeDB;

CREATE TABLE department (
	id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
	id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary INT NOT NULL,
    departmentId INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
	id INT NOT NULL AUTO_INCREMENT,
    firstName VARCHAR(30) NOT NULL,
    lastName VARCHAR(30) NOT NULL,
    roleId INT NOT NULL,
    managerId INT,
    PRIMARY KEY (id)
);

INSERT INTO department (name)
VALUES ('Design'), ('Production'), ('Marketing');

INSERT INTO role (title, salary, departmentId)
VALUES ('Design Director', 90000, 1), ('Web Designer', 50000, 1), ('Print Designer', 40000, 1), ('HTML/CSS Specialist', 40000, 2), ('Creative Director', 80000, 3), ('Marketing Manager', 70000, 3), ('Social Media Specialist', 40000, 3);

INSERT INTO employee (firstName, lastName, roleId)
VALUES ('Joseph', 'Carter Brown', 1), ('Megan', 'Johnson', 5), ('Stacy', 'Ruddy', 6);

INSERT INTO employee (firstName, lastName, roleId, managerId)
VALUES ('Lauren', 'Siminski', 2, 2), ('Jessica', 'Meyer', 3, 1), ('Rory', 'Nachbar', 7, 3);