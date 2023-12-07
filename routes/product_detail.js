var express = require('express');
var router = express.Router();
const db = require('../connection');



// Route apabila tidak memasukan detail product dengan barcode
router.get('/', function(req, res) {
    res.status(404).send('Please Input Product Detail by Barcode');
  });



  // Rute untuk mendapatkan data user berdasarkan Barcode
router.get('/:barcode', (req, res) => {
    const barcode = req.params.barcode;
  
    // Query ke database untuk mendapatkan data user berdasarkan Barcode
    const query = 'SELECT * FROM product WHERE barcode = ?';
    db.query(query, [barcode], (error, results, fields) => {
      if (error) {
        console.error('Failed to get product data: ' + error.message);
        res.status(500).send('Failed to get product data');
        return;
      }
  
      if (results.length === 0) {
        res.status(404).send('Product not Found, make sure the product Barcode is correct');
        return;
      } 
      // Produk ditemukan, kirim respons dengan data produk
    res.json(results[0]);
    });
  });

  module.exports = router;

