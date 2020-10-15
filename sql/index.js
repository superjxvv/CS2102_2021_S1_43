const sql = {};

sql.query = {
  // CareTaker
  all_caretaker: "SELECT * FROM care_taker",
  // pet_type
  all_pet_type: "SELECT * FROM pet_type",
  // top 4 ratings
  caretaker_top_ratings: "SELECT name, location, rating, job FROM care_taker ORDER BY rating DESC LIMIT 4",
  // 4 most recent completed transactions
  recent_completed_transactions: "SELECT * FROM hire WHERE hire_status = 'completed' ORDER BY transaction_date DESC LIMIT 4",
  // 4 most recently ongoing transactions
  recent_ongoing_transactions: "SELECT * FROM hire WHERE hire_status <> 'completed' AND hire_status <> 'cancelled' ORDER BY transaction_date DESC LIMIT 4"
};

module.exports = sql;