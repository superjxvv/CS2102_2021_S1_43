const fs = require('fs');
const express = require('express');
const _ = require('lodash');

const app = express();

//register view engine
app.set('view engine', 'ejs')
//Set default view directory as /views/
app.set('views')

//DB connection
const {Pool, Client} = require('pg');
//'postgressql://<username>:<password>@<hostIP>:<portNo.>/<databaseName>'
//PetCare is our schema/db name
const connectionString = 'postgressql://postgre:password@localhost:5432/PetCare'

client.connect()

//Use client.query to query.