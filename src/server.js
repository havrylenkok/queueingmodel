'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

// config to get data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.join(`${__dirname}/../`, 'public')));
app.set('views', path.join(`${__dirname}/../`, 'views'));
app.set('view engine', 'jade');

app.get('/', (req, res) => {
  require('./controllers/viewController').renderIndex(req, res);
  console.log("get!!!");
});
app.post('/', (req, res) => {
  require('./controllers/apiController')(req, res);
  console.log("post");
});
app.get('/results', (req, res) => {
  require('./controllers/viewController').renderResults(req, res);
});

app.listen(process.env.PORT || 3300);
console.log(`Server started on port ${process.env.PORT || 3300}`);
