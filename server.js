require('dotenv').config();
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index');
const projectRouter = require('./routes/projects');
const htmlcssRouter = require('./routes/htmlandcss/index');
const d3Router = require('./routes/d3/d3');

//used to parse the raw data which contains a lot of metadata 
//of the POST request to only extract the data we want
//using REQUEST.body object
const bodyParser = require('body-parser');

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//we set the view engine to ejs
app.set('view engine', 'ejs');
//we set the views directory to the views folder
app.set('views, __dirname + /views');
//we set the layout to the layout file in the layouts folder
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
//we set the public folder to the public folder
app.use(express.static('public'));

// const mongoose = require('mongoose');

/* See: https://mongoosejs.com/docs/connections.html */

// mongoose.connect(process.env.MONGO_URI).then(
//   () => {return console.log('Connected to MongoDB')},
//   err => {return console.error(err)}
// )


app.use('/', indexRouter);
app.use('/projects', projectRouter);
app.use('/projects/d3', d3Router);
app.use('/projects/htmlandcss', htmlcssRouter);

app.listen(process.env.PORT || 3000);