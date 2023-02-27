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
          "View Employees by Manager",
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
      } else if (answer.choice === "View Employees by Manager") {
        viewEmpByMgr();
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

function viewRoles() {
  db.query(
    "SELECT id, title, salary, department_id FROM role",
    function (err, results) {
      if (err) {
        throw err;
      }
      console.table(results);
      start();
    }
  );
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

function viewEmpByMgr() {
  db.query(
    "SELECT id, first_name, last_name, role_id, manager_id FROM employee",
    function (err, data) {
      if (err) {
        throw err;
      }
      let managers = data.map((mgr) => {
        return {
          name: mgr.first_name + " " + mgr.last_name,
          value: mgr.id,
        };
      });

      inquirer
        .prompt([
          {
            name: "mgr",
            type: "list",
            message: "Choose a manager:",
            choices: managers,
          },
        ])
        .then((input) => {
          const mgr = [input.mgr];

          db.query(
            `SELECT id, first_name, last_name, role_id, manager_id FROM employee WHERE manager_id = ?`,
            mgr,
            function (err, data) {
              if (err) {
                throw err;
              }
              console.table(data);
              start();
            }
          );
        });
    }
  );
}

function addDept() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "Department name:",
      },
    ])
    .then((input) => {
      const name = [input.name];

      db.query(
        `INSERT INTO department (name) VALUES (?)`,
        name,
        function (err, results) {
          if (err) {
            throw err;
          }
          console.table(results);
          start();
        }
      );
    });
}

function addRole() {
  db.query("SELECT * FROM department", function (err, data) {
    if (err) {
      throw err;
    }

    let depts = data.map((allDepts) => {
      return {
        name: allDepts.name,
        value: allDepts.id,
      };
    });

    inquirer
      .prompt([
        {
          name: "role",
          type: "input",
          message: "Role name:",
        },
        {
          name: "salary",
          type: "input",
          message: "Role salary:",
        },
        {
          name: "dept",
          type: "list",
          message: "Department role falls under:",
          choices: depts,
        },
      ])

      .then((input) => {
        const answers = [input.role, input.salary, input.dept];

        db.query(
          `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`,
          answers,
          function (err, data) {
            if (err) {
              throw err;
            }
            console.table(data);
            start();
          }
        );
      });
  });
}

function addEmp() {
  db.query("SELECT * FROM role", function (err, data) {
    if (err) {
      throw err;
    }
    let roles = data.map((role) => {
      return {
        name: role.title,
        value: role.id,
      };
    });

    db.query("SELECT * FROM employee", function (err, data) {
      if (err) {
        throw err;
      }
      let managers = data.map((mgr) => {
        return {
          name: mgr.first_name + " " + mgr.last_name,
          value: mgr.id,
        };
      });

      inquirer
        .prompt([
          {
            name: "first",
            type: "input",
            message: "Employee's first name:",
          },
          {
            name: "last",
            type: "input",
            message: "Last name:",
          },
          {
            name: "role",
            type: "list",
            message: "Role:",
            choices: roles,
          },
          {
            name: "mgr",
            type: "list",
            message: "Employee's manager:",
            choices: managers,
          },
        ])
        .then((input) => {
          const paramsE = [input.first, input.last, input.role, input.mgr];

          db.query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
            paramsE,
            function (err, results) {
              if (err) {
                throw err;
              }
              start();
            }
          );
        });
    });
  });
}
