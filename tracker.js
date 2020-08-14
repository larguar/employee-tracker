const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');
const util = require("util");

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

const queryAsync = util.promisify(connection.query).bind(connection);

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
			'Update A Role\'s Salary',
			'Update An Employee\'s Role',
			'Update An Employee\'s Manager',
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
			case 'Update A Role\'s Salary':
				updateSalary();
				break;
			case 'Update An Employee\'s Role':
				updateRole();
				break;
			case 'Update An Employee\'s Manager':
				updateManager();
				break;
			case 'Exit':
				console.log(' ');
				connection.end();
				break;
		}
	});
};

async function viewDepartments() {
	const res = await queryAsync('SELECT * FROM department');

	console.log(chalk.bold.bgCyan('\nDEPARTMENTS:'));
    for (let i of res) {
	    console.log(`— ${i.name}`);
    }
    console.log(' ');
    start();
};

async function viewRoles() {
	const res = await queryAsync('SELECT role.title, role.salary, department.name FROM role INNER JOIN department ON role.departmentId = department.id');

    console.log(chalk.bold.bgCyan('\nROLES:'));
    for (let i of res) {
	    console.log(`— ${i.title}, $${i.salary}/year (${i.name})`);
    }
    console.log(' ');
    start();
};

async function viewEmployees() {
	const res = await queryAsync('SELECT employee.firstName, employee.lastName, employee.managerId, role.title FROM employee INNER JOIN role ON employee.roleId = role.id');
	
	console.log(chalk.bold.bgCyan('\nEMPLOYEES:'));
    for (let i of res) {
	    let employeeString = `— ${i.firstName} ${i.lastName}, ${i.title}`;
	    if (i.managerId) {
		    employeeString += ` (Manager: ${i.managerId})`;
	    }
	    console.log(employeeString);
    }
    console.log(' ');
    start();
};

async function addDepartment() {
	const answer = await inquirer.prompt({
		name: 'departmentName',
		type: 'input',
		message: 'Department Name:'
	});
	
	await queryAsync('INSERT INTO department SET ?', { name: answer.departmentName });
	console.log(chalk.green('\nSUCCESS:'), 'Department was added.\n');
	start();
};

async function addRole() {
	const res = await queryAsync('SELECT * FROM department');	
	const answer = await inquirer.prompt([
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
				for (let i of res) {
					departments.push(i.name);
				}
				return departments;
			}
		}
	]);

	let departmentId;
	for (let i of res) {
		if (i.name === answer.department) {
			departmentId = i.id;
  		}
	}  
	      	
	await queryAsync('INSERT INTO role SET ?', { title: answer.role, salary: answer.salary, departmentId: departmentId });
	console.log(chalk.green('\nSUCCESS:'), 'Role was added.\n');
	start();
};

async function addEmployee() {
	const resR = await queryAsync('SELECT * FROM role');
	const answerR = await inquirer.prompt([
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
				for (let i of resR) {
					roles.push(i.title);
				}
				return roles;
			}
		}
	]);
	
	const resE = await queryAsync('SELECT * FROM employee');
	const answerE = await inquirer.prompt({
		name: 'employee',
		type: 'list',
		message: 'Manager:',
		choices: () => {
			const names = [];
			for (let i of resE) {
				names.push(`${i.firstName} ${i.lastName}`);
			}
			return names;
		}
	});
	
	let roleId;
	for (let i of resR) {
		if (i.title === answerR.role) {
			roleId = i.id;
  		}
	}
	
	let managerId;
	for (let i of resE) {
		const fullName = `${i.firstName} ${i.lastName}`;
		if (fullName === answerE.employee) {
			managerId = i.id;
		}
	}
	
	await queryAsync('INSERT INTO employee SET ?', { firstName: answerR.firstName, lastName: answerR.lastName, roleId: roleId, managerId: managerId });
	console.log(chalk.green('\nSUCCESS:'), 'Employee was added.\n');
	start();
};

async function deleteDepartment() {
	const res = await queryAsync('SELECT * FROM department');
	const answer = await inquirer.prompt({
		name: 'department',
		type: 'list',
		message: 'Department to Delete:',
		choices: () => {
			const departments = [];
			for (let i of res) {
				departments.push(i.name);
			}
			return departments;
		}
	});

	await queryAsync('DELETE FROM department WHERE ?', { name: answer.department });
	console.log(chalk.green('\nSUCCESS:'), 'Department was deleted.\n');
	start();
};

async function deleteRole() {
	const res = await queryAsync('SELECT * FROM role');
	const answer = await inquirer.prompt({
		name: 'role',
		type: 'list',
		message: 'Role to Delete:',
		choices: () => {
			const roles = [];
			for (let i of res) {
				roles.push(i.title);
			}
			return roles;
		}
	});
		
	await queryAsync('DELETE FROM role WHERE ?', { title: answer.role });
	console.log(chalk.green('\nSUCCESS:'), 'Role was deleted.\n');
	start();
};

async function deleteEmployee() {
	const res = await queryAsync('SELECT * FROM employee');	
	const answer = await inquirer.prompt({
		name: 'employee',
		type: 'list',
		message: 'Employee to Delete:',
		choices: () => {
			const names = [];
			for (let i of res) {
				names.push(`${i.firstName} ${i.lastName}`);
			}
			return names;
		}
	});
		
	let deleteId;	
	for (let i of res) {
		let deleteName = `${i.firstName} ${i.lastName}`;
		if (deleteName === answer.employee) {
			deleteId = i.id;
		}
	}
		
	await queryAsync('DELETE FROM employee WHERE ?', { id: deleteId });
	console.log(chalk.green('\nSUCCESS:'), 'Employee was deleted.\n');
	start();
};

async function updateSalary() {
	const res = await queryAsync('SELECT * FROM role');	
	const answer = await inquirer.prompt([
		{
			name: 'title',
			type: 'list',
			message: 'Role:',
			choices: () => {
				const roles = [];
				for (let i of res) {
					roles.push(i.title);
				}
				return roles;
			}
		},
		{
			name: 'salary',
			type: 'input',
			message: 'New Salary:',
			validate: value => {
			  if (isNaN(value) === false) return true;
			  return false;
			}
		}
	]);		
		
	await queryAsync('UPDATE role SET salary = ? WHERE title = ?', [answer.salary, answer.title]);	
	console.log(chalk.green('\nSUCCESS:'), 'Salary was updated.\n');
	start();
};

async function updateRole() {
	const resE = await queryAsync('SELECT * FROM employee');	
	const answerE = await inquirer.prompt({
		name: 'employee',
		type: 'list',
		message: 'Employee to Update:',
		choices: () => {
			const names = [];
			for (let i of resE) {
				names.push(`${i.firstName} ${i.lastName}`);
			}
			return names;
		}
	});

	const resR = await queryAsync('SELECT * FROM role');	
	const answerR = await inquirer.prompt({
		name: 'role',
		type: 'list',
		message: 'New Role:',
		choices: () => {
			const roles = [];
			for (let i of resR) {
				roles.push(i.title);
			}
			return roles;
		}
	});
	
	const select = await queryAsync('SELECT employee.id, employee.firstName, employee.lastName, employee.roleId, role.title FROM employee INNER JOIN role ON employee.roleId = role.id');
	
	let employeeId;	
	for (let i of select) {
		const fullName = `${i.firstName} ${i.lastName}`;
		if (fullName === answerE.employee) {
			employeeId = i.id;
		}
	}
	
	let newRoleId;
	for (let i of resR) {
		if (i.title === answerR.role) {
			newRoleId = i.id;
		}
	}

	await queryAsync('UPDATE employee SET roleId = ? WHERE id = ?', [newRoleId, employeeId]);
	
	console.log(chalk.green('\nSUCCESS:'), 'Salary was updated.\n');
	start();
};

function updateManager() {
	console.log(`updateManager()`);
	start();
};