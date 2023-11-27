INSERT INTO department (name)
VALUES 
    ("Engineering"),
    ("Sales"),
    ("Finance"),
    ("Legal"),
    ("Marketing"),
    ("Executive");

INSERT INTO roles (title, salary, department_id)
VALUES
    ("Engineer", 80000, 1),
    ("Senior Engineer", 130000, 1),
    ("CFO", 300000, 6),
    ("Chief Counsel", 250000, 4),
    ("Marketing Specialist", 45000, 5),
    ("Saleman", 50000, 2),
    ("Accountant", 40000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Johnnie', 'Johnson', 1, 2), 
    ('Chelsea', 'Cable', 1, 2), 
    ('Tommy', 'Manning', 1, 2), 
    ('Jimmy', 'Jimson', 2, 2), 
    ('Larry', 'Bagel', 4, 2);
