var express = require('express');
var router = express.Router();
const db = require('../connection');
const { authenticateToken } = require('../middleware/verify-token');

// Rute untuk mendapatkan semua data news
router.get('/', authenticateToken, (req, res) => {
    const query = `SELECT * FROM news`;
    db.query(query, (error, results, fields) => {
      if (error) {
        console.error('Error in MySQL query: ' + error.message);
        return res.status(500).json({ success: false, message: 'Error in MySQL query' });
      }
      res.json({ success: true, message: 'News data has been successfully retrieved', news: results });
    });
  });


// Rute untuk mendapatkan news id
router.get('/:id', authenticateToken, (req, res) => {
    const id = req.params.id;
  
    // Query ke database untuk mendapatkan data produk berdasarkan id
    const query = 'SELECT * FROM news WHERE id = ?';
    db.query(query, [id], (error, results, fields) => {
      if (error) {
        console.error('Failed to get news data: ' + error.message);
        return res.status(500).json({ success: false, message: 'Failed to get news data' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: 'news data not found, make sure to enter the id code correctly' });
      }
      const newsDetail = results[0];
      return res.json({ success: true, message: 'successfully retrieved detailed news data by id', news: newsDetail });
    });
  });

  // Route untuk Post data ke News
router.post('/',authenticateToken, (req, res) => {
    const { title, photoUrl, date, description, source } = req.body;
  
    // Query untuk menyimpan data ke database
    const sql = 'INSERT INTO news (title, photoUrl, date, description, source) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [title, photoUrl, date, description, source], (err, result) => {
      if (err) {
        res.status(500).json({ success: false, message: 'Failed to save data to database' });
        throw err;
      }
      res.status(201).json({ success: true, message: 'The news data has been successfully saved' });
    });
  });

// Rute untuk menghapus data news berdasarkan Id
router.delete('/:id', authenticateToken, (req, res) => {
    const newsId = req.params.id;
  
    const checkUserQuery = 'SELECT * FROM news WHERE id = ?';
    db.query(checkUserQuery, [newsId], (checkError, checkResults, checkFields) => {
      if (checkError) {
        console.error('Failed to get news data' + checkError.message);
        return res.status(500).json({ success: false, message: 'Failed to get news data' });
      }
  
      if (checkResults.length === 0) {
        return res.status(404).json({ success: false, message: 'news data not found' });
      }
  
      const deleteUserQuery = 'DELETE FROM news WHERE id = ?';
      db.query(deleteUserQuery, [newsId], (deleteError, deleteResults, deleteFields) => {
        if (deleteError) {
          console.error('Failed to delete news data' + deleteError.message);
          return res.status(500).json({ success: false, message: 'Failed to delete news data' });
        }
  
        return res.status(200).json({ success: true, message: 'news data has been deleted' });
      });
    });
  });



module.exports = router;
