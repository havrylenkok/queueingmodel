'use strict';

const strings = require('./../commons/strings');
const child_process = require('child_process');

function renderIndex(req, res, next) {

  res.render('index', {
    title: strings.TITLE
  });
  res.end();

}

function renderResults(req, res, next) {

  process.send = process.send || () => {};
  let child = child_process.fork(__dirname + '/../model.js', req, res);

  child.on('message', function (m) {
    res.render('results', {
      title: strings.TITLE,
      result: m
    });
    res.end();
  });

  child.send(req.query.timeInput);

}

module.exports = {
  renderIndex: renderIndex,
  renderResults: renderResults
};
