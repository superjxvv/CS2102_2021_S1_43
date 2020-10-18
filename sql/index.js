const sql = {};

sql.query = {
  // all careTaker
  all_caretaker: "SELECT * FROM care_taker",
  // all pet_type
  all_pet_type: "SELECT * FROM pet_type",
  // caretaker summary info
  caretaker_summary_info: "SELECT C.name, SUM(H.num_pet_days) AS num_pet_days, SUM(H.total_cost) AS total_cost FROM care_taker C, hire H WHERE C.email = H.ct_email AND H.hire_status = 'completed' GROUP BY C.email",
  // top 4 ratings
  caretaker_top_ratings: "SELECT name, location, rating, job FROM care_taker ORDER BY rating DESC LIMIT 4",
  // 4 most recent completed transactions
  recent_completed_transactions: "SELECT * FROM hire WHERE hire_status = 'completed' ORDER BY transaction_date DESC LIMIT 4",
  // 4 most recently ongoing transactions
  recent_ongoing_transactions: "SELECT * FROM hire WHERE hire_status <> 'completed' AND hire_status <> 'cancelled' ORDER BY transaction_date DESC LIMIT 4"
};

module.exports = sql;