const sql = {};

sql.query = {
  // CareTaker
  all_caretaker: "SELECT * FROM care_taker",
  // pet_type
  all_pet_type: "SELECT * FROM pet_type",
  caretaker_summary_info: "SELECT C.name, SUM(H.num_pet_days) AS num_pet_days, SUM(H.total_cost) AS total_cost FROM care_taker C, hire H WHERE C.email = H.ct_email GROUP BY C.email"
};

module.exports = sql;
