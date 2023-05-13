require('dotenv').config();
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');

//used to parse the raw data which contains a lot of metadata 
//of the POST request to only extract the data we want
//using REQUEST.body object
const bodyParser = require('body-parser');
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mongoose = require('mongoose');

/* See: https://mongoosejs.com/docs/connections.html */

mongoose.connect(process.env.MONGO_URI).then(
  () => {return console.log('Connected to MongoDB')},
  err => {return console.error(err)}
)

app.set('view engine', 'ejs');
app.set('views, __dirname + /views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/users', userRouter);

app.listen(process.env.PORT || 3000);