const fs = require("fs");
const express = require("express");
const _ = require("lodash");
const sql_query = require("./sql");
const path = require("path");
const { Pool } = require("pg");
//create .env file (ignored by git for privacy) to store environment variables
//etc. DATABASE_URL=postgres://<username>:<password>@localhost:5432/pet_care
require("dotenv").config();

const app = express();

//register view engine
app.set("view engine", "ejs");
//Set default view directory as /views/
app.set("views");
//Set path for static files
app.use(express.static(path.join(__dirname, "public")));
//to parse response to json
app.use(express.json());

//DB connection
//Use pool.query to run a query on the first available idle client
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.get("/caretaker", async (req, res) => {
  try {
    const allCareTaker = await pool.query(sql_query.query.all_caretaker);
    res.render("search", { careTakers: allCareTaker.rows });
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    res.render("./profiles/test_profile", {title: "Profile"});
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/ongoing_transactions", async (req, res) => {
  try {
    res.render("./profiles/test_ongoing_transactions", {title: "Ongoing Transactions"});
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server has started on port 3000");
<<<<<<< Updated upstream
});

app.get("/transactions", (req, res) => {
  //Place holder account email "1"
  queryText = 'SELECT ct_email, num_pet_days, start_date, end_date,'
              + 'total_cost, status FROM pet_care.hire ' 
              + 'WHERE owner_email = $1';
  queryValue = ["1"];
  pool.query(queryText, queryValue)
      .then(queryRes => {
        console.log(queryRes.rows);
        res.render('transactions', {transactions : queryRes.rows});
      })
      .catch(err => console.error(err.stack))

=======
>>>>>>> Stashed changes
});