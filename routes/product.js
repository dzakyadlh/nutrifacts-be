var express = require('express');
var router = express.Router();
const db = require('../connection');
const { authenticateToken } = require('../middleware/verify-token');

// Rute untuk mendapatkan semua data produk
router.get('/', authenticateToken, (req, res) => {
  const query = `
      SELECT
       id,
       name,
       company,
       photoUrl,
       barcode
      FROM product
    `;
  db.query(query, (error, results, fields) => {
    if (error) {
      console.error('Error in MySQL query: ' + error.message);
      return res.status(500).json({ success: false, message: 'Error in MySQL query' });
    }
    res.json({ success: true, message: 'Product data has been successfully retrieved', product: results });
  });
});



// Route apabila tidak memasukan barcode
router.get('/barcode', authenticateToken, (req, res) => {
    return res.status(400).json({ success: false, message: 'Product barcode must be filled in. Please enter a valid barcode' });
  });

// Rute untuk mendapatkan data Nutrisi Produk berdasarkan Barcode
router.get('/barcode/:barcode', authenticateToken, (req, res) => {
  const barcode = req.params.barcode;

  const query = `SELECT * FROM product WHERE barcode = ?`;

  db.query(query, [barcode], (error, results, fields) => {
    if (error) {
      console.error('Failed to get Product data: ' + error.message);
      return res.status(500).json({ success: false, message: 'Failed to get product Nutrition data' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Product Nutrition data not found, make sure to enter the barcode code correctly' });
    } else {
      const productData = results[0];
      return res.json({ success: true, message: 'successfully retrieved product Nutrition data by barcode', product: productData });
    }
  });
});


// Route apabila tidak memasukan Name
router.get('/name', authenticateToken, (req, res) => {
    return res.status(400).json({ success: false, message: 'The product name must be filled in. Please enter a valid name' });
  });

// Route Menampilkan Produk berdasarkan Name
  router.get('/name/:name', authenticateToken, (req, res) => {
    const partialName = req.params.name;
  
    // Pilih hanya kolom yang diinginkan
    const query = `
      SELECT
       id,
       name,
       company,
       photoUrl,
       barcode
      FROM product
      WHERE name LIKE ?
    `;
  
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
            console.error('Failed to get product name : ' + recommendError.message);
            return res.status(500).json({ success: false, message: 'Failed to get product name ' });
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


// Route apabila tidak memasukan user_id pada product saved
router.get('/saved', authenticateToken, (req, res) => {
  return res.status(400).json({ success: false, message: 'Productsaved by UserID must be filled in. Please enter a valid UserId' });
});

// Rute untuk mendapatkan data productsaved berdasarkan user_id
router.get('/saved/:id', authenticateToken, (req, res) => {
  const userId = req.params.id;
  
  const query = 'SELECT * FROM productsaved WHERE user_id = ?';
  db.query(query, [userId], (error, results, fields) => {
    if (error) {
      console.error('Failed to get product saved data: ' + error.message);
      return res.status(500).json({ success: false, message: 'Failed to get Productsaved data' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Productsaved by UserID not found' });
    } else {
      return res.json({success: true, message: 'successfully retrieved Productsaved data by UserId', product: results});
    }
  });
});


// Route untuk Post Product Saved
router.post('/saved',authenticateToken, (req, res) => {
  const { name, company, photoUrl, barcode, user_id } = req.body;

  const sql = 'INSERT INTO productsaved (name, company, photoUrl, barcode, user_id) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, company, photoUrl, barcode, user_id], (err, result) => {
    if (err) {
      res.status(500).json({ success: false, message:'Failed to save Productsaved data to database' });
      throw err;
    }
    res.status(201).json({ success: true, message: 'The data Productsaved has been successfully saved' });
  });
});

// Rute untuk menghapus data productsaved berdasarkan UserId
router.delete('/saved/:id', authenticateToken, (req, res) => {
  const productsavedId = req.params.id;

  const checkUserQuery = 'SELECT * FROM productsaved WHERE user_id = ?';
  db.query(checkUserQuery, [productsavedId], (checkError, checkResults, checkFields) => {
    if (checkError) {
      console.error('Failed to get productsaved data' + checkError.message);
      return res.status(500).json({ success: false, message: 'Failed to get productsaved data' });
    }

    if (checkResults.length === 0) {
      return res.status(404).json({ success: false, message: 'productsaved data not found' });
    }

    const deleteUserQuery = 'DELETE FROM productsaved WHERE user_id = ?';
    db.query(deleteUserQuery, [productsavedId], (deleteError, deleteResults, deleteFields) => {
      if (deleteError) {
        console.error('Failed to delete productsaved data' + deleteError.message);
        return res.status(500).json({ success: false, message: 'Failed to delete productsaved data' });
      }

      return res.status(200).json({ success: true, message: 'Productsaved data has been deleted' });
    });
  });
});

module.exports = router;
