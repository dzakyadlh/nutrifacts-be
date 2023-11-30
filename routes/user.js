var express = require('express');
var router = express.Router();
const db = require('../connection');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

// // Route Login User
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM user WHERE username = ?';
  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Username not found' });
    }

    const user = results[0];

    // Memeriksa apakah password cocok menggunakan bcrypt
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    console.log('Input Password:', password);
    console.log('Stored Hashed Password:', user.password);
    console.log('Password Match:', isPasswordMatch);

    if (isPasswordMatch) {
      return res.status(200).json({ success: true, message: 'Login successful' });
    } else {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }
  });
});


// Route untuk signup user
router.post('/signup', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Hash password sebelum menyimpan ke database
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO user (email, username, password) VALUES (?, ?, ?)';
    db.query(sql, [email, username, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error during user registration:', err);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }

      if (result.affectedRows > 0) {
        return res.status(200).json({ success: true, message: 'User registered successfully' });
      } else {
        return res.status(500).json({ success: false, message: 'Failed to register user' });
      }
    });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


// Route Untuk Get Data Semua User
router.get('/', (req, res) => {
  const query = 'SELECT * FROM user';
  db.query(query, (error, results, fields) => {
    if (error) {
      console.error('Error dalam query MySQL: ' + error.message);
      res.status(500).send('Error dalam query MySQL');
      return;
    }

    res.json(results);
  });
});

// Rute untuk mendapatkan data pengguna berdasarkan ID
router.get('/:id', (req, res) => {
  const userId = req.params.id;

  // Query ke database untuk mendapatkan data pengguna berdasarkan ID
  const query = 'SELECT * FROM user WHERE id_user = ?';
  db.query(query, [userId], (error, results, fields) => {
    if (error) {
      console.error('Gagal mendapatkan data user: ' + error.message);
      res.status(500).send('Gagal mendapatkan data user');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('User tidak ditemukan');
    } else {
      const user = results[0];
      // Hapus kolom password sebelum mengirimkan data ke klien
      delete user.password;
      res.json(user);
    }
  });
});

// Rute untuk Update data pengguna berdasarkan ID
router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const { username, email, password } = req.body;

  try {
    // Hash password using bcrypt if there is a password change
    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    // Check if the user exists before updating data
    const checkUserQuery = 'SELECT * FROM user WHERE id_user = ?';
    db.query(checkUserQuery, [userId], async (checkError, checkResults, checkFields) => {
      if (checkError) {
        console.error('Gagal mendapatkan data user ' + checkError.message);
        res.status(500).send('Gagal mendapatkan data user');
        return;
      }
      // If the user is not found, send a 404 response
      else if (checkResults.length === 0) {
        res.status(404).send('User tidak ditemukan');
        return;
      }

      // Update user data in the database
      const updateUserQuery = 'UPDATE user SET username = ?, email = ?, password = ? WHERE id_user = ?';
      db.query(updateUserQuery, [username, email, hashedPassword, userId], (updateError, updateResults, updateFields) => {
        if (updateError) {
          console.error('Gagal Update data user ' + updateError.message);
          res.status(500).send('Gagal Update data user');
          return;
        }

        res.status(200).send('Data user berhasil di Update!');
      });
    });
  } catch (error) {
    console.error('Error in hashing password: ' + error.message);
    res.status(500).send('Error in hashing password');
  }
});

// Rute untuk menghapus data pengguna berdasarkan ID
router.delete('/:id', (req, res) => {
  const userId = req.params.id;

  // Check if the user exists before deleting data
  const checkUserQuery = 'SELECT * FROM user WHERE id_user = ?';
  db.query(checkUserQuery, [userId], (checkError, checkResults, checkFields) => {
    if (checkError) {
      console.error('Gagal mendapatkan data user ' + checkError.message);
      res.status(500).send('Gagal mendapatkan data user');
      return;
    }

    // If the user is not found, send a 404 response
    if (checkResults.length === 0) {
      res.status(404).send('User tidak ditemukan');
      return;
    }

    // Delete user data from the database
    const deleteUserQuery = 'DELETE FROM user WHERE id_user = ?';
    db.query(deleteUserQuery, [userId], (deleteError, deleteResults, deleteFields) => {
      if (deleteError) {
        console.error('Gagal Menghapus data user ' + deleteError.message);
        res.status(500).send('Gagal Menghapus data user');
        return;
      }

      res.status(200).send('Data user berhasi di hapus');
    });
  });
});

module.exports = router;
