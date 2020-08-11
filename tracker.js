const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');

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
			'View All Departments',
			'View All Roles',
			'View All Employees',
			'Add Department',
			'Add Role',
			'Add Employee',
			'Exit'
		]
	}).then(answer => {
		switch (answer.selectOption) {
			case 'View All Departments':
				viewDepartments();
				break;
			case 'View All Roles':
				viewRoles();
				break;
			case 'View All Employees':
				viewEmployees();
				break;
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

function viewDepartments() {
	connection.query('SELECT * FROM department', (err, res) => {
    	if (err) throw err;
    	console.log(chalk.bold.bgCyan('\nDEPARTMENTS:'));
	    for (let department of res) {
		    console.log(`— ${department.name}`);
	    }
	    console.log(' ');
	    start();
	});
}

function viewRoles() {
	connection.query('SELECT role.title, role.salary, department.name FROM role INNER JOIN department ON role.department_id = department.id', (err, res) => {
    	if (err) throw err;
    	console.log(chalk.bold.bgCyan('\nROLES:'));
	    for (let role of res) {
		    console.log(`— ${role.title}, $${role.salary}/year (${role.name})`);
	    }
	    console.log(' ');
	    start();
	});
}

function viewEmployees() {
	console.log(`viewEmployees()`);
	start();
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
					for (let department of results) {
						departments.push(department.name);
					}
					return departments;
				}
			}
		]).then(answer => {
        	let departmentId;
			for (let department of results) {
				if (department.name === answer.department) {
					departmentId = department.id;
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
					for (let role of results) {
						roles.push(role.title);
					}
					return roles;
				}
			}
			// Manager ID prompt goes here
		]).then(answer => {
        	let roleId;
			for (let role of results) {
				if (role.title === answer.role) {
					roleId = role.id;
          		}
        	}   
        	// Need to add Manager ID     	
        	connection.query('INSERT INTO employee SET ?', { first_name: answer.firstName, last_name: answer.lastName, role_id: roleId }, err => {
				if (err) throw err;
				console.log('SUCCESS: Employee was added.');
				start();
			});
		});
	});
};