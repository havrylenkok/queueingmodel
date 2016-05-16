'use strict';

const Model = require('./../model');

function getResults(req, res) {
  const model = new Model();
  model.p(req.body.timeInput, (results) => {
    res.json({
      message: 'Hope you like my api!',
      queueResults: results
    });
  });
}

module.exports = getResults;
