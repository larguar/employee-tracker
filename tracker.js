const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'dapperdoug69',
  database: 'employeeDB'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected as id ' + connection.threadId);
  start();
});

function start() {
	inquirer.prompt({
		name: 'selectOption',
		type: 'list',
		message: 'What would you like to do?',
		choices: [
			'Add Department',
			'Add Role',
			'Add Employee',
			'Exit'
		]
	}).then(answer => {
		switch (answer.selectOption) {
			case 'Add Department':
				addDepartment();
				break;
			case 'Add Role':
				addRole();
				break;
			case 'Add Employee':
				addEmployee();
				break;
			case 'Exit':
				connection.end();
				break;
		}
	});
}

function addDepartment() {
	console.log(`addDepartment()`);
	start();
};

function addRole() {
	console.log(`addRole()`);
	start();
};

function addEmployee() {
	console.log(`addEmployee()`);
	start();
};