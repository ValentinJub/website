'use strict'

require('dotenv').config();
const express = require('express');
const app = express();
const methodOverride = require('method-override');

const expressLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index');
const projectRouter = require('./routes/projects');
const htmlcssRouter = require('./routes/htmlandcss/index');
const d3Router = require('./routes/d3/d3');
const frontendRouter = require('./routes/frontend/frontendIndex');

/*~~~~~ Backend routes ~~~~~*/ 

const backendTimestampRouter = require('./routes/backend/timestampRoute');
const backendHeaderParserRouter = require('./routes/backend/headerParserRoute');
const backendUrlShortnerRouter = require('./routes/backend/urlShortnerRoute');
const backendExerciseTrackerRouter = require('./routes/backend/exerciseTrackerRoute');
const backendFileMetadataRouter = require('./routes/backend/fileMetadataRoute');
const backendWeatherApiRouter = require('./routes/backend/weatherApiRoute');

/*~~~~~ QA routes ~~~~~*/ 

const qaMetricRouter = require('./routes/qa/metricRoute');
const qaIssueRouter = require('./routes/qa/issueRoute');
const qaLibraryRouter = require('./routes/qa/libraryRoute');
const qaSudokuRouter = require('./routes/qa/sudokuRoute');



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
app.use(methodOverride('_method'));


//we set the public folder to the public folder
app.use(express.static('public', {
    index: false, 
    cacheControl: false,
    extensions: ['html', 'js']
}));

const fileUpload = require('express-fileupload');

// enable files upload
app.use(fileUpload({
    createParentPath: true
  }));

app.use('/', indexRouter);
app.use('/projects', projectRouter);
app.use('/projects/d3', d3Router);
app.use('/projects/htmlandcss', htmlcssRouter);
app.use('/projects/frontend', frontendRouter);

/*~~~~~ Backend routes ~~~~~*/ 

app.use('/projects/backend/timestamp', backendTimestampRouter);
app.use('/projects/backend/header-parser', backendHeaderParserRouter);
app.use('/projects/backend/url-shortner', backendUrlShortnerRouter);
app.use('/projects/backend/exercise-tracker', backendExerciseTrackerRouter);
app.use('/projects/backend/file-metadata', backendFileMetadataRouter);
app.use('/projects/backend/weather-api', backendWeatherApiRouter);

/*~~~~~ QA routes ~~~~~*/ 

app.use('/projects/qa/metric-converter', qaMetricRouter);
app.use('/projects/qa/issue-tracker/', qaIssueRouter);
app.use('/projects/qa/library/', qaLibraryRouter);
app.use('/projects/qa/sudoku/', qaSudokuRouter);


app.listen(process.env.PORT || 3000);

module.exports = app;