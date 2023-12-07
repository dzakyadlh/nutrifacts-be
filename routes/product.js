var express = require('express');
var router = express.Router();
const db = require('../connection');

// Route Untuk Get Data Semua product
router.get('/', (req, res) => {
    const query = 'SELECT * FROM product';
    db.query(query, (error, results, fields) => {
      if (error) {
        console.error('Error in MySQL query: ' + error.message);
        res.status(500).send('Error in MySQL query');
        return;
      }
      res.json(results);
    });
});

// Route apabila tidak memasukan product dengan barcode
router.get('/barcode', function(req, res) {
  res.status(404).send('Please Input Product by Barcode');
});

// Rute untuk mendapatkan data Product berdasarkan Barcode
router.get('/barcode/:barcode', (req, res) => {
  const barcode = req.params.barcode;
  // Query ke database untuk mendapatkan data produk berdasarkan barcode
  const query = 'SELECT * FROM product WHERE barcode = ?';
  db.query(query, [barcode], (error, results, fields) => {
    if (error) {
      console.error('Failed to get product data: ' + error.message);
      res.status(500).send('Failed to get product data');
      return;
    }
    
    if (results.length === 0) {
      res.status(404).send('Product not Found, make sure the product barcode is correct');
      return;
    }

    // Produk ditemukan, kirim respons dengan data produk
    res.json(results[0]);
  });
});

// Route apabila tidak memasukan product Berdasarkan Nama
router.get('/name', function(req, res) {
  res.status(404).send('Please Input Product by Name');
});

// Rute untuk mendapatkan data pengguna berdasarkan Nama
router.get('/name/:name', (req, res) => {
  const name = req.params.name;

  const query = 'SELECT * FROM product WHERE name = ?';
  db.query(query, [name], (error, results, fields) => {
    if (error) {
      console.error('Failed to get product data: ' + error.message);
      res.status(500).send('Failed to get product data');
      return;
    }
    
    if (results.length === 0) {
      res.status(404).send('Product not Found, make sure the product name is correct');
      return; 
    }

    // Produk ditemukan, kirim respons dengan data produk
    res.json(results[0]);
  });
});



module.exports = router;
