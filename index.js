const inquirer = require("inquirer");
const queries = require("./config/queries");
const fs = require("fs");
const pool = require("./config/connection");

const runSchemaAndSeeds = async () => {
  try {
    console.log("Running schema.sql...");
    const schemaSql = fs.readFileSync("./db/schema.sql", "utf8");
    await pool.query(schemaSql);
    console.log("Schema created successfully.");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Running seeds.sql...");
    const seedsSql = fs.readFileSync("./db/seeds.sql", "utf8");
    await pool.query(seedsSql);
    console.log("Data seeded successfully.");
  } catch (error) {
    console.error("Error running schema and seeds:", error);
  }
};

const mainMenu = async () => {
  const { action } = await inquirer.prompt({
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee role",
    ],
  });

  switch (action) {
    case "View all departments":
      const departments = await queries.viewDepartments();
      console.table(departments);
      break;
    case "View all roles":
      const roles = await queries.viewRoles();
      console.table(roles);
      break;
    case "View all employees":
      const employees = await queries.viewEmployees();
      console.table(employees);
      break;
    case "Add a department":
      const { departmentName } = await inquirer.prompt({
        type: "input",
        name: "departmentName",
        message: "Enter the name of the department:",
      });
      await queries.addDepartment(departmentName);
      console.log("Department added.");
      break;
    case "Add a role":
      const { roleName, salary, departmentId } = await inquirer.prompt([
        { type: "input", name: "roleName", message: "Enter the role name:" },
        { type: "number", name: "salary", message: "Enter the salary:" },
        {
          type: "number",
          name: "departmentId",
          message: "Enter the department ID:",
        },
      ]);
      await queries.addRole(roleName, salary, departmentId);
      console.log("Role added.");
      break;
    case "Add an employee":
      const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
        {
          type: "input",
          name: "firstName",
          message: "Enter the employee’s first name:",
        },
        {
          type: "input",
          name: "lastName",
          message: "Enter the employee’s last name:",
        },
        { type: "number", name: "roleId", message: "Enter the role ID:" },
        {
          type: "number",
          name: "managerId",
          message: "Enter the manager ID (leave blank if none):",
          default: null,
        },
      ]);
      await queries.addEmployee(firstName, lastName, roleId, managerId);
      console.log("Employee added.");
      break;
    case "Update an employee role":
      const { employeeId, newRoleId } = await inquirer.prompt([
        {
          type: "number",
          name: "employeeId",
          message: "Enter the employee ID to update:",
        },
        {
          type: "number",
          name: "newRoleId",
          message: "Enter the new role ID:",
        },
      ]);
      await queries.updateEmployeeRole(employeeId, newRoleId);
      console.log("Employee role updated.");
      break;
  }
  mainMenu();
};

runSchemaAndSeeds().then(mainMenu);