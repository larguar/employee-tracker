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
  //createItem();
});