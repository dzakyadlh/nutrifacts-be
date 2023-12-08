var express = require('express');
var router = express.Router();
const db = require('../connection');
const { authenticateToken } = require('../middleware/verify-token');

// Route Untuk Get Data Semua product
router.get('/',authenticateToken,  (req, res) => {
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

// Route untuk mencari data produk berdasarkan Barcode atau Name
router.get('/:barcodeorname',authenticateToken,  (req, res) => {
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
      res.status(500).send('Failed to get product data');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Product not Found, make sure the product Barcode or Product Name is correct');
      return;
    }
    res.json(results);
  });
});



module.exports = router;
