var express = require('express');
var router = express.Router();
const db = require('../connection');
const { authenticateToken } = require('../middleware/verify-token');

// Route untuk Post User Saved
router.post('/',authenticateToken, (req, res) => {
    const { name, company, photoUrl, barcode, user_id } = req.body;
  
    // Query untuk menyimpan data ke database
    const sql = 'INSERT INTO usersaved (name, company, photoUrl, barcode, user_id) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, company, photoUrl, barcode, user_id], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Failed to save data to database' });
        throw err;
      }
      res.status(201).json({ message: 'The data Product has been successfully saved' });
    });
  });


// Rute untuk menghapus data usersaved berdasarkan ID
router.delete('/:id', authenticateToken,(req, res) => {
    const usersavedId = req.params.id;
  
    const checkUserQuery = 'SELECT * FROM usersaved WHERE id = ?';
    db.query(checkUserQuery, [usersavedId], (checkError, checkResults, checkFields) => {
      if (checkError) {
        console.error('Failed to get user data' + checkError.message);
        res.status(500).send('Failed to get user data');
        return;
      }
  
      if (checkResults.length === 0) {
        res.status(404).send('UserSved not Found');
        return;
      }
  
      const deleteUserQuery = 'DELETE FROM usersaved WHERE id = ?';
      db.query(deleteUserQuery, [usersavedId], (deleteError, deleteResults, deleteFields) => {
        if (deleteError) {
          console.error('Failed to Delete user data' + deleteError.message);
          res.status(500).send('Failed to delete user data');
          return;
        }
  
        res.status(200).send('Data User Saved has been Deleted');
      });
    });
  });


module.exports = router;
