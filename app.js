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

  await pool.query(sql_query.query.add_pet, [name, baseDailyPrice], (err, data) => {
    if (err) {
      res.redirect('/add-pet-type?add=fail');
    } else {
      res.redirect('/pet-types?add=pass');
    }
  });
});

app.get('/edit-pet-type', async (req, res) => {
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

app.get('/pcs-admin-dashboard', async (req, res) => {
  try {
    //todo: check that user is admin
    const first4PetTypes = await pool.query(
      sql_query.query.first_4_pet_types
    );
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
          hardcode_email: 'ahymans0@printfriendly.com',
          statusToHuman : statusToHuman
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
      title: "My Pets",
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
      title: "Add Pets",
      pet_types: pet_types.rows
    })
  }
});

app.post('/add_pet', async (req, res) => {
  if (!req.user) {
    res.redirect('/login');
  } else {
    const pet_name = req.body.pet_name;
    const special_req = req.body.special_req;
    const pet_type = req.body.pet_type;
    const values = [pet_name, special_req, 'ahymans0@printfriendly.com', pet_type]; // hardcoded
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
      const get_ct_trxns = await pool.query(sql_query.query.get_ct_trxn, values);

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
  let { name, email, region, password1, type , address} = req.body;

  if (!name || !email || region === '') {
    req.flash('error', 'Please enter all fields');
    res.render('register');
  } else {
    let hashedPw = await bcrypt.hash(password1, 10);

    const queryText = 'SELECT 1 FROM accounts WHERE email = $1';
    const queryValue = [email];
    //First check if user already exists
    pool.query(queryText, queryValue)
        .then(queryRes => {
          if (queryRes.rows.length > 0) {
            req.flash("error", "User already exists.");
            res.render("register");
          } else {
            console.log("register user");
            //Not exist yet. Insert into db.
            //Check if address field consists of any alphabet. If not, treat as no address.
            const hasAddress = /[a-zA-Z]/g.test(address);
            const insertText = type == 'pet_owner'
              ? hasAddress
                ? `INSERT INTO pet_owner VALUES ($1, $2, $3, $4, $5)`
                : `INSERT INTO pet_owner(email, name, password, location) VALUES ($1, $2, $3, $4)`
              : hasAddress
                ? `INSERT INTO care_taker(email, name, password, location, job, address) VALUES($1, $2, $3, $4, 'part_timer', $5)`
                : `INSERT INTO care_taker(email, name, password, location, job) VALUES($1, $2, $3, $4, 'part_timer')`;
            createAccountQueryValues = hasAddress ? [email, name, hashedPw, region, address] : [email, name, hashedPw, region]
            pool.query(insertText, createAccountQueryValues)
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


const transferConvert = (method) => {
  if (method == 'oDeliver') {
    return "Dropoff at caretaker";
  } else if (method == 'cPickup') {
    return "Caretaker pickup";
  } else if (method == 'office') {
    return "Dropoff at Pet Care office"
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

  while (strDate < endDate){
    var strDate = dateMove.toISOString().slice(0,10);
    if (arguments[3]) {
      if (!arguments[3].has(strDate)) {
        arguments[2].add(strDate);
      }
    } else {
      arguments[2].add(strDate);
    }
    dateMove.setDate(dateMove.getDate()+1);
  };
}

/*
Removes dates within a particular range from the set.
*/
function removeDatesFromRange(startDate, endDate, outputSet) {
  var startDate = arguments[0].toISOString();
  var endDate = arguments[1].toISOString();
  var dateMove = new Date(startDate);
  var strDate = startDate;

  while (strDate < endDate){
    var strDate = dateMove.toISOString().slice(0,10);
    arguments[2].delete(strDate);
    dateMove.setDate(dateMove.getDate()+1);
  };
}

//Converts date format to DD/MM/YYYY
function convertDate(inputFormat) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(inputFormat)
  return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/')
}

//Number of days between 2 dates
const diffDays = (firstDate, secondDate) => Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (24 * 60 * 60 * 1000)));

//Jeremy (Chua) please pass in ct_name, ct_email, start_date, end_date, pet type. I will change method to post once that is done.
app.get('/bid', async (req, res) => {
  const ct_email = "bjoesbury4d@yahoo.co.jp";
  const owner_email = 'ahymans0@printfriendly.com'
  const start_date = "06-22-2021";
  const end_date = "06-30-2021";
  const pet_type = "Rabbit";
  const ct_name = "Joe";
  const num_days = diffDays(new Date(start_date), new Date(end_date));

  //Query all pet names with this type.
  const petQuery = await pool.query(sql_query.query.petFromType, [owner_email, pet_type]);
  const dailyPriceQuery = await pool.query(sql_query.query.dailyPriceGivenTypeAndCT, [ct_email, pet_type]);
  const addrQuery = await pool.query(sql_query.query.ownerAddress, [owner_email]);
  const pets = petQuery.rows;
  const daily_price = dailyPriceQuery.rows[0].daily_price
  res.render('bid', {
    ct_name : ct_name,
    pets : pets,
    ct_email : ct_email,
    start_date : convertDate(start_date),
    end_date : convertDate(end_date),
    pet_type : pet_type,
    daily_price : daily_price,
    num_days : num_days,
    addr : addrQuery.rows[0].address
  })

});
const testAddress = (address) => /[a-zA-Z]/g.test(address);

app.post('/submit_bid', async (req, res) => {
  //Change to req.user.email when available.
  const owner_email = 'ahymans0@printfriendly.com'
  console.log(req.body);
  //Convert DD/MM/YYYY to js Date then get difference between dates as numdays
  const num_days = diffDays(moment(req.body.start_date, "DD/MM/YYYY").toDate(), moment(req.body.end_date, "DD/MM/YYYY").toDate());
  //Confirm daily price
  const dailyPriceQuery = await pool.query(sql_query.query.dailyPriceGivenTypeAndCT, [req.body.ct_email, req.body.pet_type]);
  console.log(num_days);
  queryValues = [owner_email, req.body.pet_name, req.body.ct_email, 
                 num_days, num_days * dailyPriceQuery.rows[0].daily_price , req.body.transferMethod,
                 req.body.start_date, req.body.end_date, new Date()];

  //Add date range to date range table if not exists
  await pool.query("INSERT INTO date_range VALUES($1, $2) ON CONFLICT DO NOTHING", [req.body.start_date, req.body.end_date]);
  //Add bid to hire table
  await pool.query(sql_query.query.add_bid, queryValues);
  //Add address if indicated
  if (req.body.saveAddress) {
    await pool.query("UPDATE pet_owner SET address=$1 WHERE email =$2", [req.body.address , owner_email]);
  }
  req.flash("success_msg", "Bid was successful");
  res.redirect("/dashboard");
})


app.post('/edit_bid', async (req, res) => {
    console.log(req.body);
    //req.body contains the primary key for that particular hire to be edited, passed in by a form from /transactions.
    const originalQueryValues = Object.values(req.body);
    const originalHireQuery = await pool.query(sql_query.query.get_a_hire, originalQueryValues);
    const originalHire = originalHireQuery.rows[0]
    const ct_email = originalHire.ct_email;
    const ct_nameQuery = await pool.query("SELECT name FROM care_taker WHERE email = $1", [ct_email]);
    const ct_name = ct_nameQuery.rows[0].name;
    //Whether ct is full time or part time
    const jobTypeQuery = await pool.query(sql_query.query.get_ct_type, [ct_email]);
    const jobType = jobTypeQuery.rows[0].job;

    const petTypeQuery = await pool.query(sql_query.query.petTypeFromOwnerAndName, [originalHire.owner_email, originalHire.pet_name]);
    const petType = petTypeQuery.rows[0].pet_type;

    //Cost per day for that pet type
    const costPerDayQuery = await pool.query(sql_query.query.dailyPriceGivenTypeAndCT, [ct_email, petType]);
    const costPerDay = costPerDayQuery.rows[0].daily_price;

    //Dates that this ct is already booked.
    const datesCaring = await pool.query(sql_query.query.dates_caring, [ct_email]);

    //Address of pet_owner if any
    const addrQuery = await pool.query(sql_query.query.ownerAddress, [originalHire.owner_email]);

    var datesToDelete = new Set();
    for (var i = 0; i < datesCaring.rows.length; i ++) {
      const usedDate = datesCaring.rows[i];
      datesFromRange(usedDate.start_date, usedDate.end_date, datesToDelete);
    }
    var datesToAllow = new Set();
    var isPartTimer = false;
    //Part timer only show available dates
    if (jobType == 'part_timer') {
      const availability = await pool.query(sql_query.query.part_timer_availability, [ct_email]);
      isPartTimer = true;
      for (var i = 0; i < availability.rows.length; i ++) {
        const canDate = availability.rows[i];
        datesFromRange(canDate.start_date, canDate.end_date, datesToAllow, datesToDelete);
      }
    
    //Full timer will disable some dates
    } else {
      const leave = await pool.query(sql_query.query.full_timer_leave, [ct_email]); 
      for (var i = 0; i < leave.rows.length; i++) {
        const leaveDate = leave.rows[i];
        datesFromRange(leaveDate.start_date, leaveDate.end_date, datesToDelete);
      }
    }

    //Must remove the original chosen dates from blocked dates so that can still choose back original date.
    removeDatesFromRange(new Date(req.body.start_date), new Date(req.body.end_date), datesToDelete);
    res.render("edit_bid", {
      originalStartDate : originalHire.start_date,
      originalEndDate : originalHire.end_date,
      convertDate : convertDate,
      moment : moment,
      transferConvert : transferConvert, 
      trans : originalHire,
      today : new Date().toISOString().slice(0, 10),
      isPartTimer : isPartTimer,
      //latestDate is 1 year from now for a fulltimer
      latestDate : new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10),
      blockedDates : Array.from(datesToDelete),
      availableDates : Array.from(datesToAllow),
      costPerDay : costPerDay,
      numDays : diffDays(originalHire.start_date, originalHire.end_date),
      petName : originalHire.pet_name,
      petType : petType,
      ctName : ct_name,
      addr : addrQuery.rows[0].address
    });
});

app.post('/submit_edit', async (req, res) => {
  //Need to delete old bid
  console.log(req.body);
  const owner_email = 'ahymans0@printfriendly.com'; //Change to req.user.email when ready
  await pool.query(sql_query.query.delete_bid, [owner_email, req.body.ct_email, 
                                                req.body.ori_start_date, req.body.ori_end_date, 
                                                req.body.pet_name]);
  const startDate = req.body.start_date === "" ? new Date(req.body.ori_start_date) : new Date(req.body.start_date);
  const endDate = req.body.end_date === "" ? new Date(req.body.ori_end_date) : new Date(req.body.end_date);
  const numDays = diffDays(startDate, endDate);
  //Use pet type to server query cost per day to be sure
  const petTypeQuery = await pool.query(sql_query.query.petTypeFromOwnerAndName, [owner_email, req.body.pet_name]);
  const petType = petTypeQuery.rows[0].pet_type;
  //Cost per day for that pet type
  const costPerDayQuery = await pool.query(sql_query.query.dailyPriceGivenTypeAndCT, [req.body.ct_email, petType]);
  const costPerDay = costPerDayQuery.rows[0].daily_price;
  const totalCost = numDays * costPerDay;
  //Add date range to date range table if not exists
  await pool.query("INSERT INTO date_range VALUES($1, $2) ON CONFLICT DO NOTHING", [startDate, endDate]);                                             
  //Put in replacement bid.
  queryValues = [owner_email, req.body.pet_name, req.body.ct_email, 
                 numDays, totalCost, req.body.transferMethod,
                 startDate, endDate, new Date()];
  await pool.query(sql_query.query.add_bid, queryValues)
  //Add address if indicated
  if (req.body.saveAddress) {
    await pool.query("UPDATE pet_owner SET address=$1 WHERE email =$2", [req.body.address , owner_email]);
}
  req.flash("success_msg", "Bid successfully updated.");
  res.redirect('transactions');
});

app.post('/payment', async (req, res) => {
  //req.body contains the primary key for that particular hire to be edited, passed in by a form from /transactions.
  const hireQueryValues = Object.values(req.body);
  const hireQuery = await pool.query(sql_query.query.get_a_hire, hireQueryValues);
  const hire = hireQuery.rows[0];
  const petTypeQuery = await pool.query(sql_query.query.petTypeFromOwnerAndName, [hire.owner_email, hire.pet_name]);
  const petType = petTypeQuery.rows[0].pet_type;
  const ct_nameQuery = await pool.query("SELECT name FROM care_taker WHERE email = $1", [hire.ct_email]);
  const ct_name = ct_nameQuery.rows[0].name;
  //Cost per day for that pet type
  const costPerDayQuery = await pool.query(sql_query.query.dailyPriceGivenTypeAndCT, [req.body.ct_email, petType]);
  const costPerDay = costPerDayQuery.rows[0].daily_price;

  const creditCardQuery = await pool.query("SELECT number FROM has_credit_card WHERE email = $1", [hire.ct_email]);
  const hasCC = creditCardQuery.rows.length === 1;
  res.render('payment', {
    startDate : hire.start_date,
    endDate : hire.end_date,
    transferConvert : transferConvert, 
    convertDate : convertDate,
    data : hire,
    costPerDay : costPerDay,
    totalCost : costPerDay * diffDays(hire.start_date, hire.end_date),
    petName : hire.pet_name,
    petType : petType,
    ctName : ct_name,
    hasCC : hasCC,
    ccLast4 : hasCC ? creditCardQuery.rows[0].number.slice(-4) : ""
  });
});

app.post('/submit_payment', async (req, res) => {
  const owner_email = 'ahymans0@printfriendly.com'; //Change to req.user.email when ready
  //Update hire_status to inProgress
  await pool.query(sql_query.query.payForBid, [req.body.paymentMethod, owner_email, req.body.pet_name,
                                               req.body.ct_email, new Date(req.body.start_date), new Date(req.body.end_date)]);
  req.flash("success_msg", "Payment successfully made!");
  res.redirect("/transactions");
  
});

const statusToHuman = (status => {
  if (status === "inProgress") {
    return "In Progress";
  } else if (status === "pendingAccept") {
    return "Pending Accept";
  } else if (status === "rejected") {
    return "Rejected";
  } else if (status === "completed") {
    return "Completed";
  } else if (status === "cancelled") {
    return "Cancelled";
  } else {
    return "Pending Payment";
  }
})


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
            (x) => x.hire_status != 'completed' && x.hire_status != 'rejected' && x.hire_status != 'cancelled'
          ),
          resPastTrans: queryRes.rows.filter(
            (x) => x.hire_status == 'completed' || x.hire_status == 'rejected' || x.hire_status == 'cancelled'
          ),
          moment: moment,
          title: "Transactions",
          statusToHuman : statusToHuman
        });
      })
      .catch((err) => console.error(err.stack));
  } else {
    req.flash('error', 'Please login before accessing your transactions.');
    res.redirect('/login');
  }
});
