INSERT INTO department (name)
VALUES ("Ownership"),
       ( "Managers"),
       ( "Sales" ),
       ( "Accounting" ),
       ( "Customer Service"),
       ( "Human Resources");


INSERT INTO role (title, salary, department_id)
VALUES ("CEO", 500000, 1)
       ( "Manager", 90000, 2),
       ( "Assistant to the Manager", 70000, 3),
       ( "Salesman", 65000, 3),
       ( "Accountant", 60000, 4),
       ("Secretary", 45000, 5),
       ( "HR Representative", 80000, 6);


INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("David", "Wallace", 1, NULL),
       ("Michael", "Scott", 2, 1),
       ("Dwight", "Schrute", 3, 2),
       ("Jim", "Halpert", 4, 2),
       ("Phyllis", "Vance", 4, 4),
       ("Kevin", "Malone", 5, 4),
       ("Pam", "Halpert", 6, 2),
       ("Toby", "Flenderson", 7, 1);