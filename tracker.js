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
	inquirer.prompt({
		name: 'departmentName',
		type: 'input',
		message: 'Department Name:'
	}).then(answer => {
		connection.query('INSERT INTO department SET ?', { name: answer.departmentName }, err => {
			if (err) throw err;
			console.log('SUCCESS: Department was added.');
			start();
		});
	});
};

function addRole() {
	connection.query('SELECT * FROM department', (err, results) => {	
		if (err) throw err;
		inquirer.prompt([
			{
				name: 'role',
				type: 'input',
				message: 'Role Name:'
			},
			{
				name: 'salary',
				type: 'input',
				message: 'Salary:',
				validate: value => {
				  if (isNaN(value) === false) return true;
				  return false;
				}
			},
			{
				name: 'department',
				type: 'list',
				message: 'Department:',
				choices: () => {
					const departments = [];
					for (let i = 0; i < results.length; i++) {
						departments.push(results[i].name);
					}
					return departments;
				}
			}
		]).then(answer => {
        	let departmentId;
			for (let i = 0; i < results.length; i++) {
				if (results[i].name === answer.department) {
					departmentId = results[i].id;
          		}
        	}        	
        	connection.query('INSERT INTO role SET ?', { title: answer.role, salary: answer.salary, department_id: departmentId }, err => {
				if (err) throw err;
				console.log('SUCCESS: Role was added.');
				start();
			});
		});
	});
};

function addEmployee() {
	connection.query('SELECT * FROM role', (err, results) => {	
		if (err) throw err;
		inquirer.prompt([
			{
				name: 'firstName',
				type: 'input',
				message: 'First Name:'
			},
			{
				name: 'lastName',
				type: 'input',
				message: 'Last Name:'
			},
			{
				name: 'role',
				type: 'list',
				message: 'Role:',
				choices: () => {
					const roles = [];
					for (let i = 0; i < results.length; i++) {
						roles.push(results[i].title);
					}
					return roles;
				}
			}
		]).then(answer => {
        	let roleId;
			for (let i = 0; i < results.length; i++) {
				if (results[i].title === answer.role) {
					roleId = results[i].id;
          		}
        	}        	
        	connection.query('INSERT INTO employee SET ?', { first_name: answer.firstName, last_name: answer.lastName, role_id: roleId }, err => {
				if (err) throw err;
				console.log('SUCCESS: Employee was added.');
				start();
			});
		});
	});
};