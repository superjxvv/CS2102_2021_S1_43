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
const { exception } = require('console');
const e = require('express');
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

app.get('/', async (req, res) => {
  if (!req.user) {
    res.redirect('/login');
  } else {
    res.redirect('/dashboard');
  }
});

app.get('/search', async (req, res) => {
  try {
    const startDate = new Date();
    const endDate = new Date();
    const location = 'All';
    const selectedPetTypes = [];
    let rating = 'DESC';
    let price = 'DESC';
    let allCareTaker;
    allCareTaker = await pool.query(
      sql_query.query.all_caretaker_rating_desc_price_desc,
      [startDate, endDate]
    );
    const allPetTypes = await pool.query(sql_query.query.all_pet_types);
    res.render('search', {
      loggedInUser: req.user,
      careTakers: allCareTaker.rows,
      selectedLocation: location,
      petTypes: allPetTypes.rows,
      selectedPetTypes,
      rating,
      price
    });
  } catch (err) {
    console.error(err.message);
  }
});

app.get(
  '/search/:startDate/:endDate/:location/:petTypes/:rating/:price',
  async (req, res) => {
    try {
      const startDate = new Date(req.params.startDate) || new Date();
      const endDate = new Date(req.params.endDate) || new Date();
      const location = req.params.location;
      const selectedPetTypes = JSON.parse(req.params.petTypes);
      const rating = req.params.rating;
      const price = req.params.price;
      console.log(
        startDate,
        endDate,
        location,
        selectedPetTypes,
        rating,
        price
      );
      if (
        location != 'All' &&
        selectedPetTypes.length == 0 &&
        rating == 'DESC' &&
        price == 'DESC'
      ) {
        allCareTaker = await pool.query(
          sql_query.query.filtered_location_caretaker_rating_desc_price_desc,
          [startDate, endDate, location]
        );
      } else if (
        location == 'All' &&
        selectedPetTypes.length == 0 &&
        rating == 'DESC' &&
        price == 'DESC'
      ) {
        allCareTaker = await pool.query(
          sql_query.query.all_caretaker_rating_desc_price_desc,
          [startDate, endDate]
        );
      } else if (
        location != 'All' &&
        selectedPetTypes.length > 0 &&
        rating == 'DESC' &&
        price == 'DESC'
      ) {
        allCareTaker = await pool.query(
          sql_query.query
            .filtered_location_pet_type_caretaker_rating_desc_price_desc,
          [startDate, endDate, location, selectedPetTypes]
        );
      } else if (
        location == 'All' &&
        selectedPetTypes.length > 0 &&
        rating == 'DESC' &&
        price == 'DESC'
      ) {
        allCareTaker = await pool.query(
          sql_query.query.filtered_pet_type_caretaker_rating_desc_price_desc,
          [startDate, endDate, selectedPetTypes]
        );
      } else if (
        location != 'All' &&
        selectedPetTypes.length == 0 &&
        rating == 'DESC' &&
        price == 'ASC'
      ) {
        allCareTaker = await pool.query(
          sql_query.query.filtered_location_caretaker_rating_desc_price_asc,
          [startDate, endDate, location]
        );
      } else if (
        location == 'All' &&
        selectedPetTypes.length == 0 &&
        rating == 'DESC' &&
        price == 'ASC'
      ) {
        allCareTaker = await pool.query(
          sql_query.query.all_caretaker_rating_desc_price_asc,
          [startDate, endDate]
        );
      } else if (
        location != 'All' &&
        selectedPetTypes.length > 0 &&
        rating == 'DESC' &&
        price == 'ASC'
      ) {
        allCareTaker = await pool.query(
          sql_query.query
            .filtered_location_pet_type_caretaker_rating_desc_price_asc,
          [startDate, endDate, location, selectedPetTypes]
        );
      } else if (
        location == 'All' &&
        selectedPetTypes.length > 0 &&
        rating == 'DESC' &&
        price == 'ASC'
      ) {
        allCareTaker = await pool.query(
          sql_query.query.filtered_pet_type_caretaker_rating_desc_price_asc,
          [startDate, endDate, selectedPetTypes]
        );
      } else if (
        location != 'All' &&
        selectedPetTypes.length == 0 &&
        rating == 'ASC' &&
        price == 'DESC'
      ) {
        allCareTaker = await pool.query(
          sql_query.query.filtered_location_caretaker_rating_asc_price_desc,
          [startDate, endDate, location]
        );
      } else if (
        location == 'All' &&
        selectedPetTypes.length == 0 &&
        rating == 'ASC' &&
        price == 'DESC'
      ) {
        allCareTaker = await pool.query(
          sql_query.query.all_caretaker_rating_asc_price_desc,
          [startDate, endDate]
        );
      } else if (
        location != 'All' &&
        selectedPetTypes.length > 0 &&
        rating == 'ASC' &&
        price == 'DESC'
      ) {
        allCareTaker = await pool.query(
          sql_query.query
            .filtered_location_pet_type_caretaker_rating_asc_price_desc,
          [startDate, endDate, location, selectedPetTypes]
        );
      } else if (
        location == 'All' &&
        selectedPetTypes.length > 0 &&
        rating == 'ASC' &&
        price == 'DESC'
      ) {
        allCareTaker = await pool.query(
          sql_query.query.filtered_pet_type_caretaker_rating_asc_price_desc,
          [startDate, endDate, selectedPetTypes]
        );
      } else if (
        location != 'All' &&
        selectedPetTypes.length == 0 &&
        rating == 'ASC' &&
        price == 'ASC'
      ) {
        allCareTaker = await pool.query(
          sql_query.query.filtered_location_caretaker_rating_asc_price_asc,
          [startDate, endDate, location]
        );
      } else if (
        location == 'All' &&
        selectedPetTypes.length == 0 &&
        rating == 'ASC' &&
        price == 'ASC'
      ) {
        allCareTaker = await pool.query(
          sql_query.query.all_caretaker_rating_asc_price_asc,
          [startDate, endDate]
        );
      } else if (
        location != 'All' &&
        selectedPetTypes.length > 0 &&
        rating == 'ASC' &&
        price == 'ASC'
      ) {
        allCareTaker = await pool.query(
          sql_query.query
            .filtered_location_pet_type_caretaker_rating_asc_price_asc,
          [startDate, endDate, location, selectedPetTypes]
        );
      } else if (
        location == 'All' &&
        selectedPetTypes.length > 0 &&
        rating == 'ASC' &&
        price == 'ASC'
      ) {
        allCareTaker = await pool.query(
          sql_query.query.filtered_pet_type_caretaker_rating_asc_price_asc,
          [startDate, endDate, selectedPetTypes]
        );
      }
      const allPetTypes = await pool.query(sql_query.query.all_pet_types);
      res.render('search', {
        loggedInUser: req.user,
        careTakers: allCareTaker.rows,
        selectedLocation: location,
        petTypes: allPetTypes.rows,
        selectedPetTypes,
        rating,
        price
      });
    } catch (err) {
      console.error(err.message);
    }
  }
);

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
    const allPetTypes = await pool.query(sql_query.query.all_pet_types);
    var launchToast = req.url.includes('add=pass');
    console.log(launchToast);
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
    const allPetTypes = await pool.query(sql_query.query.all_pet_types);
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
  var baseDailyPrice = req.body.basedailyprice;

  await pool.query(
    sql_query.query.add_pet,
    [name, baseDailyPrice],
    (err, data) => {
      if (err) {
        res.redirect('/add-pet-type?add=fail');
      } else {
        res.redirect('/pet-types?add=pass');
      }
    }
  );
});

app.get('/edit-pet-type', async (req, res) => {
  try {
    //todo: check that user is admin
    const allPetTypes = await pool.query(sql_query.query.all_pet_types);
    res.render('add-pet-type', {
      allPetTypes: allPetTypes.rows
    });
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/pcs-admin-dashboard', async (req, res) => {
  try {
    //todo: check that user is admin
    const first4PetTypes = await pool.query(sql_query.query.first_4_pet_types);
    const first4Caretakers = await pool.query(
      sql_query.query.first_4_caretakers
    );
    res.render('pcs-admin-dashboard', {
      first4PetTypes: first4PetTypes.rows,
      first4Caretakers: first4Caretakers.rows
    });
  } catch (err) {
    console.error(err.message);
  }
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

app.get('/my_pets', async (req, res) => {
  if (!req.user) {
    res.redirect('/login');
  } else {
    const values = ['ahymans0@printfriendly.com']; // hardcoded
    const query = await pool.query(sql_query.query.all_my_pets, values);
    res.render('./my_pets', {
      title: 'My Pets',
      all_pets: query.rows
    });
  }
});

app.get('/add_pet', async (req, res) => {
  if (!req.user) {
    res.redirect('/login');
  } else {
    const pet_types = await pool.query(sql_query.query.all_pet_types);
    res.render('./add_pet', {
      title: 'Add Pets',
      pet_types: pet_types.rows
    });
  }
});

app.post('/add_pet', async (req, res) => {
  if (!req.user) {
    res.redirect('/login');
  } else {
    const pet_name = req.body.pet_name;
    const special_req = req.body.special_req;
    const pet_type = req.body.pet_type;
    const values = [
      pet_name,
      special_req,
      'ahymans0@printfriendly.com',
      pet_type
    ]; // hardcoded
    await pool.query(sql_query.query.add_pet, values, (err, data) => {
      if (err) {
        console.log(err);
        res.redirect('/add_pet?add=fail');
      } else {
        res.redirect('/add_pet?add=pass');
      }
    });
  }
});

app.get('/profile/:iden', async (req, res) => {
  try {
    if (!req.user) {
      res.redirect('/login');
    } else {
      const ct_email = req.params.iden;
      const values = [ct_email];
      const get_ct_trxns = await pool.query(
        sql_query.query.get_ct_trxn,
        values
      );

      res.render('./caretaker_profile', {
        title: 'Profile of ' + get_ct_trxns.rows[0].ct_name,
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
              req.flash('success_msg', 'You are now registered, please login.');
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

app.get('/checkout', (req, res) => {
  res.render('bid');
});

const transferConvert = (method) => {
  if (method == 'oDeliver') {
    return 'Dropoff at caretaker';
  } else if (method == 'cPickup') {
    return 'Caretaker pickup';
  } else if (method == 'office') {
    return 'Dropoff at Pet Care office';
  }
};

/*
Pushes all dates within given range into outputArr.
Function takes in 3 arguments with 1 optional argument, criteriaSet. 
If a date is in criteria set it won't be added to output set.
function(startDate, endDate, outputSet, criteriaSet)
*/
function datesFromRange(startDate, endDate, outputSet) {
  var startDate = arguments[0].toISOString();
  var endDate = arguments[1].toISOString();
  var dateMove = new Date(startDate);
  var strDate = startDate;

  while (strDate < endDate) {
    var strDate = dateMove.toISOString().slice(0, 10);
    if (arguments[3]) {
      if (!argumemts[3].has(strDate)) {
        arguments[2].add(strDate);
      }
    } else {
      arguments[2].add(strDate);
    }
    dateMove.setDate(dateMove.getDate() + 1);
  }
}

app.post('/edit_bid', async (req, res) => {
  console.log(req.body);
  //req.body contains the primary key for that particular hire to be edited, passed in by a form from /transactions.
  const originalQueryValues = Object.values(req.body);
  const originalHire = await pool.query(
    sql_query.query.get_a_hire,
    originalQueryValues
  );
  const ct_email = [originalHire.rows[0].ct_email];
  //Whether ct is full time or part time
  const jobType = await pool.query(sql_query.query.get_ct_type, ct_email);
  //Dates that this ct is already booked.
  const datesCaring = await pool.query(sql_query.query.dates_caring, ct_email);
  var datesToDelete = new Set();
  for (var i = 0; i < datesCaring.rows.length; i++) {
    const usedDate = datesCaring.rows[i];
    datesFromRange(usedDate.start_date, usedDate.end_date, datesToDelete);
  }
  console.log(datesToDelete);
  var datesToAllow = new Set();

  //Part timer only show available dates
  if (jobType.rows[0].job == 'part_timer') {
    const availability = await pool.query(
      sql_query.query.part_timer_availability,
      ct_email
    );
    for (var i = 0; i < availability.rows.length; i++) {
      const canDate = availability.rows[i];
      datesFromRange(
        canDate.start_date,
        canDate.end_date,
        datesToAllow,
        datesToDelete
      );
    }
    res.render('edit_bid', {
      transferCover: transferConvert,
      trans: originalHire.rows[0]
    });

    //Full timer will disable some dates
  } else {
    const leave = await pool.query(sql_query.query.full_timer_leave, ct_email);
    for (var i = 0; i < leave.rows.length; i++) {
      const leaveDate = leave.rows[i];
      datesFromRange(leaveDate.start_date, leaveDate.end_date, datesToDelete);
    }
    res.render('edit_bid', {
      transferConvert: transferConvert,
      trans: originalHire.rows[0]
    });
  }
});

app.get('/transactions', (req, res) => {
  if (req.user) {
    const userEmail = ['ahymans0@printfriendly.com']; // hardcoded
    const allTransactions = sql_query.query.get_my_trxn;

    pool
      .query(allTransactions, userEmail)
      .then((queryRes) => {
        res.render('transactions', {
          name: req.user.name,
          resAllTrans: queryRes.rows,
          resOngoingTrans: queryRes.rows.filter(
            (x) =>
              x.hire_status != 'completed' &&
              x.hire_status != 'rejected' &&
              x.hire_status != 'cancelled'
          ),
          resPastTrans: queryRes.rows.filter(
            (x) =>
              x.hire_status == 'completed' ||
              x.hire_status == 'rejected' ||
              x.hire_status == 'cancelled'
          ),
          moment: moment,
          title: 'Transactions'
        });
      })
      .catch((err) => console.error(err.stack));
  } else {
    req.flash('error', 'Please login before accessing your transactions.');
    res.redirect('/login');
  }
});
