const sql = {};

sql.query = {
  // all careTaker
  all_caretaker:
    'SELECT c.email, c.name, c.location, c.rating, t.daily_price + p.base_daily_price AS price, t.pet_type FROM care_taker c INNER JOIN can_take_care_of t ON c.email = t.email INNER JOIN pet_type p ON t.pet_type = p.name',
  // all pet_type
  all_pet_type: 'SELECT * FROM pet_type',
  // caretaker summary info
  caretaker_summary_info:
    "SELECT C.name, C.email, SUM(H.num_pet_days) AS num_pet_days, SUM(H.total_cost) AS total_cost, EXTRACT(MONTH FROM H.transaction_date) AS month FROM care_taker C, hire H WHERE C.email = H.ct_email AND H.hire_status = 'completed' GROUP BY C.email, EXTRACT(MONTH FROM H.transaction_date)",
  // top 4 ratings
  caretaker_top_ratings:
    'SELECT name, location, rating, job FROM care_taker ORDER BY rating DESC LIMIT 4',
  // 4 most recent completed transactions
  recent_completed_transactions:
    "SELECT * FROM hire WHERE hire_status = 'completed' ORDER BY transaction_date DESC LIMIT 4",
  // 4 most recently ongoing transactions
  recent_ongoing_transactions:
    "SELECT * FROM hire WHERE hire_status <> 'completed' AND hire_status <> 'cancelled' AND hire_status <> 'rejected' ORDER BY transaction_date DESC LIMIT 4",
  // 4 of my pets
  my_pets: 'SELECT * FROM own_pet LIMIT 4'
};

module.exports = sql;
