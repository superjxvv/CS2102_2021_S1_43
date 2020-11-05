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
const { send } = require('process');
const sql = require('./sql');
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
  res.redirect('/dashboard');
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
    console.log(allCareTaker.rows);
    const allPetTypes = await pool.query(sql_query.query.all_pet_types);
    res.render('search', {
      loggedInUser: req.user,
      careTakers: allCareTaker.rows,
      selectedLocation: location,
      petTypes: allPetTypes.rows,
      selectedPetTypes,
      rating,
      price,
      loggedIn: req.user,
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
        price,
        loggedIn: req.user,
        accountType: req.user.type
      });
    } catch (err) {
      console.error(err.message);
    }
  }
);

app.post('/pre-bid', async (req, res) => {
  // if (req.user) {
  let { ct_email } = req.body;
  careTakerToBid = await pool.query(sql_query.query.caretaker_to_bid, [
    ct_email
  ]);
  allMyPets = await pool.query(sql_query.query.my_pets_that_can_take_care_of, [
    req.user.email, //change to req.user.email when ready
    ct_email
  ]);
  //Dates that this ct is already booked.
  const datesCaring = await pool.query(sql_query.query.dates_caring, [
    ct_email,
    new Date()
  ]);
  var datesToDelete = new Set();
  for (var i = 0; i < datesCaring.rows.length; i++) {
    const usedDate = datesCaring.rows[i];
    datesFromRange(usedDate.start_date, usedDate.end_date, datesToDelete);
  }
  var datesToAllow = new Set();
  var isPartTimer = false;
  //Part timer only show available dates
  if (careTakerToBid.rows[0].job == 'part_timer') {
    const availability = await pool.query(
      sql_query.query.part_timer_availability,
      [ct_email]
    );
    isPartTimer = true;
    for (var i = 0; i < availability.rows.length; i++) {
      const canDate = availability.rows[i];
      datesFromRange(
        canDate.start_date,
        canDate.end_date,
        datesToAllow,
        datesToDelete
      );
    }

    //Full timer will disable some dates
  } else {
    const leave = await pool.query(sql_query.query.full_timer_leave, [
      ct_email
    ]);
    for (var i = 0; i < leave.rows.length; i++) {
      const leaveDate = leave.rows[i];
      datesFromRange(leaveDate.start_date, leaveDate.end_date, datesToDelete);
    }
  }

  res.render('pre-bid', {
    loggedInUser: req.user,
    loggedInUserEmail: req.user.email, //remove when req.user ready
    careTakerToBid: careTakerToBid.rows[0],
    allMyPets: allMyPets.rows,
    isPartTimer: isPartTimer,
    today: new Date().toISOString().slice(0, 10),
    latestDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      .toISOString()
      .slice(0, 10),
    blockedDates: Array.from(datesToDelete),
    availableDates: Array.from(datesToAllow),
    loggedIn: req.user,
    accountType: req.user.type
  });
  // } else {
  //   req.flash('error', 'Please login before accessing your transactions.');
  //   res.redirect('/login');
  // }
});

app.get('/caretaker-summary-info', async (req, res) => {
  try {
    //todo: check that user is admin
    const summaryInfo = await pool.query(
      sql_query.query.caretaker_summary_info
    );
    res.render('caretaker-summary-info', {
      caretakerSummaryInfo: summaryInfo.rows,
      months: moment.months(),
      loggedIn: req.user,
      accountType: 0
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
      showSuccessToast: launchToast,
      loggedIn: req.user,
      accountType: 0
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
      allPetTypes: allPetTypes.rows,
      loggedIn: req.user,
      accountType: 0
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
    sql_query.query.add_pet_type,
    [name, baseDailyPrice],
    (err, data) => {
      if (err) {
        res.redirect('/add-pet-type?add=fail');
        console.log(err)
      } else {
        res.redirect('/pet-types?add=pass');
      }
    }
  );
});

app.get('/edit-pet-type/:name', async (req, res) => {
  try {
    //todo: check that user is admin
    const name = req.params.name;
    const baseDailyPrice = await pool.query(sql_query.query.base_daily_price_for_pet, [name]);
    console.log(baseDailyPrice)
    res.render('edit-pet-type', {
      name: name,
      baseDailyPrice: baseDailyPrice.rows[0]['base_daily_price'],
      loggedIn: req.user,
      accountType: 0
    });
  } catch (err) {
    console.error(err.message);
  }
});

app.post('/edit-pet-type', async (req, res) => {
  //todo: check that user is admin
  var name = req.body.name;
  var baseDailyPrice = req.body.basedailyprice;

  await pool.query(
    sql_query.query.update_pet_type,
    [name, baseDailyPrice],
    (err, data) => {
      if (err) {
        console.log(err)
      } else {
        res.redirect('/pet-types?add=pass');
      }
    }
  );
});

app.get('/pcs-admin-dashboard', async (req, res) => {
  try {
    //todo: check that user is admin
    const numPetsTakenCareOf = await pool.query(sql_query.query.num_pets_taken_care_of_in_current_month);
    const numTransaction = await pool.query(sql_query.query.active_transactions);
    const numTransactionsInMonthYear = await pool.query(sql_query.query.num_transactions_in_each_month_and_year);
    const first4PetTypes = await pool.query(sql_query.query.first_4_pet_types);
    const first4Caretakers = await pool.query(
      sql_query.query.first_4_caretakers
    );
    const dates = [];
    const counts_PT = [];
    const counts_FT = [];
    for (var i = 0; i < numTransactionsInMonthYear.rowCount; i++) {
      dates.push(numTransactionsInMonthYear.rows[i]['date']);
      counts_PT.push(numTransactionsInMonthYear.rows[i]['count_pt']);
      counts_FT.push(numTransactionsInMonthYear.rows[i]['count_ft']);
    }
    const counts_alldeliverymethods = await pool.query(sql_query.query.num_transactions_in_current_month_alldelivermethod);
    const counts_deliverymethods = [];
    for (var i = 0; i < counts_alldeliverymethods.rowCount; i++) {
      counts_deliverymethods.push(counts_alldeliverymethods.rows[i]['count']);
    }
    res.render('pcs-admin-dashboard', {
      numPetsTakenCareOf: numPetsTakenCareOf.rows[0]['count'],
      numTransaction: numTransaction.rows[0]['count'],
      transactionsDates: dates,
      numTransactionPerDate_PT: counts_PT,
      numTransactionPerDate_FT: counts_FT,
      counts_deliverymethods: counts_deliverymethods,
      first4PetTypes: first4PetTypes.rows,
      first4Caretakers: first4Caretakers.rows,
      loggedIn: req.user,
      accountType: 0
    });
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/search-transactions', async (req, res) => {
  try {
    const currMonth = false;
    const searchstring = "";
    const selectedStatus = [];
    const selectedPetTransferMethod = [];
    let rating = 'DESC';
    let totalCost = 'DESC';
    selectedHires = await pool.query(
      sql_query.query.all_transactions_price_desc_rating_desc
    );
    const allStatus = ['pendingAccept', 'rejected', 'pendingPayment', 'paymentMade', 'inProgress', 'completed', 'cancelled'];

    res.render('search-transactions', {
      loggedInUser: req.user,
      selectedHires: selectedHires.rows,
      allStatus,
      searchstring,
      selectedStatus,
      selectedPetTransferMethod,
      rating,
      totalCost,
      currMonth,
      loggedIn: req.user,
      accountType: 0
    });
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/search-transactions/:status/:currMonth', async (req, res) => {
  try {
    const currMonth = req.params.currMonth;
    const searchstring = "";
    const selectedStatus = JSON.parse(req.params.status);
    const selectedPetTransferMethod = [];
    let rating = 'DESC';
    let totalCost = 'DESC';
    if (selectedStatus.length > 0) {
      if (currMonth == 'false') {
        selectedHires = await pool.query(sql_query.query.filter_transactions_status_price_desc_rating_desc, [selectedStatus]);
      } else {
        selectedHires = await pool.query(sql_query.query.filter_currmonth_transactions_status_price_desc_rating_desc, [selectedStatus]);
      }
    } else {
      if (currMonth == 'false') {
        selectedHires = await pool.query(
          sql_query.query.all_transactions_price_desc_rating_desc
        );
      } else {
        selectedHires = await pool.query(
          sql_query.query.curr_month_transactions_price_desc_rating_desc
        );
      }
    }
    const allStatus = ['pendingAccept', 'rejected', 'pendingPayment', 'paymentMade', 'inProgress', 'completed', 'cancelled'];

    res.render('search-transactions', {
      loggedInUser: req.user,
      selectedHires: selectedHires.rows,
      allStatus,
      searchstring,
      selectedStatus,
      selectedPetTransferMethod,
      rating,
      totalCost,
      currMonth,
      loggedIn: req.user,
      accountType: 0
    });
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/dashboard', async (req, res) => {
  try {
    if (!req.user) {
      const top_ct_general = await pool.query(sql_query.query.best_ct);
      const recent_trxn_completed = await pool.query(
        sql_query.query.recent_trxn_general_completed
      );
      res.render('./dashboard', {
        title: 'Dashboard',
        top_ratings: top_ct_general.rows,
        recent_trxn: recent_trxn_completed.rows,
        statusToHuman: statusToHuman,
        loggedIn: req.user,
        today: new Date().toISOString().slice(0, 10),
        accountType: 3
      });
    } else {
      const account_type = req.user.type;
      if (account_type == 1) {
        const values = [req.user.email];
        const my_details = await pool.query(
          sql_query.query.get_po_info,
          values
        );
        const caretaker_top_ratings = await pool.query(
          sql_query.query.caretaker_top_ratings,
          [my_details.rows[0].location]
        );
        const recent_transactions = await pool.query(
          sql_query.query.recent_trxn_po,
          values
        );
        const my_pets = await pool.query(sql_query.query.all_my_pets, values);

        res.render('./dashboard', {
          title: 'Dashboard',
          top_ratings: caretaker_top_ratings.rows,
          recent_trxn: recent_transactions.rows,
          my_pets: my_pets.rows,
          my_details: my_details.rows,
          statusToHuman: statusToHuman,
          loggedIn: true,
          today: new Date().toISOString().slice(0, 10),
          accountType: account_type
        });
      } else if (account_type == 2) {
        res.redirect('/dashboard-caretaker-ft');
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

app.get('/dashboard-caretaker-ft', async (req, res) => {
  try {
    if (!req.user) {
      res.redirect('/login');
    } else {
      const account_type = req.user.type;
      if (account_type != 0) {
        const values = [req.user.email];
        console.log(values);
        const my_details = await pool.query(
          sql_query.query.get_ct_info,
          values
        );
        console.log(my_details.rows);
        const recent_transactions = await pool.query(
          sql_query.query.recent_trxn_po,
          values
        );
        const pet_days = await pool.query(
          sql_query.query.ct_pet_days,
          values
        );
        const salary = await pool.query(
          sql_query.query.ct_salary,
          values
        );
        console.log(pet_days);
        // const jobTypeQuery = await pool.query(sql_query.query.get_ct_type,
        //   values
        // );
        // const jobType = jobTypeQuery.rows[0].job;
        // if (jobType == 'part-timer') {
        //   var additional_pet_limit = Math.ceil((rating - 3) / 0.5);
        //   additional_pet_limit = additional_pet_limit > 3 ? 3 : additional_pet_limit;
        //   additional_pet_limit = additional_pet_limit < 0 ? 0 : additional_pet_limit;
        //   const pet_limit = 2 + additional_pet_limit;
        // } else {
        //   const pet_limit = 5;
        // }

        res.render('./dashboard-caretaker-ft', {
          title: 'Dashboard',
          recent_trxn: recent_transactions.rows,
          my_details: my_details.rows,
          statusToHuman: statusToHuman,
          loggedIn: req.user,
          accountType: account_type,
          pet_days: pet_days.rows[0].num_pet_days,
          salary: salary.rows[0].total_cost
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

app.get('/apply_leave', async (req, res) => {
  try {
    if (!req.user) {
      res.redirect('/login');
    } else {
      const account_type = req.user.type;
      if (account_type != 0) {
        res.render('./apply_leave', {
          title: 'Apply Leave',
          statusToHuman: statusToHuman,
          loggedIn: req.user,
          accountType: account_type
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
    const account_type = req.user.type;
    if (account_type == 2) {
      res.redirect('/dashboard-caretaker-ft');
    } else {
      const values = [req.user.email];
      const query = await pool.query(sql_query.query.all_my_pets, values);
      res.render('./my_pets', {
        title: 'My Pets',
        all_pets: query.rows,
        loggedIn: req.user,
        accountType: req.user.type
      });
    }
  }
});

app.get('/edit_particulars', async (req, res) => {
  if (!req.user) {
    res.redirect('/login');
  } else {
    const values = [req.user.email];
    const po_info = await pool.query(sql_query.query.get_po_info, values);
    res.render('./edit_particulars', {
      title: 'Edit Particulars',
      po_info: po_info.rows,
      loggedIn: req.user,
      accountType: req.user.type,
    });
  }
});

app.get('/edit_caretaker_particulars', async (req, res) => {
  if (!req.user) {
    res.redirect('/login');
  } else {
    const values = [req.user.email];
    const ct_info = await pool.query(sql_query.query.get_ct_info, values);
    res.render('./edit_caretaker_particulars', {
      title: 'Edit Particulars',
      ct_info: ct_info.rows,
      loggedIn: req.user,
      accountType: req.user.type
    });
  }
});

app.post('/edit_particulars', async (req, res) => {
  if (!req.user) {
    res.redirect('/login');
  } else {
    const pw1 = req.body.pw1;
    const pw2 = req.body.pw2;
    if (pw1 && pw2 && pw1 == pw2) {
      const name = req.body.po_name;
      const email = req.user.email;
      const location = req.body.location;
      const address = req.body.address ? req.body.address : null;
      const cc_num = req.body.cc_num ? req.body.cc_num : null;
      const cc_date = req.body.cc_date ? req.body.cc_date : null;
      const password = await bcrypt.hash(pw1, 10);
      const values = [
        email,
        name,
        password,
        location,
        address,
        cc_num,
        cc_date
      ];
      await pool.query(sql_query.query.update_po_info, values, (err, data) => {
        if (err) {
          req.flash('error', err);
          res.redirect('/edit_particulars');
        } else {
          req.flash('success_msg', 'Particulars updated!');
          res.redirect('/edit_particulars');
        }
      });
    } else if (pw1 && pw2 && pw1 != pw2) {
      res.redirect('/edit_particulars?add=fail');
    } else if (!pw1 && !pw2) {
      const name = req.body.po_name;
      const email = req.user.email;
      const location = req.body.location;
      const address = req.body.address ? req.body.address : null;
      const cc_num = req.body.cc_num;
      const cc_date = req.body.cc_date;
      var values = [email, name, location, address, cc_num, cc_date];
      await pool.query(
        sql_query.query.update_po_info_no_pw,
        values,
        (err, data) => {
          if (err) {
            req.flash('error', err);
            res.redirect('/edit_particulars');
          } else {
            req.flash('success_msg', 'Particulars updated!');
            res.redirect('/edit_particulars');
          }
        }
      );
    }
  }
});

app.post('/delete_account', async (req, res) => {
  console.log(req.user.type);
  await pool.query(req.user.type == 1 ? sql_query.query.delete_po_account : sql_query.query.delete_ct_account, [req.user.email], (err, data) => {
    if (err) {
      req.flash('error', err);
      res.redirect('/edit_particulars');
    } else {
      req.logout();
      req.flash('success_msg', "Account deleted! We're sad to see you go... :(");
      res.redirect('/login');
    }
  });
});

app.post('/delete_account', async (req, res) => {
  await pool.query(sql_query.query.delete_po_account, [req.user.email], (err, data) => {
    if (err) {
      req.flash('error', err);
      res.redirect('/edit_particulars');
    } else {
      req.logout();
      req.flash('success_msg', "Account deleted! We're sad to see you go... :(");
      res.redirect('/login');
    }
  });
});

app.post('/edit_caretaker_particulars', async (req, res) => {
  if (!req.user) {
    res.redirect('/login');
  } else {
    const pw1 = req.body.pw1;
    const pw2 = req.body.pw2;
    if (pw1 && pw2 && pw1 == pw2) {
      const name = req.body.ct_name;
      const email = req.user.email;
      const location = req.body.location;
      const address = req.body.address ? req.body.address : null;
      const bank_account = req.body.bank_account ? req.body.bank_account : null;
      const password = await bcrypt.hash(pw1, 10);
      const values = [
        email,
        name,
        password,
        location,
        address,
        bank_account
      ];
      await pool.query(sql_query.query.update_ct_info, values, (err, data) => {
        if (err) {
          req.flash('error', err);
          res.redirect('/edit_caretaker_particulars');
        } else {
          req.flash('success_msg', 'Particulars updated!');
          res.redirect('/edit_caretaker_particulars');
        }
      });
    } else if (pw1 && pw2 && pw1 != pw2) {
      res.redirect('/edit_caretaker_particulars?add=fail');
    } else if (!pw1 && !pw2) {
      const name = req.body.ct_name;
      const email = req.user.email;
      const location = req.body.location;
      const address = req.body.address ? req.body.address : null;
      const bank_account = req.body.bank_account;
      const values = [email, name, location, address, bank_account];
      await pool.query(
        sql_query.query.update_ct_info_no_pw,
        values,
        (err, data) => {
          if (err) {
            req.flash('error', err);
            res.redirect('/edit_caretaker_particulars');
          } else {
            req.flash('success_msg', 'Particulars updated!');
            res.redirect('/edit_caretaker_particulars');
          }
        }
      );
    }
  }
});

app.get('/add_pet', async (req, res) => {
  if (!req.user) {
    res.redirect('/login');
  } else {
    const pet_types = await pool.query(sql_query.query.all_pet_types);
    res.render('./add_pet', {
      title: 'Add Pets',
      pet_types: pet_types.rows,
      query: null,
      loggedIn: req.user,
      accountType: req.user.type
    });
  }
});

app.get('/add_pet/edit/:po_email/:pet_name', async (req, res) => {
  if (!req.user) {
    res.redirect('/login');
  } else {
    const po_email = req.params.po_email;
    const pet_name = req.params.pet_name;
    const values = [po_email, pet_name];
    const pet_types = await pool.query(sql_query.query.all_pet_types);
    const query = await pool.query(sql_query.query.get_pet_info, values);
    res.render('./add_pet', {
      title: 'Edit Pet Details',
      pet_types: pet_types.rows,
      query: query.rows,
      loggedIn: req.user,
      accountType: req.user.type
    });
  }
});

app.post('/add_pet/:action', async (req, res) => {
  if (!req.user) {
    res.redirect('/login');
  } else {
    const pet_name = req.body.pet_name;
    const special_req = req.body.special_req;
    const pet_type = req.body.pet_type;
    var action = req.params.action;
    const values = [pet_name, special_req, req.user.email, pet_type];
    await pool.query(sql_query.query.add_pet, values, (err, data) => {
      if (err) {
        req.flash('error', err);
        res.redirect('/add_pet'); // check this again
      } else {
        console.log(data.rows[0]);
        if (data.rows[0].add_pet == 1) {
          action = 'restor';
        }
        req.flash('success_msg', 'Pet ' + pet_name + ' is ' + action + 'ed!');
        res.redirect('/my_pets');
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
      const get_ct_info = await pool.query(
        sql_query.query.get_ct_info,
        values
      );
      const get_ct_trxns = await pool.query(
        sql_query.query.get_ct_trxn,
        values
      );
      const get_ct_prices = await pool.query(
        sql_query.query.get_ct_prices,
        values
      );
      res.render('./caretaker_profile', {
        title: 'Profile of ' + get_ct_info.rows[0].name,
        get_ct_info: get_ct_info.rows,
        get_ct_trxns: get_ct_trxns.rows,
        get_ct_prices: get_ct_prices.rows,
        loggedIn: req.user,
        accountType: req.user.type,
        statusToHuman: statusToHuman
      });
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/my_pet/:po_email/:pet_name', async (req, res) => {
  try {
    if (!req.user) {
      res.redirect('/login');
    } else {
      if (req.user.type == 1) {
        const po_email = req.params.po_email;
        const pet_name = req.params.pet_name;
        const values = [po_email, pet_name];
        const query = await pool.query(sql_query.query.get_pet_info, values);
        res.render('./my_pet_profile', {
          title: 'My Pet ' + query.rows[0].pet_name,
          query: query.rows,
          loggedIn: req.user,
          accountType: req.user.type
        });
      } else {
        req.flash('error', "You do not have access to view someone else's Pet.");
        res.redirect('/dashboard');
      }
      
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.post('/my_pets/:po_email/:pet_name', async (req, res) => {
  if (!req.user) {
    res.redirect('/login');
  } else {
    const values = [req.params.pet_name, req.params.po_email];
    await pool.query(sql_query.query.delete_pet, values, (err, data) => {
      if (err) {
        req.flash('error', 'Delete failed.');
        res.redirect('/my_pets');
      } else {
        req.flash('success_msg', req.params.pet_name + ' is deleted.');
        res.redirect('/my_pets');
      }
    });
  }
});

/*
 ** Section for YS: Register, View Transactions
 ** TODO: Change all msg to flash messages.
 */
app.get('/register', (req, res) => {
  res.render('register', {isFullTime: false});
});

const isAdmin = (req) => req.user && req.user.type === 0;

const isSuperAdmin = async (req) => {
  if (isAdmin(req)) {
    const isSuperAdminQuery = await pool.query('SELECT * FROM pcs_admin WHERE email = $1', [req.user.email]);
    return isSuperAdminQuery.rows[0].is_super_admin;
  } else {
    return false;
  }
}

app.get('/admin_register', async (req, res) => {
  if (await isSuperAdmin(req)) {
    res.render('admin_reg');
  } else {
    req.flash('error', 'Unauthorised action');
    res.redirect('/login_redirect');
  }
});

app.get('/ft_register', (req, res) => {
  if (isAdmin(req)) {
    res.render('register', {isFullTime: true});
  } else {
    req.flash('error', 'Unauthorised action');
    res.redirect('/login_redirect');
  }
});

app.post('/admin_register', async (req, res) => {
  if (await isSuperAdmin(req)) {
    let { email, name, password1 } = req.body;
    let hashedPw = await bcrypt.hash(password1, 10);
    const queryText = 'SELECT 1 FROM accounts WHERE email = $1';
    const queryValue = [email];
    //First check if user already exists
    pool
      .query(queryText, queryValue)
      .then((queryRes) => {
        if (queryRes.rows.length > 0) {
          req.flash('error', 'User already exists.');
          res.redirect('/admin_register');
        } else {
          console.log('Insert new admin into db.');
          pool
            .query(
              `INSERT INTO pcs_admin(email, name, password) VALUES($1, $2, $3)`,
              [email, name, hashedPw]
            )
            .then((result) => {
              req.flash('success_msg', 'Successfully added admin account.');
              //Change redirect to whichever page is used to add new admin account.
              res.redirect('/admin_register');
            })
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => console.error(err));
  } else {
    req.flash('error', 'Unauthorised action');
    res.redirect('/login_redirect');
  }
});

app.post('/register', async (req, res) => {
  console.log(req.body);
  let { name, email, region, password1, isFullTime, address } = req.body;

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
          //Check if address field consists of any alphabet. If not, treat as no address.
          const hasAddress = (addr) => /[a-zA-Z]/g.test(addr);
          const queryAddress = hasAddress(address) ? address : null
          const insertText =
            req.body.isFullTime === 'true'
              ? `INSERT INTO care_taker(email, name, password, location, job, address, max_concurrent_pet_limit) VALUES($1, $2, $3, $4, 'full_timer', $5, 5)`
              : req.body.type == 'pet_owner'
                ? `INSERT INTO pet_owner(email, name, password, location, address) VALUES($1, $2, $3, $4, $5)`
                : `INSERT INTO care_taker(email, name, password, location, job, address, max_concurrent_pet_limit) VALUES($1, $2, $3, $4, 'part_timer', $5, 2)`;
          createAccountQueryValues = [email, name, hashedPw, region, queryAddress]
          pool
            .query(insertText, createAccountQueryValues)
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
      'error_msg',
      'You are already logged in, please log out to login to another account.'
    );
    res.redirect('/login_redirect');
  } else {
    res.render('login');
  }
});

app.get('/login_redirect', (req, res) => {
  if (req.user) {
    if (req.user.type === 0) {
      res.redirect('/pcs-admin-dashboard');
    } else if (req.user.type === 1) {
      res.redirect('/dashboard');
    } else {
      console.log('CT');
      res.redirect('/dashboard-caretaker-ft');
    }
  } else {
    res.redirect('/login');
  }
});

//If authenticate successful, redirect to profile, it not,
//go to login page and show failure messages (in passportConfig.js)
app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/login_redirect',
    failureRedirect: '/login',
    failureFlash: true
  })
);

app.get('/logout', (req, res) => {
  if (req.user) {
    const userName = req.user.name;
    req.logout();
    req.flash('success_msg', 'Successfully logged out.');
    res.redirect('/login');
  } else {
    res.redirect('/login');
  }
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
Pushes all dates within given range into outputSet.
Function takes in 3 arguments with 1 optional argument, criteriaSet 
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
      if (!arguments[3].has(strDate)) {
        arguments[2].add(strDate);
      }
    } else {
      arguments[2].add(strDate);
    }
    dateMove.setDate(dateMove.getDate() + 1);
  }
}

/*
Sums up the counts of each date occuring.
 */
function countDatesFromRange(startDate, endDate, hashMap) {
  var startDate = startDate.toISOString();
  var endDate = endDate.toISOString();
  var dateMove = new Date(startDate);
  var strDate = startDate;

  while (strDate < endDate) {
    var strDate = dateMove.toISOString().slice(0, 10);
    if (strDate in hashMap) {
      hashMap[strDate] += 1
    } else {
      hashMap[strDate] = 1;
    }
    dateMove.setDate(dateMove.getDate() + 1);
  
  }
}


/*
Removes dates within a particular range from the set.
*/
function removeDatesFromRange(startDate, endDate, outputSet) {
  var startDate = arguments[0].toISOString();
  var endDate = arguments[1].toISOString();
  var dateMove = new Date(startDate);
  var strDate = startDate;

  while (strDate < endDate) {
    var strDate = dateMove.toISOString().slice(0, 10);
    arguments[2].delete(strDate);
    dateMove.setDate(dateMove.getDate() + 1);
  }
}

//Converts date format to DD/MM/YYYY
function convertDate(inputFormat) {
  function pad(s) {
    return s < 10 ? '0' + s : s;
  }
  var d = new Date(inputFormat);
  return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
}

//Number of days between 2 dates
const diffDays = (firstDate, secondDate) =>
  Math.round(
    Math.abs(
      (firstDate.getTime() - secondDate.getTime()) / (24 * 60 * 60 * 1000)
    )
  );


app.post('/bid', async (req, res) => {
  if (req.user) {
    const ct_email = req.body.ct_email;
    const owner_email = req.user.email;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    console.log("bid req", req.body);
    const pet_name = req.body.pet_name;
    const num_days = diffDays(new Date(start_date), new Date(end_date)) + 1;

    const ctQuery = await pool.query(
      'SELECT * FROM care_taker WHERE email = $1',
      [ct_email]
    );
    const ct_name = ctQuery.rows[0].name;
    const ct_has_address = ctQuery.rows[0].address != null;
    const petTypeQuery = await pool.query(
      sql_query.query.petTypeFromOwnerAndName,
      [owner_email, pet_name]
    );
    const pet_type = petTypeQuery.rows[0].pet_type;
    const dailyPriceQuery = await pool.query(
      sql_query.query.dailyPriceGivenTypeAndCT,
      [ct_email, pet_type]
    );
    const daily_price = dailyPriceQuery.rows[0].daily_price;
    const addrQuery = await pool.query(sql_query.query.ownerAddress, [
      owner_email
    ]);
    res.render('bid', {
      ct_name: ct_name,
      ct_email: ct_email,
      ct_has_address : ct_has_address,
      start_date: convertDate(start_date),
      end_date: convertDate(end_date),
      pet_name: pet_name,
      pet_type: pet_type,
      daily_price: daily_price,
      num_days: num_days,
      addr: addrQuery.rows[0].address,
      loggedIn: req.user,
      accountType: req.user.type
    });
  } else {
    req.flash('error', 'Please login to submit a bid for a care.');
    res.redirect('/login');
  }
});

const testAddress = (address) => /[a-zA-Z]/g.test(address);

app.post('/submit_bid', async (req, res) => {
  if (req.user) {
    const owner_email = req.user.email;
    console.log(req.body);
    //Convert DD/MM/YYYY to js Date then get difference between dates as numdays
    const num_days = diffDays(
      moment(req.body.start_date, 'DD/MM/YYYY').toDate(),
      moment(req.body.end_date, 'DD/MM/YYYY').toDate()
    ) + 1;
    //Confirm daily price
    const dailyPriceQuery = await pool.query(
      sql_query.query.dailyPriceGivenTypeAndCT,
      [req.body.ct_email, req.body.pet_type]
    );
    console.log(num_days);
    
    const address = req.body.transferMethod === 'cPickup' 
      ? req.body.address
      : req.body.transferMethod === 'oDeliver'
        ? pool.query(`SELECT address FROM care_taker WHERE email = $1`, [req.body.ct_email]).rows[0].address
        : null;

    queryValues = [
      owner_email,
      req.body.pet_name,
      req.body.ct_email,
      num_days,
      num_days * dailyPriceQuery.rows[0].daily_price,
      req.body.transferMethod,
      req.body.start_date,
      req.body.end_date,
      new Date(),
      address  
    ];

    //Add bid to hire table
    await pool.query(sql_query.query.add_bid, queryValues);
    //Add address if indicated
    if (req.body.saveAddress) {
      await pool.query('UPDATE pet_owner SET address=$1 WHERE email =$2', [
        req.body.address,
        owner_email
      ]);
    }
    req.flash('success_msg', 'Bid was successful');
    res.redirect('/dashboard');
  } else {
    req.flash('error', 'Error: User is not authenticated');
    res.redirect('/login');
  }
});

app.post('/edit_bid', async (req, res) => {
  if (req.user) {
    console.log(req.body);
    //req.body contains the primary key for that particular hire to be edited, passed in by a form from /transactions.
    const originalQueryValues = Object.values(req.body);
    const originalHireQuery = await pool.query(
      sql_query.query.get_a_hire,
      originalQueryValues
    );
    const originalHire = originalHireQuery.rows[0];
    const ct_email = originalHire.ct_email;
    const ct_Query = await pool.query(
      'SELECT * FROM care_taker WHERE email = $1',
      [ct_email]
    );
    const ct_name = ct_Query.rows[0].name;
    const ct_has_address = ct_Query.rows[0].address != null;

    //Whether ct is full time or part time
    const jobTypeQuery = await pool.query(sql_query.query.get_ct_type, [
      ct_email
    ]);
    const jobType = jobTypeQuery.rows[0].job;

    const petTypeQuery = await pool.query(
      sql_query.query.petTypeFromOwnerAndName,
      [originalHire.owner_email, originalHire.pet_name]
    );
    const petType = petTypeQuery.rows[0].pet_type;

    //Cost per day for that pet type
    const costPerDayQuery = await pool.query(
      sql_query.query.dailyPriceGivenTypeAndCT,
      [ct_email, petType]
    );
    const costPerDay = costPerDayQuery.rows[0].daily_price;

    //Dates that this ct is already booked, today or later.
    const datesCaring = await pool.query(sql_query.query.dates_caring, [
      ct_email,
      new Date()
    ]);

    //Address of pet_owner if any
    const addrQuery = await pool.query(sql_query.query.ownerAddress, [
      originalHire.owner_email
    ]);


    var datesToDelete = new Set();

    const maxConcLimit = ct_Query.rows[0].max_concurrent_pet_limit;
    var concurrentTransactions = new Object()
    //For each date, count number of occurences.
    for (var i = 0; i < datesCaring.rows.length; i++) {
      const usedDate = datesCaring.rows[i];
      countDatesFromRange(usedDate.start_date, usedDate.end_date, concurrentTransactions);
    }
    //For each date counted in hashMap concurrentTransactions, add it to datesToDelete if the count > max limit
    for (var key in concurrentTransactions) {
      if (concurrentTransactions[key] >= maxConcLimit) {
        datesToDelete.add(key);
      }
    }

    var datesToAllow = new Set();
    var isPartTimer = false;

    //Must remove the original chosen dates from blocked dates so that can still choose back original date.
    removeDatesFromRange(
      new Date(req.body.start_date),
      new Date(req.body.end_date),
      datesToDelete
    );

    //Part timer only show available dates
    if (jobType == 'part_timer') {
      const availability = await pool.query(
        sql_query.query.part_timer_availability,
        [ct_email]
      );
      isPartTimer = true;
      for (var i = 0; i < availability.rows.length; i++) {
        const canDate = availability.rows[i];
        datesFromRange(
          canDate.start_date,
          canDate.end_date,
          datesToAllow,
          datesToDelete
        );
      }

      //Full timer will disable some dates
    } else {
      const leave = await pool.query(sql_query.query.full_timer_leave, [
        ct_email
      ]);
      for (var i = 0; i < leave.rows.length; i++) {
        const leaveDate = leave.rows[i];
        datesFromRange(leaveDate.start_date, leaveDate.end_date, datesToDelete);
      }
    }
    res.render('edit_bid', {
      originalStartDate: originalHire.start_date,
      originalEndDate: originalHire.end_date,
      convertDate: convertDate,
      moment: moment,
      transferConvert: transferConvert,
      trans: originalHire,
      today: new Date().toISOString().slice(0, 10),
      isPartTimer: isPartTimer,
      //latestDate is 1 year from now for a fulltimer
      latestDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .slice(0, 10),
      blockedDates: Array.from(datesToDelete),
      availableDates: Array.from(datesToAllow),
      costPerDay: costPerDay,
      numDays: diffDays(originalHire.start_date, originalHire.end_date) + 1,
      petName: originalHire.pet_name,
      petType: petType,
      ctName: ct_name,
      ct_has_address: ct_has_address,
      addr: addrQuery.rows[0].address,
      loggedIn: req.user,
      accountType: req.user.type
    });
  } else {
    req.flash('error', 'Error: User is not authenticated');
    res.redirect('/login');
  }
});

app.post('/submit_edit', async (req, res) => {
  if (req.user) {
    const owner_email = req.user.email;
    //Delete old bid
    await pool.query(sql_query.query.delete_bid, [
      owner_email,
      req.body.ct_email,
      req.body.ori_start_date,
      req.body.ori_end_date,
      req.body.pet_name
    ]);
    const startDate =
      req.body.start_date === ''
        ? new Date(req.body.ori_start_date)
        : new Date(req.body.start_date);
    const endDate =
      req.body.end_date === ''
        ? new Date(req.body.ori_end_date)
        : new Date(req.body.end_date);
    const numDays = diffDays(startDate, endDate) + 1;
    const address = req.body.transferMethod === 'cPickup' 
      ? req.body.address
      : req.body.transferMethod === 'oDeliver'
        ? pool.query(`SELECT address FROM care_taker WHERE email = $1`, [req.body.ct_email]).rows[0].address
        : null;
    //Use pet type to server query cost per day to be sure
    const petTypeQuery = await pool.query(
      sql_query.query.petTypeFromOwnerAndName,
      [owner_email, req.body.pet_name]
    );
    const petType = petTypeQuery.rows[0].pet_type;
    //Cost per day for that pet type
    const costPerDayQuery = await pool.query(
      sql_query.query.dailyPriceGivenTypeAndCT,
      [req.body.ct_email, petType]
    );
    const costPerDay = costPerDayQuery.rows[0].daily_price;
    const totalCost = numDays * costPerDay;
    //Add date range to date range table if not exists
    await pool.query(
      'INSERT INTO date_range VALUES($1, $2) ON CONFLICT DO NOTHING',
      [startDate, endDate]
    );
    //Put in replacement bid.
    queryValues = [
      owner_email,
      req.body.pet_name,
      req.body.ct_email,
      numDays,
      totalCost,
      req.body.transferMethod,
      startDate,
      endDate,
      new Date(),
      address
    ];
    await pool.query(sql_query.query.add_bid, queryValues);
    //Add address if indicated
    if (req.body.saveAddress) {
      await pool.query('UPDATE pet_owner SET address=$1 WHERE email =$2', [
        req.body.address,
        owner_email
      ]);
    }
    req.flash('success_msg', 'Bid successfully updated.');
    res.redirect('transactions');
  } else {
    req.flash('error', 'Error: User is not authenticated');
    res.redirect('/login');
  }
});

app.post('/payment', async (req, res) => {
  if (req.user) {
    //req.body contains the primary key for that particular hire to be edited, passed in by a form from /transactions.
    const hireQueryValues = Object.values(req.body);
    const hireQuery = await pool.query(
      sql_query.query.get_a_hire,
      hireQueryValues
    );
    const hire = hireQuery.rows[0];
    const petTypeQuery = await pool.query(
      sql_query.query.petTypeFromOwnerAndName,
      [hire.owner_email, hire.pet_name]
    );
    const petType = petTypeQuery.rows[0].pet_type;
    const ct_nameQuery = await pool.query(
      'SELECT name FROM care_taker WHERE email = $1',
      [hire.ct_email]
    );
    const ct_name = ct_nameQuery.rows[0].name;
    //Cost per day for that pet type
    const costPerDayQuery = await pool.query(
      sql_query.query.dailyPriceGivenTypeAndCT,
      [req.body.ct_email, petType]
    );
    const costPerDay = costPerDayQuery.rows[0].daily_price;

    const creditCardQuery = await pool.query(
      'SELECT number FROM has_credit_card WHERE email = $1',
      [hire.owner_email]
    );
    const hasCC = creditCardQuery.rows.length === 1;
    res.render('payment', {
      startDate: hire.start_date,
      endDate: hire.end_date,
      transferConvert: transferConvert,
      convertDate: convertDate,
      data: hire,
      costPerDay: costPerDay,
      totalCost: costPerDay * diffDays(hire.start_date, hire.end_date),
      petName: hire.pet_name,
      petType: petType,
      ctName: ct_name,
      hasCC: hasCC,
      ccLast4: hasCC ? creditCardQuery.rows[0].number.slice(-4) : '',
      loggedIn: req.user,
      accountType: req.user.type
    });
  } else {
    req.flash('error', 'Error: User is not authenticated');
    res.redirect('/login');
  }
});

app.post('/submit_payment', async (req, res) => {
  if (req.user) {
    const owner_email = req.user.email;
    //Update hire_status to inProgress
    await pool.query(sql_query.query.payForBid, [
      req.body.paymentMethod,
      owner_email,
      req.body.pet_name,
      req.body.ct_email,
      new Date(req.body.start_date),
      new Date(req.body.end_date)
    ]);
    req.flash('success_msg', 'Payment successfully made!');
    res.redirect('/transactions');
  } else {
    req.flash('error', 'Error: User is not authenticated');
    res.redirect('/login');
  }
});

const statusToHuman = (status) => {
  if (status === 'inProgress') {
    return 'In Progress';
  } else if (status === 'pendingAccept') {
    return 'Pending Accept';
  } else if (status === 'rejected') {
    return 'Rejected';
  } else if (status === 'completed') {
    return 'Completed';
  } else if (status === 'cancelled') {
    return 'Cancelled';
  } else {
    return 'Pending Payment';
  }
};

app.get('/transactions', (req, res) => {
  if (req.user) {
    const userEmail = [req.user.email];
    //To accomodate for caretakers
    const allTransactions =
      req.user.type === 1
        ? sql_query.query.get_my_trxn
        : sql_query.query.get_ct_trxn;

    pool
      .query(allTransactions, userEmail)
      .then((queryRes) => {
        res.render('transactions', {
          name: req.user.name,
          resAllTrans: queryRes.rows,
          accType: req.user.type,
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
          title: 'Transactions',
          statusToHuman: statusToHuman,
          loggedIn: req.user,
          accountType: req.user.type
        });
      })
      .catch((err) => console.error(err.stack));
  } else {
    req.flash('error', 'Please login before accessing your transactions.');
    res.redirect('/login');
  }
});

app.get('/give_review/:action', async (req, res) => {
  try {
    if (!req.user) {
      res.redirect('/dashboard');
    } else {
      const account_type = req.user.type;
      if (account_type == 1) {
        const owner_email = req.query.owner_email;
        const ct_email = req.query.ct_email;
        const start_date = new Date(req.query.start_date);
        const end_date = new Date(req.query.end_date);
        const pet_name = req.query.pet_name;
        const ct_name = await pool.query(sql_query.query.get_ct_info, [ct_email]);
        var data = [];
        if (req.params.action == 'edit') {
          const query = await pool.query(
            sql_query.query.get_one_trxn,
            [owner_email, pet_name, start_date, end_date, ct_email]
          );
          const rating = query.rows[0].rating;
          const review = query.rows[0].review_text;
          data = [owner_email, ct_email, ct_name.rows[0].name, start_date, end_date, pet_name, rating, review];
        } else {
          data = [owner_email, ct_email, ct_name.rows[0].name, start_date, end_date, pet_name];
        }
        res.render('./give_review', {
          title: 'Give Review',
          data: data,
          moment: moment,
          loggedIn: true,
          today: new Date().toISOString().slice(0, 10),
          accountType: account_type,
          action: req.params.action
        });
      } else if (account_type == 2) {
        res.redirect('/dashboard-caretaker-ft');
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

app.post('/give_review/:action', async (req, res) => {
  if (!req.user) {
    res.redirect('/login');
  } else {
    const rating = req.body.rating;
    const review = req.body.review == "" ? null : req.body.review;
    const owner_email = req.user.email;
    const pet_name = req.body.pet_name;
    const start_date = moment(new Date(req.body.start_date) + 1).format('YYYY-MM-DD');
    const end_date = moment(new Date(req.body.end_date) + 1).format('YYYY-MM-DD');
    const ct_email = req.body.ct_email;
    const values = [rating, review, owner_email, pet_name, start_date, end_date, ct_email];
    await pool.query(sql_query.query.give_review, values, (err, data) => {
      if (err) {
        console.log(err);
        req.flash('error', err);
        res.redirect('/transactions');
      } else {
        req.flash('success_msg', 'Review ' + req.params.action + 'ed!');
        res.redirect('/transactions');
      }
    });
  }
});

app.post('/delete_review', async (req, res) => {
  if (!req.user) {
    res.redirect('/login');
  } else {
    const rating = null;
    const review = null;
    const owner_email = req.user.email;
    const pet_name = req.body.pet_name;
    const start_date = moment(new Date(req.body.start_date) + 1).format('YYYY-MM-DD');
    const end_date = moment(new Date(req.body.end_date) + 1).format('YYYY-MM-DD');
    const ct_email = req.body.ct_email;
    const values = [rating, review, owner_email, pet_name, start_date, end_date, ct_email];
    await pool.query(sql_query.query.give_review, values, (err, data) => {
      if (err) {
        req.flash('error', err);
        res.redirect('/transactions');
      } else {
        req.flash('success_msg', 'Review deleted!');
        res.redirect('/transactions');
      }
    });
  }
});