'use strict';

const Model = require('./../model');
const strings = require('./../commons/strings');

function renderIndex(req, res, next) {

  res.render('index', {
    title: strings.TITLE
  });
  res.end();

}

function renderResults(req, res, next) {
  console.log(req.query.timeInput);
  const model = new Model();

  model.p(req.query.timeInput, (results) => {

    res.render('results', {
      title: strings.TITLE,
      result: results
    });
    res.end();

  });

}

module.exports = {
  renderIndex: renderIndex,
  renderResults: renderResults
};
