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
      return res.status(500).json({ success: false, message: 'Error in MySQL query' });
    }
    res.json({ success: true, message: 'Product data has been successfully retrieved', product: results });
  });
});


// Rute untuk menambah Data produk
router.post('/', authenticateToken, (req, res) => {
  const { name, company, photoUrl, nutrition_data, nutrition_level, barcode } = req.body;

  if (!name || !company || !photoUrl || !nutrition_data || !nutrition_level || !barcode) {
    return res.status(400).json({ success: false, message: 'All fields (name, company, photoUrl, nutrition_data, nutrition_level, barcode) are required' });
  }

  const insertQuery = 'INSERT INTO product (name, company, photoUrl, nutrition_data, nutrition_level, barcode) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [name, company, photoUrl, nutrition_data, nutrition_level, barcode];

  db.query(insertQuery, values, (error, results, fields) => {
    if (error) {
      console.error('Error in MySQL query: ' + error.message);
      return res.status(500).json({ success: false, message: 'Error inserting product into the database' });
    }

    return res.json({ success: true, message: 'Product added successfully', productId: results.insertId });
  });
});


// Rute untuk mengupdate produk berdasarkan ID
router.put('/:id', authenticateToken, (req, res) => {
  const productId = req.params.id;
  const { name, company, photoUrl, nutrition_data, nutrition_level, barcode } = req.body;

  if (!productId) {
    return res.status(400).json({ success: false, message: 'Product ID is required in the URL parameter' });
  }

  // Pengecekan untuk inputan data produk
  if (!name || !company || !photoUrl || !nutrition_data || !nutrition_level || !barcode) {
    return res.status(400).json({ success: false, message: 'All fields (name, company, photoUrl, nutrition_data, nutrition_level, barcode) are required' });
  }

  const updateQuery = 'UPDATE product SET name=?, company=?, photoUrl=?, nutrition_data=?, nutrition_level=?, barcode=? WHERE id=?';
  const values = [name, company, photoUrl, nutrition_data, nutrition_level, barcode, productId];

  db.query(updateQuery, values, (error, results, fields) => {
    if (error) {
      console.error('Error in MySQL query: ' + error.message);
      return res.status(500).json({ success: false, message: 'Error updating product in the database' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.json({ success: true, message: 'Product updated successfully', productId: parseInt(productId) });
  });
});

// Rute untuk menghapus produk berdasarkan ID
router.delete('/:id', authenticateToken, (req, res) => {
  const productId = req.params.id;

  if (!productId) {
    return res.status(400).json({ success: false, message: 'Product ID is required in the URL parameter' });
  }

  const deleteQuery = 'DELETE FROM product WHERE id=?';
  const values = [productId];

  db.query(deleteQuery, values, (error, results, fields) => {
    if (error) {
      console.error('Error in MySQL query: ' + error.message);
      return res.status(500).json({ success: false, message: 'Error deleting product from the database' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.json({ success: true, message: 'Product deleted successfully', deletedProductId: parseInt(productId) });
  });
});


// Route apabila tidak memasukan barcode
router.get('/barcode', authenticateToken, (req, res) => {
    return res.status(400).json({ success: false, message: 'Product barcode must be filled in. Please enter a valid barcode' });
  });

// Rute untuk mendapatkan data Produk berdasarkan Barcode
router.get('/barcode/:barcode', authenticateToken, (req, res) => {
  const barcode = req.params.barcode;
  
  const query = 'SELECT * FROM product WHERE barcode = ?';

  db.query(query, [barcode], (error, results, fields) => {
    if (error) {
      console.error('Failed to get Product data: ' + error.message);
      return res.status(500).json({ success: false, message: 'Failed to get product data' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Product data not found, make sure to enter the barcode code correctly' });
    } else {
      const productData = results[0];
      return res.json({ success: true, message: 'successfully retrieved product data by barcode', product: productData });
    }
  });
});

// Route apabila tidak memasukan Name
router.get('/name', authenticateToken, (req, res) => {
    return res.status(400).json({ success: false, message: 'The product name must be filled in. Please enter a valid name' });
  });

// Rute untuk mendapatkan data Produk berdasarkan Name
router.get('/name/:name', authenticateToken, (req, res) => {
  const partialName = req.params.name;

  // Query ke database untuk mencari data produk berdasarkan nama yang cocok
  const query = 'SELECT * FROM product WHERE name LIKE ?';
  const partialNameWithWildcards = `%${partialName}%`;

  db.query(query, [partialNameWithWildcards], (error, results, fields) => {
    if (error) {
      console.error('Failed to get Product data: ' + error.message);
      return res.status(500).json({ success: false, message: 'Failed to get product data' });
    }

    if (results.length === 0) {
      const recommendQuery = 'SELECT DISTINCT name FROM product WHERE name LIKE ? LIMIT 5';
      db.query(recommendQuery, [`%${partialName}%`], (recommendError, recommendResults) => {
        if (recommendError) {
          console.error('Failed to get product name recommendations: ' + recommendError.message);
          return res.status(500).json({ success: false, message: 'Failed to get product name recommendations' });
        }

        const recommendedNames = recommendResults.map(result => result.name);
        return res.status(404).json({ success: false, message: 'Product data not found, Make sure to enter the product name correctly'});
      });
    } else {
      return res.json({ success: true, message: 'successfully retrieved product data by name', product: results });
    }
  });
});

// Route apabila tidak memasukan barcode pada product detail
router.get('/detail', authenticateToken, (req, res) => {
    return res.status(400).json({ success: false, message: 'Product details by barcode must be filled in. Please enter a valid barcode' });
  });

// Rute untuk mendapatkan detail produk berdasarkan Barcode
router.get('/detail/:barcode', authenticateToken, (req, res) => {
  const barcode = req.params.barcode;

  // Query ke database untuk mendapatkan data produk berdasarkan Barcode
  const query = 'SELECT * FROM product WHERE barcode = ?';
  db.query(query, [barcode], (error, results, fields) => {
    if (error) {
      console.error('Failed to get product data: ' + error.message);
      return res.status(500).json({ success: false, message: 'Failed to get product data' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Product data not found, make sure to enter the barcode code correctly' });
    }
    const productDetail = results[0];
    return res.json({ success: true, message: 'successfully retrieved detailed product data by barcode', product: productDetail });
  });
});



module.exports = router;
