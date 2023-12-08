var express = require('express');
var router = express.Router();
const db = require('../connection');
const { authenticateToken } = require('../middleware/verify-token');

// Route untuk User History
router.post('/', authenticateToken, (req, res) => {
    const { name, company, photoUrl, barcode, user_id } = req.body;
  
    // Query untuk menyimpan data ke database
    const sql = 'INSERT INTO userhistory (name, company, photoUrl, barcode, user_id) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, company, photoUrl, barcode, user_id], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Failed to save data to database' });
        throw err;
      }
      res.status(201).json({ message: 'The data History has been successfully saved' });
    });
  });
  

module.exports = router;
