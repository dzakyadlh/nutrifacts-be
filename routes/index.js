var express = require('express');
var router = express.Router();
const connection = require('../connection');
const bcrypt = require('bcrypt');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NutriFact' });
});

module.exports = router;
