'use strict';

const Model = require('./../model');

function getResults(req, res) {

  process.send = process.send || () => {};
  let child = child_process.fork(__dirname + '/../model.js', req, res);

  child.on('message', function (m) {
    res.json({
      message: 'Hope you like my api!',
      queueResults: m
    });
  });

  child.send(req.query.timeInput);
}

module.exports = getResults;
