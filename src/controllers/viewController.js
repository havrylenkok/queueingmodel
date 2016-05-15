'use strict';

const model = require('./../model');
const strings = require('./../commons/strings');

function renderIndex(req, res, next) {

    res.render('index', {
      title: strings.TITLE
    });

}

function renderResults(req, res, next) {
  let resultsFromModel;
  console.log(req.query.timeInput);

  model(req.query.timeInput, (results) => {
    resultsFromModel = results;
    res.render('results', {
      title: strings.TITLE,
      result: resultsFromModel
    });
  });
}

module.exports = {
  renderIndex: renderIndex,
  renderResults: renderResults
};
