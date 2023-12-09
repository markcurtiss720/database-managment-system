const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password here
      password: '1LuvM@rissa',
      database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
  );


const promptUser = () => {
    inquirer.prompt([
        {
            name: 'choices',
            type: 'list',
            message: 'Please select from the following options:',
            choices: [
                'View All Emplyees',
                'View All Roles',
                'View All Departments',
                'View All Employees By Department',
                'View Department Budgets',
                'Update Employee Role',
                'Update Employee Manager',
                'Add Employee',
                'Add Role',
                'Add Department',
                'Remove Employee',
                'Remove Role',
                'Remove Department',
                'Exit'
            ]
        }
    ])
    .then((answers) => {
        const {choices} = answers;

        if(choices === 'View All Emplyees') {
            viewAllEmployees();
        }

        if(choices === 'View All Roles') {
            viewAllRoles();
        }

        if(choices === 'View All Departments') {
            viewAllDepartments();
        }

        if(choices === 'View All Employees By Department') {
            viewAllEmployeesByDepartment();
        }

        if(choices === 'View Department Budgets') {
            viewDepartmentBudgets();
        }

        if(choices === 'Update Employee Role') {
            updateEmployeeRole();
        }

        if(choices === 'Update Employee Manager') {
            updateEmployeeManager();
        }

        if(choices === 'Add Employee') {
            addEmployee();
        }

        if(choices === 'Add Role') {
            addRole();
        }

        if(choices === 'Add Department') {
            addDepartment();
        }

        if (choices === 'Remove Employee') {
            removeEmployee();
        }

        if (choices === 'Remove Role') {
            removeRole();
        }

        if (choices === 'Remove Department'){
            removeDepartment();
        }

        if (choices === 'Exit') {
            process.exit();
        }

    });
};

//Query functions "VIEW================================="
const viewAllEmployees = () => {
    let sql = `SELECT employee.id,
                employee.first_name,
                employee.last_name,
                roles.title,
                department.name AS 'department',
                roles.salary
                FROM employee, roles, department
                WHERE department.id = roles.department_id
                AND roles.id = employee.role_id
                ORDER BY employee.id ASC`;
    db.query(sql, (error, response) => {
        if(error) throw error;
        console.log('==============================');
        console.log('Generating Table');
        console.log('==============================');
        console.table(response);
        console.log('==============================');
        promptUser();
    });
};

const viewAllRoles = () => {
    let sql = `SELECT roles.id,
                roles.title,
                department.name
                AS department
                FROM roles
                INNER JOIN department
                ON roles.department_id = department.id`;
    db.query(sql, (error, response) => {
        if(error) throw error;
        console.log('==============================');
        response.forEach((roles) => {console.log(roles.title);
        console.log('==============================');
        });
        promptUser();
    });
};

const viewAllDepartments = () => {
    let sql = `SELECT department.id AS id,
                Department.name AS department
                FROM department`;
    db.query(sql, (error, response) => {
        if (error) throw error;
        console.log('==============================');
        console.log('Generating Table');
        console.log('==============================');
        console.table(response);
        console.log('==============================');
        promptUser();
    });
};

const viewAllEmployeesByDepartment = () => {
    let sql =  `SELECT employee.first_name,
                employee.last_name,
                department.name AS department
                FROM employee
                LEFT JOIN roles ON employee.role_id = roles.id
                LEFT JOIN department 
                ON roles.department_id = department.id`;
        db.query(sql, (error, response) => {
        if (error) throw error;
        console.log('==============================');
        console.log('Generating Table');
        console.log('==============================');
        console.table(response);
        console.log('==============================');
        promptUser();
    });            
};

const viewDepartmentBudgets = () => {
    const sql = `SELECT department_id AS id,
                 department.name AS department,
                 SUM(salary) AS budget
                 FROM roles
                 INNER JOIN department
                 ON roles.department_id = department.id
                 Group BY roles.department_id`;
    db.query(sql, (error, response) => {
        if(error) throw error;
        console.table(response);
        promptUser();
    });
};


//Query functions "UPDATE================================="
const updateEmployeeRole = () => {
    let sql = `Select employee.id, employee.first_name, employee.last_name, roles.id AS "role_id"
                FROM employee, roles, department
                WHERE department.id = roles.department_id
                AND roles.id = employee.role_id`;
    db.query(sql, (error, response) => {
        if (error) throw error;
        let employeeArray = [];
        response.forEach((employee) => {
            employeeArray.push(`${employee.first_name} ${employee.last_name}`);
        });

    let sql = `SELECT roles.id, roles.title FROM roles`;
    db.query(sql, (error, response) => {
          if (error) throw error;
          let roleArray = [];
          response.forEach((roles) => {roleArray.push(roles.title);
        });
        

        inquirer.prompt([
            {
                name: 'selectedEmployee',
                type: 'list',
                message: 'which employee is changing roles?',
                choices: employeeArray
            },
            {
                name: 'selectedRole',
                type: 'list',
                message: 'what is their new role?',
                choices: roleArray
            },
        ])
        .then((answer) => {
            let newTitle, employeeId;

            response.forEach((roles) => {
                if (answer.selectedRole === roles.title) {
                    newTitle = roles.id;
                }
            });

            response.forEach((employee) => {
                if (answer.selectedEmployee === `${employee.first_name} ${employee.last_name}`) {
                    employeeId = employee.id;
                }
            });

            let sqls =  `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
            db.query(sqls, [newTitle, employeeId],
                (error) => {
                    if (error) throw error;
                    console.log('Employee Role Updated');
                    console.log(newTitle);
                    promptUser();
                });
            });
        });
    });
};

const updateEmployeeManager = () => {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id FROM employee`;
    db.query(sql, (error, response) => {
        let employeeArray = [];
        response.forEach((employee) => {
            employeeArray.push(`${employee.first_name} ${employee.last_name}`)
        });

        inquirer.prompt([
            {
                name: 'selectedEmployee',
                type: 'list',
                message: 'which employee has a new manager?',
                choices: employeeArray
            },
            {
                name: 'newManager',
                type: 'list',
                message: 'Who is their new manager?',
                choices: employeeArray
            }
        ])
        .then((answer) => {
            let employeeId;
            let managerId;
            response.forEach((employee) => {
                if (answer.selectedEmployee === `${employee.first_name} ${employee.last_name}`) {
                    employeeId = employee.id;
                }

                if (answer.newManager === `${employee.first_name} ${employee.last_name}`) {
                    managerId = employee.id;
                }
            });

            if(answer.selectedEmployee === answer.newManager) {
                console.log('Invalid Selection!');
                promptUser();
            } else {
                let sql =  `UPDATE employee
                            SET employee.manager_id = ? 
                            WHERE employee.id = ?`;

                db.query(sql, [managerId, employeeId], (error) => {
                    if (error) throw error;
                    console.log('Employee Manager Updated');
                    promptUser();
                });
            };
        });
    });
};

//Query functions "ADD================================="

const addEmployee = () => {
    inquirer.prompt([
        {
          type: 'input',
          name: 'firstName',
          message: "What is the employee's first name?"
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?",
          }
        ])
        .then(answer => {
            const newEmployee = [answer.firstName, answer.lastName]
            const roleSql =  `SELECT roles.id, roles.title FROM roles`;
            db.query(roleSql, (error, data) => {
                if (error) throw error;
                const roles = data.map(({ id, title}) => ({ name: title, value: id}));

                inquirer.prompt([
                    {
                    type: 'list',
                    name: 'role',
                    message: "What is the employee's role?",
                    choices: roles
                  }
                ])
                .then(roleChoice => {
                    const role = roleChoice.role;
                    newEmployee.push(role);
                    let managerSql =  `SELECT * FROM employee`;
                    db.query(managerSql, (error, data) => {
                        if (error) throw error;
                        const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

                        inquirer.prompt([
                            {
                                type: 'list',
                                name: 'manager',
                                message: "Who is the employee's manager?",
                                choices: managers
                            }
                        ])
                        .then(managerChoice => {
                            const manager = managerChoice.manager;
                            newEmployee.push(manager);
                            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                            VALUES (?, ?, ?, ?)`;
                            db.query(sql, newEmployee, (error) => {
                                if(error) throw error;
                                console.log("Employee has been added!");
                                viewAllEmployees();
                            });
                        });
                    });
                });
            });
        });
};

const addRole = () => {
const sql = 'SELECT * FROM department'
  db.query(sql, (error, response) => {
      if (error) throw error;
      let departmentArray = [];
      response.forEach((department) => {departmentArray.push(department.name);});
      departmentArray.push('Create Department');
      inquirer.prompt([
          {
            name: 'departmentName',
            type: 'list',
            message: 'Which department is this new role in?',
            choices: departmentArray
          }
        ])
        .then((answer) => {
          if (answer.departmentName === 'Create Department') {
            this.addDepartment();
          } else {
            addRoleCont(answer);
          }
        });

      const addRoleCont = (departmentData) => {
        inquirer.prompt([
            {
              name: 'newRole',
              type: 'input',
              message: 'What is the name of your new role?'
            },
            {
              name: 'salary',
              type: 'input',
              message: 'What is the salary of this new role?'
            }
          ])
          .then((answer) => {
            let createdRole = answer.newRole;
            let departmentId;

            response.forEach((department) => {
              if (departmentData.departmentName === department.name) {departmentId = department.id;}
            });

            let sql =   `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
            let newRole = [createdRole, answer.salary, departmentId];

            db.query(sql, newRole, (error) => {
              if (error) throw error;
              console.log(`Role successfully created!`);
              viewAllRoles();
            });
          });
        };
    });
  };

  const addDepartment = () => {
    inquirer
    .prompt([
      {
        name: 'newDepartment',
        type: 'input',
        message: 'What is the name of your new Department?'
      }
    ])
    .then((answer) => {
      let sql =     `INSERT INTO department (name) VALUES (?)`;
      db.query(sql, answer.newDepartment, (error, response) => {
        if (error) throw error;
        console.log(answer.newDepartment + ` Department successfully created!`);
        viewAllDepartments();
      });
    });
  }

//Query functions "REMOVE================================="

const removeEmployee = () => {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;

    db.query(sql, (error, response) => {
      if (error) throw error;
      let employeeArray = [];
      response.forEach((employee) => {employeeArray.push(`${employee.first_name} ${employee.last_name}`);
    });

      inquirer
        .prompt([
          {
            name: 'chosenEmployee',
            type: 'list',
            message: 'Which employee would you like to remove?',
            choices: employeeArray
          }
        ])
        .then((answer) => {
          let employeeId;

          response.forEach((employee) => {
            if (
              answer.chosenEmployee ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
            }
          });

          let sql = `DELETE FROM employee WHERE employee.id = ?`;
          db.query(sql, [employeeId], (error) => {
            if (error) throw error;
            console.log(`Employee Successfully Removed`);
            viewAllEmployees();
          });
        });
    });
  };


const removeRole = () => {
    let sql = `SELECT roles.id, roles.title FROM roles`;

    db.query(sql, (error, response) => {
      if (error) throw error;
      let roleArray = [];
      response.forEach((role) => {roleArray.push(role.title);});

      inquirer
        .prompt([
          {
            name: 'chosenRole',
            type: 'list',
            message: 'Which role would you like to remove?',
            choices: roleArray
          }
        ])
        .then((answer) => {
          let roleId;

          response.forEach((roles) => {
            if (answer.chosenRole === roles.title) {
              roleId = roles.id;
            }
          });

          let sql =   `DELETE FROM roles WHERE roles.id = ?`;
          db.query(sql, [roleId], (error) => {
            if (error) throw error;
            console.log(`Role Successfully Removed`);
            viewAllRoles();
          });
        });
    });
};


const removeDepartment = () => {
    let sql =   `SELECT department.id, department.name FROM department`;
    db.query(sql, (error, response) => {
      if (error) throw error;
      let departmentArray = [];
      response.forEach((department) => {departmentArray.push(department.name);});

      inquirer
        .prompt([
          {
            name: 'chosenDept',
            type: 'list',
            message: 'Which department would you like to remove?',
            choices: departmentArray
          }
        ])
        .then((answer) => {
          let departmentId;

          response.forEach((department) => {
            if (answer.chosenDept === department.name) {
              departmentId = department.id;
            }
          });

          let sql =     `DELETE FROM department WHERE department.id = ?`;
          db.query(sql, [departmentId], (error) => {
            if (error) throw error;
            console.log(`Department Successfully Removed`);
            viewAllDepartments();
          });
        });
    });
};

app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  });

  promptUser();