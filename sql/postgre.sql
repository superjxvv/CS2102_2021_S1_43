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
  monthly_salary INTEGER,
  rating INTEGER,
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
  name VARCHAR NOT NULL,
  special_requirement VARCHAR NOT NULL,
  email VARCHAR REFERENCES pet_owner(email),
  PRIMARY KEY(name, email)
);

CREATE TABLE type (
  name VARCHAR PRIMARY KEY,
  base_daily_price INTEGER NOT NULL
);

CREATE TABLE can_take_care_of(
  email VARCHAR REFERENCES care_taker(email),
  daily_price INTEGER NOT NULL,
  type VARCHAR REFERENCES type(name),
  PRIMARY KEY(email, type)
);

CREATE TABLE is_of (
  type VARCHAR REFERENCES type(name),
  petName VARCHAR NOT NULL,
  owner_email VARCHAR NOT NULL,
  FOREIGN KEY (petName, owner_email) REFERENCES own_pet(name, email),
  PRIMARY KEY (type, petName, owner_email)
);

CREATE TABLE date_range (
  start_date DATE,
  end_date DATE,
  PRIMARY KEY(start_date, end_date)
);

CREATE TYPE status AS ENUM('pendingAccept', 'rejected', 'pendingPayment', 'paymentMade', 'inProgress', 'completed', 'cancelled');

CREATE TYPE pet_transfer AS ENUM('cPickup', 'oDeliver', 'office');

CREATE TABLE hire (
  owner_email VARCHAR,
  name VARCHAR,
  ct_email VARCHAR REFERENCES care_taker(email),
  num_pet_days INTEGER NOT NULL,
  total_cost NUMERIC NOT NULL,
  status status,
  method_of_pet_transfer pet_transfer NOT NULL,
  method_of_payment VARCHAR NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text VARCHAR,
  PRIMARY KEY(owner_email, name, ct_email, start_date, end_date),
  FOREIGN KEY (owner_email, name) REFERENCES own_pet(email, name),
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
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('fchansonne4@paginegialle.it', 'Farica Chansonne', 'ojbM5BfZ', 'Real', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('sbigly5@marketwatch.com', 'Sharline Bigly', 'AgOnqfCJzN9', 'Tomari', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('iconley6@zimbio.com', 'Isak Conley', 'Y6e9N0B', 'Su-ngai Kolok', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('ksabben7@dailymotion.com', 'Katheryn Sabben', 'yKx2G3vdCFmp', 'Montauban', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('bclendinning8@qq.com', 'Babette Clendinning', '7aprXPzTxeBR', 'Sannikovo', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('jkidson9@msn.com', 'Jethro Kidson', 'DUVrGD5t5R', 'Wright', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('dcastanoa@java.com', 'Devon Castano', 'q8Sur95ui', 'Brodnica', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('screminsb@disqus.com', 'Salaidh Cremins', 'KIWuuhVNyQh', 'Cordova', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('kbirdwhistlec@ucla.edu', 'Kristien Birdwhistle', 'iOuAgwH3', 'Susanino', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('fcastangiad@taobao.com', 'Freddy Castangia', 'WiH4ZwftV7', 'Zhongbao', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('hgianolinie@cnn.com', 'Hagen Gianolini', 'FL16UtvxK', 'Calapan', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('isharrockf@joomla.org', 'Isobel Sharrock', 'dbiOxP0vE47', 'Altay sumu', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('mchucksg@goodreads.com', 'Melly Chucks', 'kXrGqY', 'Fushë-Muhurr', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('dpealh@xrea.com', 'Dexter Peal', 'Y0gemcZE', 'Gómfoi', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('bhakonseni@ask.com', 'Bethena Hakonsen', '613EVpzs', 'Changchun', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('hjirzikj@google.de', 'Harriot Jirzik', 'N6twVaNSl', 'Shuanggang', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('lvinauk@4shared.com', 'Liesa Vinau', 'cC85mElT', 'Lelystad', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('mchippindalll@shop-pro.jp', 'Marthe Chippindall', '1B90T1', 'Sadovo', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('frimmingtonm@discovery.com', 'Flossy Rimmington', 'ZzYlSdZuSrzq', 'Metahāra', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('mpettingern@hibu.com', 'Moses Pettinger', 'quQUaf7oh', 'Gaocheng', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('bpooneo@smugmug.com', 'Boris Poone', 'u2ON7Sl78uaZ', 'Songgang', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('nnorthp@economist.com', 'Natassia North', 'rrTcAcTA', 'Verkhniy Landekh', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('zcorderoq@google.ru', 'Zechariah Cordero', 'pGy0PYgKrm8', 'Zhouyuan', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('lpawnsfordr@netvibes.com', 'Levin Pawnsford', 'nPs0emzNV9X8', 'Mondim de Basto', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('jkytes@hugedomains.com', 'Josy Kyte', 'B6pm2xSF', 'Malibong East', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('kmatovict@usgs.gov', 'Kathrine Matovic', 'x8ezZf8cKnk', 'Xujiadian', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('bdedmanu@columbia.edu', 'Blake Dedman', 'q3etmAjM15', 'Pandanrejokrajan', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('sosmantv@unesco.org', 'Shanan Osmant', 'MKGLH4eFWV', 'Zhifang', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('tswornw@surveymonkey.com', 'Theresita Sworn', '5H6XePkFrS7w', 'Chodzież', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('djarrittx@php.net', 'Deva Jarritt', 'yB9OUvKpgNgF', 'Mutum', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('kpeaty@blogtalkradio.com', 'Kareem Peat', 'pv1gZH', 'Tolstoy-Yurt', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('dfrancescozziz@ox.ac.uk', 'Dexter Francescozzi', 's5UFJwl', 'Richmond', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('nhalpin10@stumbleupon.com', 'Nanon Halpin', 'KiJcquK', 'Liangdang Chengguanzhen', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('ofinby11@skyrock.com', 'Oneida Finby', 'PYTUr8bnvle', 'Rogóźno', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('adigger12@amazonaws.com', 'Alphonse Digger', '6KAkiEsoBm7', 'Boychinovtsi', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('idunklee13@miitbeian.gov.cn', 'Ingra Dunklee', 'MzVwio6OoAN2', 'Bakersfield', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('cbertson14@oracle.com', 'Clem Bertson', 'E7c0Iot8T', 'Otyniya', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('ajeannequin15@timesonline.co.uk', 'Arly Jeannequin', 'AwCiWiQ', 'Chernyshevsk', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('csilverston16@moonfruit.com', 'Cameron Silverston', 'jzLT3IXMXE', 'Verkhozim', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('rmulcaster17@trellian.com', 'Rafferty Mulcaster', 'QuUOcMPY', 'Monte Carmelo', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('ijose18@wunderground.com', 'Ignazio Jose', 'vV86HcE4', 'Thủ Thừa', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('afenny19@4shared.com', 'Alameda Fenny', '2HtNb3oEObwV', 'Yidu', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('lshingfield1a@ocn.ne.jp', 'Lorne Shingfield', 'B8redGOC', 'Dallas', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('eheinrich1b@hexun.com', 'Elsworth Heinrich', '9Ymi77phpGl', 'Bahay Pare', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('cduffett1c@gov.uk', 'Codie Duffett', 'V08TbX', 'Podujeva', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('xgeldert1d@mozilla.com', 'Xylia Geldert', 'DYQrIvnXEAFX', 'Prokuplje', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('igarfield1e@altervista.org', 'Issiah Garfield', 'JeTHZx8Vq4M', 'Kota Kinabalu', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('afeechan1f@reverbnation.com', 'Angelica Feechan', 'rEF1NGK', 'Whittier', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('wdarree1g@mac.com', 'Wheeler Darree', 'rvvLvEZq2V', 'Aqaba', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('pcorrado1h@cpanel.net', 'Penny Corrado', 'ZMfasknhV', 'Linjiang', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('dkrugmann1i@disqus.com', 'Devin Krugmann', '3J8uhrNQqmJb', 'Haysyn', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('sskatcher1j@godaddy.com', 'Stacy Skatcher', 'JgQp3AtPxy44', 'Tartaro', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('cminmagh1k@skyrock.com', 'Consuelo Minmagh', 'l4RZap', 'Nueva Guinea', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('gfaers1l@topsy.com', 'Gerri Faers', 'k7Hi4ebumPeO', 'Pochayiv', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('dputnam1m@e-recht24.de', 'Donia Putnam', '1EPoYF', 'San Juan Sacatepéquez', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('cdredge1n@toplist.cz', 'Catlee Dredge', 'TiwqnvKEtHm', 'Ko Si Chang', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('nzimmermeister1o@tinyurl.com', 'Neilla Zimmermeister', '5dTio3d2CO8', 'Heerlen', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('cesterbrook1p@mapquest.com', 'Catha Esterbrook', 'IF42gej', 'Lynn', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('mslemmonds1q@artisteer.com', 'Maurits Slemmonds', 'Y4hgkFiT0Z', 'Martingança-Gare', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('mcrank1r@twitter.com', 'Maggi Crank', '0Xhcjo', 'Currais', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('cminguet1s@sogou.com', 'Claudian Minguet', 'qlwUp6Ku38', 'Novosil', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('wizkoveski1t@diigo.com', 'Wilfrid Izkoveski', 'WDvmwKbqnDcg', 'Mekarsari', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('mwillas1u@msn.com', 'Michel Willas', 'LfLt96l7', 'Brooklyn', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('creinmar1v@google.it', 'Caye Reinmar', 'vwW9tym', 'Changzhi', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('scambridge1w@odnoklassniki.ru', 'Scarlet Cambridge', 'ua3UhwcWbR', 'Hacienda La Calera', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('jegglestone1x@cnet.com', 'Jocko Egglestone', 'wyYwDF3Ir', 'Dulce Nombre', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('lyounglove1y@mit.edu', 'Lynn Younglove', 'YUfmINu', 'San Francisco', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('ktoft1z@mapy.cz', 'Karia Toft', '4qRM5O', 'Olo', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('ktidd20@salon.com', 'Krystyna Tidd', 'dmtUVqd', 'Pandean', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('sricardon21@smugmug.com', 'Simon Ricardon', '3X11xTelyV', 'Banjar Batuaji Kaja', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('nbracknall22@google.it', 'Nanon Bracknall', 'PoaVHIWjZ', 'Entre Rios', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('olempel23@yolasite.com', 'Ora Lempel', '9ujItFTUza', 'Malanay', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('mspringle24@plala.or.jp', 'Mildrid Springle', 'V3XTJGkDxk', 'Lugui', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('fhairyes25@ca.gov', 'Filippo Hairyes', 'IeRo329g', 'Campelos', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('agoggey26@taobao.com', 'Annnora Goggey', 'GygVVPhjFy', 'Kajiado', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('wbaccus27@google.co.uk', 'Wilhelmine Baccus', '0KRuzEBUyx1', 'Changling', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('hsarra28@businesswire.com', 'Hamilton Sarra', 'oRQHSiDq6Kz', 'Ciepielów', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('csheddan29@yelp.com', 'Corinna Sheddan', 'IFsWGeK9Z', 'Yamethin', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('nworrell2a@fda.gov', 'Nannette Worrell', 'q52EeJxt', 'Cachoeiras de Macacu', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('cohara2b@example.com', 'Claretta O''Hara', 'Vv3zthZiU26', 'Quma', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('tferrie2c@vkontakte.ru', 'Tedie Ferrie', 'aDXEXV', 'Glotovka', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('cfernez2d@ow.ly', 'Clary Fernez', 'iBMYaj3lTc', 'Cluain Meala', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('tgritten2e@theguardian.com', 'Thor Gritten', 'zmYe6GPmn8El', 'Iroquois Falls', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('bdeller2f@hostgator.com', 'Brita Deller', 'Dl5Fy9qlfn', 'Īz̄eh', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('randreassen2g@altervista.org', 'Rhody Andreassen', 'fkO5s4h', 'Tadianjie', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('rcuniffe2h@nytimes.com', 'Ruddie Cuniffe', 'V5iU2MurD5p', 'Unisław', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('egrishunin2i@istockphoto.com', 'Etheline Grishunin', 'YaYUl0', 'Pinheiros', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('kdeery2j@odnoklassniki.ru', 'Katy Deery', 'FZiVFZHtpXV', 'Odeleite', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('pdamp2k@mashable.com', 'Phip Damp', 'Ew7Rup', 'Hougang', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('mcroce2l@acquirethisname.com', 'Melvin Croce', 'ae8n4QZx77', 'Fox Creek', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('svivien2m@ucsd.edu', 'Sharon Vivien', '144BHh', 'Siemiechów', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('cdalmon2n@archive.org', 'Cate Dalmon', 'brgZey', 'Göteborg', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('sle2o@epa.gov', 'Stacy Le Brom', 'FmlbIxYJBi', 'Pointe Michel', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('ctennet2p@pen.io', 'Cob Tennet', 'cJsw6P', 'Popasna', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('dpercy2q@microsoft.com', 'Douglass Percy', 'VGX4uA', 'Bradford', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('abeggin2r@skype.com', 'Ailbert Beggin', 'lvmnOWPOUB', 'Itagibá', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('gpixton2s@vkontakte.ru', 'Gerik Pixton', 'C4a1irTjFB', 'Smokvica', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('brizzardi2t@indiatimes.com', 'Ban Rizzardi', 'gknFNgnw', 'Jambesari', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('cedward2u@usgs.gov', 'Charity Edward', '5nUqKi', 'La Sierpe', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('bdomerc2v@studiopress.com', 'Brinna Domerc', 'cmJNGm', 'Baquero Norte', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('vmccrum2w@imgur.com', 'Vasili McCrum', 'tlS3bPxvFMtu', 'Debrecen', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('crymell2x@bravesites.com', 'Cirillo Rymell', 'pZGXgtAU6eQt', 'Las Minas', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('hdabnot2y@slashdot.org', 'Holmes Dabnot', 'opJjlHW5jvG', 'Juan Adrián', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('fcolumbine2z@stumbleupon.com', 'Fredelia Columbine', 'CUXObjat08', 'Kiuola', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('nsemken30@independent.co.uk', 'Nettie Semken', 'TZBfkE', 'Tobias Fornier', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('fwestgarth31@storify.com', 'Forrester Westgarth', 'Ezdw1faCv', 'Mariestad', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('jsline32@mysql.com', 'Jinny Sline', 'TqkTqDyko', 'Perpignan', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('rpendered33@scribd.com', 'Rowena Pendered', 'Jw8XzXkP10jf', 'Thị Trấn Ngọc Lặc', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('dcharrisson34@narod.ru', 'Daryn Charrisson', 'nvA66kI', 'Pak Phayun', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('aingold35@wordpress.org', 'Adriane Ingold', '9kf5qrtC', 'Pawłowiczki', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('lcheston36@wikispaces.com', 'Lonnie Cheston', 'cV4BlfVm', 'Madur', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('hebunoluwa37@slideshare.net', 'Henka Ebunoluwa', '8d0C2o', 'Phrae', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('bleadston38@amazon.co.jp', 'Beatrisa Leadston', '5wTtww4wLiJ1', 'Guataquí', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('cgiacomini39@cmu.edu', 'Carmine Giacomini', 'Qb0G8HHyhaV', 'Jinshan', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('pgrim3a@ihg.com', 'Pierrette Grim', 'g5De5rLS', 'Mustvee', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('sbratcher3b@example.com', 'Sindee Bratcher', 'wkGZ1siiebn', 'Flora', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('ckiehne3c@prnewswire.com', 'Constanta Kiehne', 'UfDA9ZpK', 'Huế', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('chappert3d@liveinternet.ru', 'Claudianus Happert', 'AilkPUy2T', 'Tuzhu', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('payres3e@google.com.br', 'Pier Ayres', '4N2YvoyxZb', 'Xindong', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('eschruyer3f@ox.ac.uk', 'Elnora Schruyer', 'xYGWf2vgCWb', 'Karangharjo', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('wseabrook3g@gizmodo.com', 'Willi Seabrook', '9LJ4Qrk', 'Shuanghejiedao', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('nblayney3h@pen.io', 'Nicki Blayney', 'CyuBaUCzbFRm', 'Ciputih', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('agrinham3i@4shared.com', 'Augy Grinham', 'YBBuLdmD', 'Torino', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('hmusterd3j@gizmodo.com', 'Hillyer Musterd', 'qoereC1sc', 'Tiancheng', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('sminmagh3k@sohu.com', 'Sada Minmagh', 't2A94lsPkY', 'Kiarajangkung', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('chollyland3l@tinyurl.com', 'Charmaine Hollyland', 'j0UhhTBuj', 'Cilegong', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('lwhitbread3m@google.com.br', 'Lee Whitbread', 'rgDD8Xx', 'Xilinji', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('jpendergrast3n@washington.edu', 'Jens Pendergrast', 'Fth6XS6iFB5', 'Shankeng', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('lclements3o@typepad.com', 'Llywellyn Clements', '2grbgx4wtq', 'Kakamigahara', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('oosban3p@infoseek.co.jp', 'Oliy Osban', 'SI1MbslanjE', 'Calingcing', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('fsargison3q@who.int', 'Filippa Sargison', '6OBmIaW7iIA', 'Koktokay', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('dmarr3r@mapy.cz', 'Deborah Marr', 'qvUZzRI', 'Garupá', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('ielmhurst3s@bigcartel.com', 'Innis Elmhurst', 'sN6vIyltIX', 'Shixi', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('ahindrick3t@nasa.gov', 'Armand Hindrick', '1R9hYKzRCle', 'Myasnikyan', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('pdelafoy3u@aboutads.info', 'Papageno Delafoy', '9DKFVFFXcAS', 'Douba', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('ncordero3v@sourceforge.net', 'Neill Cordero', 'AaxxR27Jdbnp', 'Baoluan', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('enewgrosh3w@skyrock.com', 'Ellie Newgrosh', 'drMJVLI00Uk', 'Owen Sound', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('cruckhard3x@google.com.au', 'Chrysler Ruckhard', 'RCGxnE', 'Shchuchin', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('hmcgill3y@deliciousdays.com', 'Hardy McGill', 'm0t6Ke', 'Balice', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('dlorenc3z@washingtonpost.com', 'Daffie Lorenc', '4x5ev1Vv', 'Rabat', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('ckentwell40@apache.org', 'Chadd Kentwell', 'u4avxN', 'Fenghuangdong', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('bsongist41@admin.ch', 'Blondelle Songist', 'gZShaKpywd5I', 'Reston', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('lcherrie42@woothemes.com', 'Lettie Cherrie', '0QJ3dmsal0a', 'Mbumi', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('lcrowhurst43@irs.gov', 'Linus Crowhurst', 'LBrJzQAd', 'Chợ Chu', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('cfreegard44@cmu.edu', 'Corabel Freegard', 'xR1VfgK', 'Čajniče', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('mpossell45@desdev.cn', 'Mira Possell', 'tMwH8dYVSgRc', 'Chaman', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('bdi46@jigsy.com', 'Bob Di Giorgio', 'gPt1u8', 'Balsas', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('lshayes47@cbsnews.com', 'Lon Shayes', 'khgz2ht', 'Santa Rosa', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('tshoobridge48@tripod.com', 'Terri-jo Shoobridge', 'Ig0HIf', 'Murakami', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('afasson49@auda.org.au', 'Aurora Fasson', 'ptvfdpcO', 'Hartford', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('cmacalaster4a@google.com.hk', 'Curcio MacAlaster', 'NyEF4jvT7Ipz', 'Wŏnsan', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('rfincham4b@vk.com', 'Rollie Fincham', 'MeZoTe', 'Huoshaoping', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('jclapson4c@soup.io', 'Joane Clapson', '9GCD94tCHYvZ', 'Mukacheve', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('ctrollope4d@techcrunch.com', 'Corbet Trollope', 'MaCOTigTxEBF', 'De la Paz', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('amcomish4e@godaddy.com', 'Artie McOmish', '3yOSKRP', 'Bebedouro', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('bspeerman4f@vk.com', 'Bobinette Speerman', '9wfUhAtlRjo', 'Alcoy', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('btulley4g@wired.com', 'Bradly Tulley', 'm4DmSeLmkbc1', 'Taipinghu', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('mmanhood4h@pagesperso-orange.fr', 'Marianna Manhood', 'K73YVcqfBRs', 'El Progreso', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('dflatt4i@nhs.uk', 'Dalton Flatt', 'GexO9fSm4qhs', 'Oulad Frej', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('hgrinnov4j@ebay.com', 'Horatio Grinnov', '3J7zb1B', 'Cantaura', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('rstallwood4k@pcworld.com', 'Rebe Stallwood', 'vAwWs8NoI3g', 'Villefranche-sur-Saône', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('dhail4l@rakuten.co.jp', 'Dorry Hail', '7y2AN5LqZl', 'Taipingzhuang', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('vpenniell4m@sbwire.com', 'Vasilis Penniell', 'O2vKGB', 'Mapusagafou', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('fbickers4n@ted.com', 'Freddie Bickers', 'OlO8xIJ7i', 'Dundee', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('dpahl4o@xrea.com', 'Dylan Pahl', 'b02ToSyLB', 'Belozërsk', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('ggandrich4p@edublogs.org', 'Griz Gandrich', 'pfP98CvN', 'Várzea', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('pstandell4q@tinypic.com', 'Parnell Standell', 'LeW7Ex7veU', 'Cicurug', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('dstratford4r@examiner.com', 'Dee Stratford', 'rEqmzbtS', 'Xiliguantun', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('gfrontczak4s@sohu.com', 'Gawen Frontczak', 'lRvcSnUJo', 'Qianying', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('agreenhough4t@flavors.me', 'Amelie Greenhough', 'R3cgen0d6', 'Tangkil', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('aturfus4u@spiegel.de', 'Addy Turfus', 'nFkkzqdkS3cS', 'Mithi', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('atring4v@nationalgeographic.com', 'Albert Tring', 'tqBuYKBE0Oyj', 'Velké Opatovice', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('jsemechik4w@mtv.com', 'Jannel Semechik', 'VJV01MC', 'Zhouzai', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('swaryk4x@example.com', 'Solly Waryk', 'PEYZYJEdt2eI', 'Jandayan', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('jgilhooly4y@about.me', 'Johnny Gilhooly', 'sIOiwBKQadj', 'Banjar Kubu', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('dconeybeer4z@utexas.edu', 'Davida Coneybeer', 'UvYJFlZ', 'Valladolid', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('nmilam50@altervista.org', 'Ninnetta Milam', '1aM2lk', 'Mbouda', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('dmallall51@woothemes.com', 'Donelle Mallall', 'aQxPq5j', 'Al Fukhkhārī', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('zsyfax52@myspace.com', 'Zola Syfax', 'kL5b6a', 'Akaki', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('winsley53@indiegogo.com', 'Waylen Insley', '5aGj2H9DnX', 'Smederevska Palanka', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('gcullabine54@ezinearticles.com', 'Giulio Cullabine', 'aQpcgwS', 'Longquan', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('lianson55@wufoo.com', 'Letitia I''anson', 'ASm8HU3vV1', 'Yuxi', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('ksturton56@fotki.com', 'Kalina Sturton', 'ej5pVTY', 'Samur', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('nminghetti57@tiny.cc', 'Nellie Minghetti', '8KyOuanNq', 'Quốc Oai', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('dpoland58@topsy.com', 'Dagmar Poland', 'eLLLeOFCEn2E', 'Jingzhou', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('sbumpus59@tmall.com', 'Sandra Bumpus', 'tzJ2muX', 'Kura', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('nmacardle5a@mit.edu', 'Norri MacArdle', 'iMvNKWDN', 'Hluhluwe', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('jruddiman5b@cocolog-nifty.com', 'Jacklyn Ruddiman', 'cOn9MGTW3', 'Narbonne', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('skonert5c@nsw.gov.au', 'Stefan Konert', '1VcgJ88fF', 'Heshe', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('jbingley5d@livejournal.com', 'Janis Bingley', 'u4lzL9PYV', 'Tiên Phước', null, null, null, null, null, 'part_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('tstarrs5e@spiegel.de', 'Trever Starrs', 'G5sr7N6G', 'Mandalgovi', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('jbutlin5f@springer.com', 'Jelene Butlin', '5akcJa7c5ed', 'Urzhar', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('dcone5g@ameblo.jp', 'Dun Cone', 'HkLEAnSB7ME', 'Shixi', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('rrubinowitz5h@tumblr.com', 'Rosene Rubinowitz', 'hCa9Jyw7ms9A', 'Zevgolateió', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('cloveridge5i@homestead.com', 'Cleavland Loveridge', 'XoiPSQO', 'Choloma', null, null, null, null, null, 'full_timer');
insert into care_taker (email, name, password, location, monthly_pet_days, monthly_salary, rating, bank_account, max_concurrent_pet_limit, job) values ('vdeville5j@blinklist.com', 'Veronica Deville', 'EmLuojk', 'Medveditskiy', null, null, null, null, null, 'part_timer');
