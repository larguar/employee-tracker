USE employeeDB;

INSERT INTO department (name)
VALUES ('Design'), ('Marketing');

INSERT INTO role (title, salary, departmentId)
VALUES ('Design Director', 90000, 1), ('Web Designer', 50000, 1), ('Print Designer', 40000, 1), ('Creative Director', 80000, 2), ('Marketing Manager', 70000, 2), ('Social Media Specialist', 40000, 2);

INSERT INTO employee (firstName, lastName, roleId)
VALUES ('Joseph', 'Carter Brown', 1), ('Megan', 'Johnson', 4), ('Stacy', 'Ruddy', 5);

INSERT INTO employee (firstName, lastName, roleId, managerId)
VALUES ('Lauren', 'Siminski', 2, 2), ('Jessica', 'Meyer', 3, 1), ('Rory', 'Nachbar', 6, 3);