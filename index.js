// Import required modules
const inquirer = require("inquirer");
const queries = require("./config/queries");
const fs = require("fs");
const pool = require("./config/connection");

// Function to run the schema and seed files
const runSchemaAndSeeds = async () => {
  try {
    // Read and execute schema.sql
    console.log("Running schema.sql...");
    const schemaSql = fs.readFileSync("./db/schema.sql", "utf8");
    await pool.query(schemaSql);
    console.log("Schema created successfully.");

    // Wait for a second before running seeds
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Read and execute seeds.sql
    console.log("Running seeds.sql...");
    const seedsSql = fs.readFileSync("./db/seeds.sql", "utf8");
    await pool.query(seedsSql);
    console.log("Data seeded successfully.");
  } catch (error) {
    console.error("Error running schema and seeds:", error);
  }
};

// Function to display the main menu and handle user actions
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

  // Handle each action based on user selection
  switch (action) {
    // View all departments
    case "View all departments":
      const departments = await queries.viewDepartments();
      console.table(departments);
      break;

    // View all roles
    case "View all roles":
      const roles = await queries.viewRoles();
      console.table(roles);
      break;

    // View all employees
    case "View all employees":
      const employees = await queries.viewEmployees();
      console.table(employees);
      break;

    // Prompt user to enter the department name
    case "Add a department":
      const { departmentName } = await inquirer.prompt({
        type: "input",
        name: "departmentName",
        message: "Enter the name of the department:",
      });

      // Add the new department
      await queries.addDepartment(departmentName);
      console.log("Department added.");
      break;
    case "Add a role":
      // Fetch the list of departments to display department names for selection
      const departmentss = await queries.viewDepartments();
      const departmentChoices = departmentss.map((department) => ({
        name: department.name,
        value: department.id,
      }));

      // Prompt user to enter role details
      const { roleName, salary, departmentId } = await inquirer.prompt([
        { type: "input", name: "roleName", message: "Enter the role name:" },
        { type: "number", name: "salary", message: "Enter the salary:" },
        {
          type: "list",
          name: "departmentId",
          message: "Select the department for this role:",
          choices: departmentChoices,
        },
      ]);

      // Add the new role
      await queries.addRole(roleName, salary, departmentId);
      console.log("Role added.");
      break;
    case "Add an employee":
      // Fetch the list of existing roles to display role titles for selection
      const roless = await queries.viewRoles();
      const roleChoices = roless.map((role) => ({
        name: role.title,
        value: role.id,
      }));

      // Fetch the list of existing employees to display names for selection
      const employeess = await queries.viewEmployees();
      const employeeChoices = employeess.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      }));

      // Prompt user to enter employee details
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
        {
          type: "list",
          name: "roleId",
          message: "Select the role for this employee:",
          choices: roleChoices,
        },
        {
          type: "list",
          name: "managerId",
          message:
            "Select the manager for this employee or select 'No Manager':",
          choices: [{ name: "No Manager", value: null }, ...employeeChoices],
        },
      ]);

      // Add the new employee
      await queries.addEmployee(firstName, lastName, roleId, managerId);
      console.log("Employee added.");
      break;
    case "Update an employee role":
      // Fetch the list of existing employees to display names for selection
      const employeesb = await queries.viewEmployees();
      const employeeChoicesB = employeesb.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      }));

      // Fetch the list of existing roles to display role titles for selection
      const rolesB = await queries.viewRoles();
      const roleChoicesB = rolesB.map((role) => ({
        name: role.title,
        value: role.id,
      }));

      // Prompt user to select employee and new role
      const { employeeId, newRoleId, managerId2 } = await inquirer.prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Select the employee to update:",
          choices: employeeChoicesB,
        },
        {
          type: "list",
          name: "newRoleId",
          message: "Select the new role for this employee:",
          choices: roleChoicesB,
        },
        {
          type: "list",
          name: "managerId",
          message:
            "Select the manager for this employee or select 'No Manager':",
          choices: [{ name: "No Manager", value: null }, ...employeeChoicesB],
        },
      ]);

      // Update the employee's role
      await queries.updateEmployeeRole(employeeId, newRoleId, managerId2);
      console.log("Employee role updated.");
      break;
  }
  // Display the main menu again after an action is completed
  mainMenu();
};

// Run schema and seed files, then display the main menu
runSchemaAndSeeds().then(mainMenu);