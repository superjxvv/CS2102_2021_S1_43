const sql = {};

sql.query = {
  // all careTaker
  all_caretaker: "SELECT * FROM care_taker",
  // all pet_type
  all_pet_type: "SELECT * FROM pet_type",
  // caretaker summary info
  caretaker_summary_info: "SELECT C.name, SUM(H.num_pet_days) AS num_pet_days, SUM(H.total_cost) AS total_cost FROM care_taker C, hire H WHERE C.email = H.ct_email AND H.hire_status = 'completed' GROUP BY C.email",
  // top 4 ratings
  caretaker_top_ratings: "SELECT name, location, rating, job FROM care_taker WHERE location = $1 ORDER BY rating DESC LIMIT 4",
  // 4 most recent completed transactions
  recent_trxn_po: "SELECT H.hire_status, H.start_date, H.end_date, C.name AS ct_name, P.name AS po_name, H.pet_name FROM hire H INNER JOIN care_taker C ON H.ct_email = C.email INNER JOIN pet_owner P ON H.owner_email = P.email WHERE H.hire_status = 'completed' AND H.owner_email = $1 ORDER BY H.transaction_date DESC LIMIT 4",
  // 4 most recently ongoing transactions for pet_owner
  ongoing_trxn_po: "SELECT H.hire_status, H.start_date, H.end_date, C.name AS ct_name, P.name AS po_name, H.pet_name FROM hire H INNER JOIN care_taker C ON H.ct_email = C.email INNER JOIN pet_owner P ON H.owner_email = P.email WHERE H.hire_status <> 'completed' AND H.hire_status <> 'cancelled' AND H.hire_status <> 'rejected' AND H.owner_email = $1 ORDER BY H.transaction_date DESC LIMIT 4",
  // 4 of my pets
  my_pets: "SELECT * FROM own_pet WHERE email = $1 LIMIT 4",
};

module.exports = sql;