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
  console.log(' ');
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
			'Add A Department',
			'Add A Role',
			'Add An Employee',
			'Delete A Department',
			'Delete A Role',
			'Delete An Employee',
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
			case 'Add A Department':
				addDepartment();
				break;
			case 'Add A Role':
				addRole();
				break;
			case 'Add An Employee':
				addEmployee();
				break;
			case 'Delete A Department':
				deleteDepartment();
				break;
			case 'Delete A Role':
				deleteRole();
				break;
			case 'Delete An Employee':
				deleteEmployee();
				break;
			case 'Exit':
				console.log(' ');
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
	connection.query('SELECT employee.first_name, employee.last_name, employee.manager, role.title FROM employee INNER JOIN role ON employee.role_id = role.id', (err, res) => {
    	if (err) throw err;
    	console.log(chalk.bold.bgCyan('\nEMPLOYEES:'));
	    for (let employee of res) {
		    let employeeString = `— ${employee.first_name} ${employee.last_name}, ${employee.title}`;
		    if (employee.manager) {
			    employeeString += ` (Manager: ${employee.manager})`;
		    }
		    console.log(employeeString);
	    }
	    console.log(' ');
	    start();
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
			console.log(chalk.green('\nSUCCESS:'), 'Department was added.\n');
			start();
		});
	});
};

function addRole() {
	connection.query('SELECT * FROM department', (err, res) => {	
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
					for (let department of res) {
						departments.push(department.name);
					}
					return departments;
				}
			}
		]).then(answer => {
        	let departmentId;
			for (let department of res) {
				if (department.name === answer.department) {
					departmentId = department.id;
          		}
        	}        	
        	connection.query('INSERT INTO role SET ?', { title: answer.role, salary: answer.salary, department_id: departmentId }, err => {
				if (err) throw err;
				console.log(chalk.green('\nSUCCESS:'), 'Role was added.\n');
				start();
			});
		});
	});
};

function addEmployee() {
	connection.query('SELECT * FROM role', (err, res) => {	
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
					for (let role of res) {
						roles.push(role.title);
					}
					return roles;
				}
			}
			// Manager ID prompt goes here
		]).then(answer => {
        	let roleId;
			for (let role of res) {
				if (role.title === answer.role) {
					roleId = role.id;
          		}
        	}   
        	// Need to add Manager ID     	
        	connection.query('INSERT INTO employee SET ?', { first_name: answer.firstName, last_name: answer.lastName, role_id: roleId }, err => {
				if (err) throw err;
				console.log(chalk.green('\nSUCCESS:'), 'Employee was added.\n');
				start();
			});
		});
	});
};

function deleteDepartment() {
	connection.query('SELECT * FROM department', (err, res) => {
		inquirer.prompt({
			name: 'department',
			type: 'list',
			message: 'Department to Delete:',
			choices: () => {
				const departments = [];
				for (let department of res) {
					departments.push(department.name);
				}
				return departments;
			}
		}).then(answer => {
			connection.query('DELETE FROM department WHERE ?', { name: answer.department }, err => {
				if (err) throw err;
				console.log(chalk.green('\nSUCCESS:'), 'Department was deleted.\n');
				start();
			});
		});
	});
};

function deleteRole() {
	connection.query('SELECT * FROM role', (err, res) => {
		inquirer.prompt({
			name: 'role',
			type: 'list',
			message: 'Role to Delete:',
			choices: () => {
				const roles = [];
				for (let role of res) {
					roles.push(role.title);
				}
				return roles;
			}
		}).then(answer => {
			connection.query('DELETE FROM role WHERE ?', { title: answer.role }, err => {
				if (err) throw err;
				console.log(chalk.green('\nSUCCESS:'), 'Role was deleted.\n');
				start();
			});
		});
	});
};

function deleteEmployee() {
/*
	connection.query('SELECT * FROM employee', (err, res) => {
		inquirer.prompt({
			// List all employee first and last names
			name: 'employee',
			type: 'list',
			message: 'Employee to Delete:',
			choices: () => {
				const employees = [];
				for (let employee of res) {
					employees.push( );
				}
				return employees;
			}
		}).then(answer => {
			connection.query('DELETE FROM employee WHERE ?', { id: answer.role }, err => {
				if (err) throw err;
				console.log(chalk.green('\nSUCCESS:'), 'Employee was deleted.\n');
				start();
			});
		});
	});
*/
	start();
};