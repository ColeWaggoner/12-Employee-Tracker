const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");
const table = require("console.table");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "rootroot",
    database: "company_db",
  },
  console.log(`Connected`)
);
db.connect(function (err) {
  if (err) {
    throw err;
  }
  start();
});

function start() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Choose an option:",
        choices: [
          "View Departments",
          "View Roles",
          "View Employees",
          "Add Department",
          "Add Role",
          "Add Employee",
          "Update Employee",
          "Exit",
        ],
        name: "choice",
      },
    ])
    .then((answer) => {
      if (answer.choice === "View Departments") {
        viewDept();
      } else if (answer.choice === "View Roles") {
        viewRoles();
      } else if (answer.choice === "View Employees") {
        viewEmp();
      } else if (answer.choice === "Add Department") {
        addDept();
      } else if (answer.choice === "Add Role") {
        addRole();
      } else if (answer.choice === "Add Employee") {
        addEmp();
      } else if (answer.choice === "Update Employee") {
        updateEmp();
      }
    });
}

function viewDept() {
  db.query("SELECT id, name FROM department", function (err, data) {
    if (err) {
      throw err;
    }
    console.table(data);
    start();
  });
}

function  viewRoles() {

  db.query('SELECT id, title, salary, department_id FROM role', function (err, results) {
      if (err){
          throw err;
      }console.table(results);
      start();
    });
    
 }

function viewEmp() {
  db.query(
    "SELECT id, first_name, last_name, role_id, manager_id FROM employee",
    function (err, data) {
      if (err) {
        throw err;
      }
      console.table(data);
      start();
    }
  );
}

function addDept() {
  inquirer
  .prompt([
    {
      type: "input",
      message: "Department name:",
      name: "name",
    },
  
  ])
  .then((input) => {
      const name = [input.name];

      db.query(`INSERT INTO department (name) VALUES (?)`, name, function (err, results) {
          if (err){
              throw err;
          }console.table(results);
          start();
        });
      });
    
 }