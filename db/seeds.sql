-- Inserting department data into the 'department' table
INSERT INTO department (name) VALUES 
  ('Sales'),
  ('Engineering'),
  ('Marketing');

-- Inserting role data into the 'role' table
INSERT INTO role (title, salary, department_id) VALUES 
  ('Sales Manager', 80000, 1),
  ('Software Engineer', 90000, 2),
  ('Marketing Specialist', 60000, 3);

-- Inserting employee data into the 'employee' table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, NULL),
  ('Emily', 'Johnson', 3, NULL);