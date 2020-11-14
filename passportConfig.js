const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Pool } = require('pg');
require('dotenv').config();
const bcyrpt = require('bcrypt');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', (client) => {
  client.query('SET search_path TO pet_care');
});

function initialize(passport) {
  const authenticatedUser = async (email, password, done) => {
    const accountQuery = await pool.query(`SELECT * FROM accounts WHERE email = $1`, [email]);
    if (accountQuery.rows.length === 1) {
      const user = accountQuery.rows[0];
      const isMatch = await bcyrpt.compare(password, user.password);
      console.log(user);
      if (isMatch) {
        if (user.deleted) {
          return done(null, false, { message: 'Account has been deleted. If you want to restore your account, please email us!' });
        } else {
          return done(null, user);
        }
      } else {
        return done(null, false, { message: 'Incorrect password' });
      }
    } else {
      return done(null, false, { message: 'Incorrect email' });
    }
  }



  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        return await authenticatedUser(email, password, done);
      }
    )
  );

  //Stores user email in session cookie
  passport.serializeUser((user, done) => done(null, user.email));

  //Uses email in cookie to load user
  passport.deserializeUser(async (email, done) => {
    try {
      const result = await pool.query(`SELECT * FROM accounts WHERE email = $1`,[email]);
      if (result.rows.length === 1) {
        return done(null, result.rows[0]);
      } else {
        return done("Deserialize failed: user not found", null);
      }
    } catch (err) {
      return done(err, null);
    }
  });
};

module.exports = initialize;
