const sql = {};

sql.query = {
  // Information
  all_caretaker:
    'SELECT c.email, c.name, c.location, c.rating, t.daily_price + p.base_daily_price AS price, t.pet_type, a.start_date, a.end_date FROM care_taker c INNER JOIN can_take_care_of t ON c.email = t.email INNER JOIN pet_type p ON t.pet_type = p.name INNER JOIN indicates_availability as a ON c.email = a.email WHERE a.start_date <= $1 AND a.end_date >= $2',
  all_pet_types: 'SELECT * FROM pet_type ORDER BY name',
  selected_pet_type: 'SELECT * FROM pet_type WHERE name=$1',
  first_4_pet_types: 'SELECT * FROM pet_type ORDER BY name LIMIT 4',
  first_4_caretakers: "SELECT C.name, C.email, SUM(H.num_pet_days) AS num_pet_days FROM care_taker C, hire H WHERE C.email = H.ct_email AND H.hire_status = 'completed' GROUP BY C.email ORDER BY C.name LIMIT 4",
  caretaker_summary_info:
    "SELECT C.name, C.email, SUM(H.num_pet_days) AS num_pet_days, SUM(H.total_cost) AS total_cost, EXTRACT(MONTH FROM H.transaction_date) AS month FROM care_taker C, hire H WHERE C.email = H.ct_email AND H.hire_status = 'completed' GROUP BY C.email, EXTRACT(MONTH FROM H.transaction_date)",
  
    // Insertion
  add_pet_type: 'INSERT INTO pet_type (name, base_daily_price) VALUES($1,$2)',

    // top 4 ratings
  caretaker_top_ratings:
    'SELECT name, location, rating, job, email FROM care_taker WHERE location = $1 ORDER BY rating DESC LIMIT 4',
  // 4 most recent transactions
  recent_trxn_po:
    'SELECT H.hire_status, H.start_date, H.end_date, C.name AS ct_name, C.email AS ct_email, P.name AS po_name, H.pet_name, H.rating, H.review_text FROM hire H INNER JOIN care_taker C ON H.ct_email = C.email INNER JOIN pet_owner P ON H.owner_email = P.email WHERE H.owner_email = $1 ORDER BY H.transaction_date DESC LIMIT 4',
  // 4 of my pets
  my_pets:
    'SELECT * FROM own_pet O INNER JOIN is_of I ON O.pet_name = I.pet_name AND O.email = I.owner_email WHERE O.email = $1 LIMIT 4',
  get_po_info: 'SELECT * FROM pet_owner WHERE email = $1',
  get_ct_info: 'SELECT * FROM care_taker WHERE email = $1',
  get_my_trxn: "SELECT C.email AS ct_email, C.name as ct_name, *, CASE WHEN H.hire_status = 'pendingAccept' THEN 1 ELSE 2 END AS button FROM hire H INNER JOIN care_taker C ON H.ct_email = C.email WHERE H.owner_email = $1 ORDER BY transaction_date DESC, start_date DESC, end_date DESC",
  get_ct_trxn: 'SELECT C.name AS ct_name, C.email AS ct_email, H.hire_status, H.start_date, H.end_date, H.rating, H.review_text, P.name AS po_name, I.pet_type AS type, H.pet_name FROM care_taker C INNER JOIN hire H ON C.email = H.ct_email INNER JOIN pet_owner P ON P.email = H.owner_email INNER JOIN is_of I ON I.owner_email = P.email WHERE C.email = $1 ORDER BY H.transaction_date DESC LIMIT 4',
  get_a_hire: "SELECT * FROM hire WHERE owner_email = $1 AND ct_email = $2 AND start_date = $3 AND end_date = $4 AND pet_name = $5",
  get_ct_type: "SELECT job FROM care_taker WHERE email = $1",
  dates_caring: "SELECT start_date, end_date FROM hire WHERE ct_email = $1",
  part_timer_availability: "SELECT start_date, end_date FROM indicates_availability WHERE email = $1",
  full_timer_leave: "SELECT start_date, end_date FROM has_leave WHERE email = $1",
  delete_bid: "DELETE FROM hire WHERE owner_email = $1 AND ct_email = $2 AND start_date = $3 AND end_date = $4 AND pet_name = $5",
  petFromType : "SELECT pet_name FROM is_of WHERE owner_email = $1 AND pet_type = $2",
  add_bid: "INSERT INTO hire(owner_email, pet_name, ct_email, num_pet_days, total_cost, hire_status, method_of_pet_transfer, start_date, end_date, transaction_date) VALUES ($1, $2, $3, $4, $5, 'pendingAccept', $6, $7, $8, $9)",
  dailyPriceGivenTypeAndCT : "SELECT daily_price FROM can_take_care_of WHERE email = $1 AND pet_type = $2",
  ownerAddress: "SELECT address FROM pet_owner WHERE email = $1",
  petTypeFromOwnerAndName: "SELECT pet_type FROM is_of WHERE owner_email = $1 and pet_name = $2"

};

module.exports = sql;
