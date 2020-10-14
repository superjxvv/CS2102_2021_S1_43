const fs = require("fs");
const express = require("express");
const _ = require("lodash");
const sql_query = require("./sql");
const path = require("path");
const { Pool } = require("pg");
//Authentication stuff
const bcrypt = require('bcrypt')
const session = require('express-session');
const flash = require('express-flash');

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
//Parse POST request
app.use(express.urlencoded({ extended : true}));
//Makes it a session
app.use(session({
  secret: "secret",

  resave: false,

  saveUninitialized: false
}));
//Displays flash messages
app.use(flash());

//DB connection
//Use pool.query to run a query on the first available idle client
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.get("/search", async (req, res) => {
  try {
    const allCareTaker = await pool.query(sql_query.query.all_caretaker);
    res.render("search", { careTakers: allCareTaker.rows });
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/caretaker-summary-info", async (req, res) => {
  try {
    const allCareTaker = await pool.query(sql_query.query.all_caretaker);
    const allPetTypes = await pool.query(sql_query.query.all_pet_type);
    res.render("caretaker-summary-info", { careTakers: allCareTaker.rows, petTypes: allPetTypes.rows });
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
});

/*
**
** Section for YS: Register, Login, View Transactions
**
**
*/
app.get("/register", (req, res) => {
  res.render("register", {msg : ''});
});

app.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    let {name, email, region, password1} = req.body;

    if (!name || !email || region === "") {
      res.render("register", {msg : "Please enter all fields"});
    } else {
      let hashedPw = await bcrypt.hash(password1, 10);
      
      const queryText = "SELECT 1 FROM pet_care.pet_owner WHERE email = $1";
      const queryValue = [email];
      //First check if user already exists
      pool.query(queryText, queryValue)
          .then(queryRes => {
            if (queryRes.rows.length > 0) {
              res.render("register", {msg : "User already exists, please use another email"})
            } else {
              console.log("register user");
              //Not exist yet. Insert into db.
              pool.query(`INSERT INTO pet_care.pet_owner VALUES($1, $2, $3, $4)`, [email, name, hashedPw, region])
                  .then(result => {
                    console.log("Registered");
                    req.flash("You are now registered, please login.")
                    res.redirect("/login");
                  })
                  .catch(err => {
                    throw (error);
                  });
            }
          })
          .catch(err => {
            throw (err);
          });
      }

    } catch (err) {
      console.log(err)
    }
})

app.get("/login", (req, res) => {
  res.send("Placeholder login page.")
})

app.get("/transactions", (req, res) => {
  //Place holder account email "1"
  const queryText = 'SELECT ct_email, num_pet_days, start_date, end_date,'
              + 'total_cost, status FROM pet_care.hire ' 
              + 'WHERE owner_email = $1';
  const queryValue = ["1"];
  pool.query(queryText, queryValue)
      .then(queryRes => {
        console.log(queryRes.rows);
        res.render('transactions', {transactions : queryRes.rows});
      })
      .catch(err => console.error(err.stack))

});