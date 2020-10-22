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
    const startDate = new Date();
    const endDate = new Date();
    console.log(startDate, endDate);
    const allCareTaker = await pool.query(sql_query.query.all_caretaker, [
      startDate,
      endDate
    ]);
    res.render('search', { careTakers: allCareTaker.rows });
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/search/:startDate/:endDate', async (req, res) => {
  try {
    console.log(new Date(req.params.startDate));
    console.log(new Date(req.params.endDate));
    console.log(new Date());
    const startDate = new Date(req.params.startDate) || new Date();
    const endDate = new Date(req.params.endDate) || new Date();
    console.log(startDate, endDate);
    const allCareTaker = await pool.query(sql_query.query.all_caretaker, [
      startDate,
      endDate
    ]);
    res.render('search', { careTakers: allCareTaker.rows });
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/caretaker-summary-info', async (req, res) => {
  try {
    //todo: check that user is admin
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

app.get('/pet-types', async (req, res) => {
  try {
    //todo: check that user is admin
    const allPetTypes = await pool.query(
      sql_query.query.all_pet_types
    );
    var launchToast = req.url.includes("add=pass");
    console.log(launchToast)
    res.render('pet-types', {
      allPetTypes: allPetTypes.rows,
      showSuccessToast: launchToast
    });
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/add-pet-type', async (req, res) => {
  try {
    //todo: check that user is admin
    const allPetTypes = await pool.query(
      sql_query.query.all_pet_types
    );
    res.render('add-pet-type', {
      allPetTypes: allPetTypes.rows
    });
  } catch (err) {
    console.error(err.message);
  }
});

app.post('/add-pet-type', async (req, res) => {
  //todo: check that user is admin
  var name = req.body.name;
  var baseDailyPrice = req.body.basedailyprice

  await pool.query(sql_query.query.add_pet_type, [name, baseDailyPrice], (err, data) => {
    if (err) {
      res.redirect('/add-pet-type?add=fail');
    } else {
      res.redirect('/pet-types?add=pass');
    }
  });
});

app.get('/dashboard', async (req, res) => {
  try {
    if (!req.user) {
      res.redirect('/login');
    } else {
      const account_type = req.user.type;
      if (account_type != 0) {
        const query =
          account_type == 1
            ? sql_query.query.get_po_info
            : sql_query.query.get_ct_info;
        const values = ['ahymans0@printfriendly.com']; // hardcoded
        const my_location = await pool.query(query, values);
        values[0] = my_location.rows[0].location;
        const caretaker_top_ratings = await pool.query(
          sql_query.query.caretaker_top_ratings,
          values
        );
        values[0] = 'ahymans0@printfriendly.com';
        const recent_transactions = await pool.query(
          sql_query.query.recent_trxn_po,
          values
        );
        const my_pets = await pool.query(sql_query.query.my_pets, values);
        res.render('./dashboard', {
          title: 'Dashboard',
          top_ratings: caretaker_top_ratings.rows,
          recent_trxn: recent_transactions.rows,
          my_pets: my_pets.rows,
          my_email: req.user.email,
          my_name: req.user.name,
          hardcode_email: 'ahymans0@printfriendly.com'
        });
      } else {
        // if is PCSadmin
        // have not tried this out
        res.redirect('/caretaker-summary-info');
      }
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/profile/:iden', async (req, res) => {
  try {
    if (!req.user) {
      res.redirect('/login');
    } else {
      const ct_name = req.params.iden;
      const values = [ct_name]; 
      const get_ct_trxns = await pool.query(sql_query.query.get_ct_email, values)
      // const po_info = await pool.query(sql_query.query.get_po_info, values);
      // const po_pets = await pool.query(sql_query.query.my_pets, values);

      res.render('./caretaker_profile', {
        title: 'Profile',
        get_ct_trxns: get_ct_trxns.rows
      });
    }
  } catch (err) {
    console.error(err.message);
  }
});

/*
 ** Section for YS: Register, View Transactions
 ** TODO: Change all msg to flash messages.
 */
app.get('/register', (req, res) => {
  res.render('register', { msg: '' });
});

app.post('/register', async (req, res) => {
  try {
    console.log(req.body);
    let { name, email, region, password1, type } = req.body;

    if (!name || !email || region === '') {
      req.flash('error', 'Please enter all fields');
      res.render('register');
    } else {
      let hashedPw = await bcrypt.hash(password1, 10);

      const queryText = 'SELECT 1 FROM accounts WHERE email = $1';
      const queryValue = [email];
      //First check if user already exists
      pool
        .query(queryText, queryValue)
        .then((queryRes) => {
          if (queryRes.rows.length > 0) {
            req.flash('error', 'User already exists.');
            res.render('register');
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
    res.redirect('/dashboard');
  } else {
    res.render('login');
  }
});

//If authenticate successful, redirect to profile, it not,
//go to login page and show failure messages (in passportConfig.js)
app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
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

app.get('/test', (req, res) => {
  res.render('test');
});
app.get('/transactions', (req, res) => {
  if (req.user) {
    const userEmail = ['ahymans0@printfriendly.com']; // hardcoded
    const allTransactions = sql_query.query.get_my_trxn;

    pool
      .query(allTransactions, userEmail)
      .then((queryRes) => {
        console.log(queryRes.rows);
        res.render('transactions', {
          name: req.user.name,
          resAllTrans: queryRes.rows,
          resOngoingTrans: queryRes.rows.filter(
            (x) => x.hire_status != 'completed' && x.hire_status != 'rejected' && x.hire_status != 'cancelled'
          ),
          resPastTrans: queryRes.rows.filter(
            (x) => x.hire_status == 'completed' || x.hire_status == 'rejected' || x.hire_status == 'cancelled'
          )
        });
      })
      .catch((err) => console.error(err.stack));
  } else {
    req.flash('error', 'Please login before accessing your transactions.');
    res.redirect('/login');
  }
});
