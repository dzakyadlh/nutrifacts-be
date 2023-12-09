var express = require('express');
var router = express.Router();
const db = require('../connection');
const { authenticateToken } = require('../middleware/verify-token');

// Rute untuk mendapatkan semua data produk
router.get('/', authenticateToken, (req, res) => {
  const query = 'SELECT * FROM product';
  db.query(query, (error, results, fields) => {
    if (error) {
      console.error('Error in MySQL query: ' + error.message);
      return res.status(500).json({ error: 'Error in MySQL query' });
    }
    return res.json(results);
  });
});

// Route untuk mencari data produk berdasarkan Barcode atau Nama
router.get('/:barcodeorname', authenticateToken, (req, res) => {
  const barcodeorname = req.params.barcodeorname;
  const isBarcode = /^\d+$/.test(barcodeorname);

  let query;
  let queryParams;

  if (isBarcode) {
    query = 'SELECT * FROM product WHERE barcode = ?';
    queryParams = [barcodeorname];
  } else {
    query = 'SELECT * FROM product WHERE name LIKE ?';
    queryParams = [`%${barcodeorname}%`];
  }

  // Query ke database untuk mendapatkan data produk berdasarkan barcode atau nama
  db.query(query, queryParams, (error, results, fields) => {
    if (error) {
      console.error('Failed to get product data: ' + error.message);
      return res.status(500).json({ error: 'Failed to get product data' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Product not found, make sure the product Barcode or Product Name is correct' });
    }

    return res.json(results);
  });
});


// Rute untuk mendapatkan detail produk berdasarkan Barcode
router.get('/detail/:barcode',authenticateToken, (req, res) => {
  const barcode = req.params.barcode;

  // Query ke database untuk mendapatkan data produk berdasarkan Barcode
  const query = 'SELECT * FROM product WHERE barcode = ?';
  db.query(query, [barcode], (error, results, fields) => {
    if (error) {
      console.error('Failed to get product data: ' + error.message);
      return res.status(500).json({ error: 'Failed to get product data' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Product not found, make sure the product Barcode is correct' });
    }

    return res.json(results[0]);
  });
});


module.exports = router;
