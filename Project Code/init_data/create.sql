
DROP TABLE IF EXISTS Members CASCADE;
CREATE TABLE IF NOT EXISTS Members (
  member_id serial primary key,
  username varchar,
  password varchar,
  household_id int
);

DROP TABLE IF EXISTS Fridge CASCADE;
CREATE TABLE IF NOT EXISTS Fridge (
 item_id SERIAL PRIMARY KEY,
 member_id int,
 food_item varchar, /* TODO is this ok? */
 quantity int,
 household_id int,
 price float,
 FOREIGN KEY (member_id) REFERENCES members(member_id)
/*FOREIGN KEY (household_id) REFERENCES Households(household_id)*/
);

DROP TABLE IF EXISTS Feed CASCADE;
CREATE TABLE IF NOT EXISTS Feed (
  household_id int,
  item_id int,
  event_id SERIAL PRIMARY KEY,
  food_item varchar,
  eater int,
  provider int,
  price float,
  FOREIGN KEY (eater) REFERENCES Members(member_id),
  FOREIGN KEY (provider) REFERENCES Members(member_id)
);


INSERT INTO Members(username, password, household_id)
VALUES('harry', 'password', 1),
('james', 'password', 1),
('potter', 'password', 1),
('malfoy', 'password', 2),
('snape', 'password', 2),
('voldemort', 'password', 2),
('jimbo', 'password', 3),
('jenny', 'password', 3),
('jessica', 'password', 3),
('cho', 'password', 4),
('jeancarlo', 'password', 4),
('jacksonpolluck', 'password', 4)
;

/*
INSERT INTO Fridge(
 member_id,
 food_item,
 quantity,
 price,
 household_id
)
VALUES(101, 'Bananas', 2, 0.59, 1),
(202,'Jabanas', 3, 0.69, 1),
(102,'Cabanas', 4, 0.70, 2),
(101,'Lananas', 5, 0.84, 2);

INSERT INTO Feed(household_id, event_id, food_item, eater, provider, price)
VALUES(1, 00, 'Bananas', 101, 102, 5.00),
(1, 01, 'Bananas', 101, 102, 5.00),
(1, 02, 'Bananas', 101, 102, 5.00),
(1, 03, 'Bananas', 103, 102, 5.00),
(1, 04, 'Bananas', 103, 102, 5.00),
(2, 05, 'Bananas', 201, 202, 5.00),
(2, 06, 'Bananas', 201, 202, 5.00),
(2, 07, 'Bananas', 201, 202, 5.00),
(2, 08, 'Bananas', 201, 202, 5.00),
(2, 09, 'Bananas', 201, 202, 5.00);
*/
