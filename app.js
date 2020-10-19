const fs = require('fs');
const express = require('express');
const _ = require('lodash');
const sql_query = require('./sql');
const path = require('path');
const { Pool } = require('pg');
const moment = require('moment');
//Authentication stuff -------------------
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const initializePassport = require('./passportConfig');
initializePassport(passport);
// -------------------------------------

//create .env file (ignored by git for privacy) to store environment variables
//etc. DATABASE_URL=postgres://<username>:<password>@localhost:5432/pet_care
require('dotenv').config();

const app = express();

//register view engine
app.set('view engine', 'ejs');
//Set default view directory as /views/
app.set('views');
//Set path for static files
app.use(express.static(path.join(__dirname, 'public')));
//to parse response to json
app.use(express.json());
//Parse POST request
app.use(express.urlencoded({ extended: true }));
//Makes it a session
app.use(
  session({
    secret: 'mySecretCode!',

    resave: false,

    saveUninitialized: false
  })
);

//Displays flash messages
app.use(flash());

//Login middleware
app.use(passport.initialize());
app.use(passport.session());

//DB connection
//Use pool.query to run a query on the first available idle client
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', (client) => {
  client.query('SET search_path TO pet_care');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('server has started on port 3000');
});

app.get('/search', async (req, res) => {
  try {
    const allCareTaker = await pool.query(sql_query.query.all_caretaker);
    console.log(allCareTaker.rows[0]);
    res.render('search', { careTakers: allCareTaker.rows });
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/caretaker-summary-info', async (req, res) => {
  try {
    const summaryInfo = await pool.query(
      sql_query.query.caretaker_summary_info
    );
    res.render('caretaker-summary-info', {
      caretakerSummaryInfo: summaryInfo.rows,
      months: moment.months()
    });
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/profile', async (req, res) => {
  try {
    const caretaker_top_ratings = await pool.query(
      sql_query.query.caretaker_top_ratings
    );
    const recent_ongoing_transactions = await pool.query(
      sql_query.query.recent_ongoing_transactions
    );
    const recent_completed = await pool.query(
      sql_query.query.recent_completed_transactions
    );
    const my_pets = await pool.query(sql_query.query.my_pets);
    res.render('./profile', {
      title: 'Profile',
      top_ratings: caretaker_top_ratings.rows,
      ongoing_transactions: recent_ongoing_transactions.rows,
      completed_transactions: recent_completed.rows,
      my_pets: my_pets.rows
    });
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/ongoing_transactions', async (req, res) => {
  try {
    res.render('./test_ongoing_transactions', {
      title: 'Ongoing Transactions'
    });
  } catch (err) {
    console.error(err.message);
  }
});

/*
 ** Section for YS: Register, View Transactions
 */
app.get('/register', (req, res) => {
  res.render('register', { msg: '' });
});

app.post('/register', async (req, res) => {
  try {
    console.log(req.body);
    let { name, email, region, password1, type } = req.body;

    if (!name || !email || region === '') {
      res.render('register', { msg: 'Please enter all fields' });
    } else {
      let hashedPw = await bcrypt.hash(password1, 10);

      const queryText = 'SELECT 1 FROM accounts WHERE email = $1';
      const queryValue = [email];
      //First check if user already exists
      pool
        .query(queryText, queryValue)
        .then((queryRes) => {
          if (queryRes.rows.length > 0) {
            res.render('register', {
              msg: 'User already exists, please use another email'
            });
          } else {
            console.log('register user');
            //Not exist yet. Insert into db.
            const insertText =
              type == 'pet_owner'
                ? `INSERT INTO pet_owner VALUES ($1, $2, $3, $4)`
                : `INSERT INTO care_taker(email, name, password, location, job) VALUES($1, $2, $3, $4, 'part_timer')`;

            pool
              .query(insertText, [email, name, hashedPw, region])
              .then((result) => {
                console.log('Registered');
                req.flash(
                  'success_msg',
                  'You are now registered, please login.'
                );
                res.redirect('/login');
              })
              .catch((err) => {
                console.error(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } catch (err) {
    console.error(err);
  }
});

app.get('/login', (req, res) => {
  if (req.user) {
    //TODO: Add a hidden div in profile page to display this alert.
    req.flash(
      'error',
      'You are already logged in, please log out to login to another account.'
    );
    res.redirect('/profile');
  } else {
    res.render('login', { msg: '' });
  }
});

//If authenticate successful, redirect to profile, it not,
//go to login page and show failure messages (in passportConfig.js)
app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  })
);

app.get('/logout', (req, res) => {
  const userName = req.user.name;
  req.logout();
  req.flash('success_msg', 'Successfully logged out.');
  res.redirect('/login');
});

//Use to test if a user is logged in.
app.get('/user', (req, res) => {
  if (req.user) {
    res.send(
      `Account email: ${req.user.email} Account name: ${req.user.name} Account type: ${req.user.type}`
    );
  } else {
    res.send('Not logged in');
  }
});

app.get('/transactions', (req, res) => {
  if (req.user) {
    const userEmail = ['1'];
    const allTransactions =
      'SELECT ct_email, num_pet_days, start_date, end_date,' +
      'total_cost, hire_status FROM hire ' +
      'WHERE owner_email = $1 ORDER BY start_date DESC, end_date DESC';

    pool
      .query(allTransactions, userEmail)
      .then((queryRes) => {
        console.log(queryRes.rows);
        res.render('transactions', {
          name: req.user.name,
          resAllTrans: queryRes.rows,
          resOngoingTrans: queryRes.rows.filter(
            (x) => x.hire_status != 'completed' && x.hire_status != 'rejected'
          ),
          resPastTrans: queryRes.rows.filter(
            (x) => x.hire_status == 'completed' || x.hire_status == 'rejected'
          )
        });
      })
      .catch((err) => console.error(err.stack));
  } else {
    req.flash('error', 'Please login before accessing your transactions.');
    res.redirect('/login');
  }
});
