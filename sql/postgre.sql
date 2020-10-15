CREATE TABLE pcs_admin(
  email VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  password VARCHAR NOT NULL
);

CREATE TABLE pet_owner(
  email VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  password VARCHAR NOT NULL,
  location VARCHAR NOT NULL
);

CREATE TYPE job_type AS ENUM ('part_timer', 'full_timer');

CREATE TABLE care_taker(
  email VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  password VARCHAR NOT NULL,
  location VARCHAR NOT NULL,
  monthly_pet_days INTEGER DEFAULT 0,
  monthly_salary NUMERIC,
  rating NUMERIC,
  bank_account VARCHAR, 
  max_concurrent_pet_limit INTEGER,
  job job_type NOT NULL
);

CREATE TABLE part_timer(
  email VARCHAR PRIMARY KEY REFERENCES care_taker(email)
);

CREATE TABLE full_timer(
  email VARCHAR PRIMARY KEY REFERENCES care_taker(email)
);

CREATE TABLE own_pet (
  pet_name VARCHAR NOT NULL,
  special_requirement VARCHAR NOT NULL,
  email VARCHAR REFERENCES pet_owner(email),
  PRIMARY KEY(pet_name, email)
);

CREATE TABLE pet_type (
  name VARCHAR PRIMARY KEY,
  base_daily_price NUMERIC NOT NULL
);

CREATE TABLE can_take_care_of(
  email VARCHAR REFERENCES care_taker(email),
  daily_price NUMERIC NOT NULL,
  pet_type VARCHAR REFERENCES pet_type(name),
  PRIMARY KEY(email, pet_type)
);

CREATE TABLE is_of (
  pet_type VARCHAR REFERENCES pet_type(name),
  pet_name VARCHAR NOT NULL,
  owner_email VARCHAR NOT NULL,
  FOREIGN KEY (pet_name, owner_email) REFERENCES own_pet(pet_name, email),
  PRIMARY KEY (pet_type, pet_name, owner_email)
);

CREATE TABLE date_range (
  start_date DATE,
  end_date DATE,
  PRIMARY KEY(start_date, end_date)
);

CREATE TYPE hire_status AS ENUM('pendingAccept', 'rejected', 'pendingPayment', 'paymentMade', 'inProgress', 'completed', 'cancelled');

CREATE TYPE pet_transfer AS ENUM('cPickup', 'oDeliver', 'office');

CREATE TYPE method_of_payment AS ENUM('cash', 'creditcard');

CREATE TABLE hire (
  owner_email VARCHAR,
  pet_name VARCHAR,
  ct_email VARCHAR REFERENCES care_taker(email),
  num_pet_days INTEGER NOT NULL,
  total_cost NUMERIC NOT NULL,
  hire_status hire_status NOT NULL,
  method_of_pet_transfer pet_transfer NOT NULL,
  method_of_payment method_of_payment NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text VARCHAR,
  PRIMARY KEY(owner_email, pet_name, ct_email, start_date, end_date),
  FOREIGN KEY (owner_email, pet_name) REFERENCES own_pet(email, pet_name),
  FOREIGN KEY(start_date, end_date) REFERENCES date_range(start_date, end_date)
);

CREATE TABLE indicates_availability (
	email VARCHAR NOT NULL REFERENCES part_timer(email),
	start_date DATE NOT NULL,
	end_date DATE NOT NULL,
	PRIMARY KEY(email, start_date, end_date)
);

CREATE TABLE has_leave (
	email VARCHAR NOT NULL REFERENCES full_timer(email),
	start_date DATE NOT NULL,
	end_date DATE NOT NULL,
	PRIMARY KEY(email, start_date, end_date)
);

insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('cdrinan0@economist.com', 'Charmion Drinan', '2nlDfqG', 'Cienfuegos', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('carro1@narod.ru', 'Cody Arro', '7HjFxA3Q7yk4', 'Laojun', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('ckempe2@usnews.com', 'Chrissy Kempe', 'Xenqsvp6', 'Basīrpur', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('gbroader3@mozilla.org', 'Goldia Broader', 'gNfijRz8a3J', 'Gotse Delchev', null, null, null, null, null, 'part_timer');
insert into pet_owner (email, name, password, location) values ('fchansonne4@paginegialle.it', 'Farica Chansonne', 'ojbM5BfZ', 'Real');
insert into pet_owner (email, name, password, location) values ('sbigly5@marketwatch.com', 'Sharline Bigly', 'AgOnqfCJzN9', 'Tomari');
insert into pet_owner (email, name, password, location) values ('iconley6@zimbio.com', 'Isak Conley', 'Y6e9N0B', 'Su-ngai Kolok');
insert into pet_owner (email, name, password, location) values ('ksabben7@dailymotion.com', 'Katheryn Sabben', 'yKx2G3vdCFmp', 'Montauban');

insert into pet_type (name, base_daily_price) values ('Rabbits', '48.72');
insert into pet_type (name, base_daily_price) values ('Hamster', '43.68');
insert into pet_type (name, base_daily_price) values ('Cat', '72.72');
insert into pet_type (name, base_daily_price) values ('Dog', '82.97');
insert into pet_type (name, base_daily_price) values ('Guinea pigs', '36.33');
insert into pet_type (name, base_daily_price) values ('Turtles', '60.34');
insert into pet_type (name, base_daily_price) values ('Bird', '93.24');
insert into pet_type (name, base_daily_price) values ('Reptile', '81.10');
insert into pet_type (name, base_daily_price) values ('Ferret', '37.94');

insert into own_pet(pet_name, special_requirement, email) values ('Doggie', 'No chocolate', 'fchansonne4@paginegialle.it');
insert into own_pet(pet_name, special_requirement, email) values ('Kitkat', 'Likes to sleep', 'sbigly5@marketwatch.com');
insert into own_pet(pet_name, special_requirement, email) values ('Mickey', 'Allergic to nuts', 'iconley6@zimbio.com');
insert into own_pet(pet_name, special_requirement, email) values ('Pancakes', 'No bright lights', 'ksabben7@dailymotion.com');

insert into is_of(pet_type, pet_name, owner_email) values ('Dog', 'Doggie', 'fchansonne4@paginegialle.it');
insert into is_of(pet_type, pet_name, owner_email) values ('Cat', 'Kitkat', 'sbigly5@marketwatch.com');
insert into is_of(pet_type, pet_name, owner_email) values ('Hamster', 'Mickey', 'iconley6@zimbio.com');
insert into is_of(pet_type, pet_name, owner_email) values ('Reptile', 'Pancakes', 'ksabben7@dailymotion.com');

insert into date_range(start_date, end_date) values ('2020-10-20', '2020-10-24'); 
insert into date_range(start_date, end_date) values ('2020-10-20', '2020-10-22'); 
insert into date_range(start_date, end_date) values ('2020-10-20', '2020-10-20'); 

insert into hire(owner_email, pet_name, ct_email, num_pet_days, total_cost, hire_status, method_of_pet_transfer, method_of_payment, start_date, end_date, rating, review_text) 
values ('fchansonne4@paginegialle.it', 'Doggie', 'cdrinan0@economist.com', '5', '414.85', 'completed', 'office', 'cash', '2020-10-20', '2020-10-24', '4', 'Not bad');
insert into hire(owner_email, pet_name, ct_email, num_pet_days, total_cost, hire_status, method_of_pet_transfer, method_of_payment, start_date, end_date, rating, review_text) 
values ('sbigly5@marketwatch.com', 'Kitkat', 'carro1@narod.ru', '3', '218.16', 'completed', 'office', 'cash', '2020-10-20', '2020-10-22', '5', 'Excellent!');
insert into hire(owner_email, pet_name, ct_email, num_pet_days, total_cost, hire_status, method_of_pet_transfer, method_of_payment, start_date, end_date, rating, review_text) 
values ('iconley6@zimbio.com', 'Mickey', 'ckempe2@usnews.com', '3', '131.04', 'completed', 'office', 'cash', '2020-10-20', '2020-10-22', '3', '-');
insert into hire(owner_email, pet_name, ct_email, num_pet_days, total_cost, hire_status, method_of_pet_transfer, method_of_payment, start_date, end_date, rating, review_text)
values ('ksabben7@dailymotion.com', 'Pancakes', 'gbroader3@mozilla.org', '1', '81.10', 'completed', 'office', 'cash', '2020-10-20', '2020-10-20', '4', 'Okay');