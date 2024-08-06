// Importing the database connection pool module from the 'connection' file
const pool = require("./connection");

// View all departments
const viewDepartments = async () => {
  const result = await pool.query("SELECT * FROM department");
  return result.rows;
};

// View all roles
const viewRoles = async () => {
  const result = await pool.query(`
    SELECT role.id, role.title, role.salary, department.name AS department
    FROM role
    JOIN department ON role.department_id = department.id
  `);
  return result.rows;
};

// View all employees
const viewEmployees = async () => {
  const result = await pool.query(`
    SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, 
    CASE
      WHEN manager.first_name IS NULL THEN 'No Manager Assigned'
      ELSE CONCAT(manager.first_name, ' ', manager.last_name)
    END AS manager
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
  `);
  return result.rows;
};

// Add a department
const addDepartment = async (name) => {
  await pool.query("INSERT INTO department (name) VALUES ($1)", [name]);
};

// Add a role
const addRole = async (title, salary, departmentId) => {
  await pool.query(
    "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)",
    [title, salary, departmentId]
  );
};

// Add an employee
const addEmployee = async (firstName, lastName, roleId, managerId) => {
  await pool.query(
    "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
    [firstName, lastName, roleId, managerId]
  );
};

// Update an employee's role
const updateEmployeeRole = async (employeeId, newRoleId) => {
  await pool.query("UPDATE employee SET role_id = $1 WHERE id = $2", [
    newRoleId,
    employeeId,
  ]);
};

// Exporting functions related to viewing, adding, and updating departments, roles, and employees
module.exports = {
  viewDepartments,
  viewRoles,
  viewEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
};
