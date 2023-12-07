var express = require('express');
var router = express.Router();
const db = require('../connection');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../middleware/verify-token');
const { authenticateToken } = require('../middleware/verify-token');


// // Route Login User
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Memeriksa apakah email dan password diinputkan
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide both email and password for login' });
  }

  const sql = 'SELECT * FROM user WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Account not Found. Make sure the email and password are correct' });
    }

    const user = results[0];

    // Memeriksa apakah password cocok
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    console.log('Input Password:', password);
    console.log('Stored Hashed Password:', user.password);
    console.log('Password Match:', isPasswordMatch);

    if (isPasswordMatch) {
      // Jika otentikasi berhasil, generate token
      const token = generateToken(user);

      return res.status(200).json({ success: true, message: 'Login Successful', userId: user.user_id, token });
    } else {
      return res.status(401).json({ success: false, message: 'Incorrect Password' });
    }
  });
});


// Route untuk signup user
router.post('/signup', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Periksa apakah email, username, dan password telah diinputkan
    if (!email || !username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email, username, and password.' });
    }

    // Periksa apakah email mengandung karakter '@'
    if (!email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Invalid email format. Please use a valid email address.' });
    }

    // Periksa apakah email sudah ada di database
    const checkEmailQuery = 'SELECT * FROM user WHERE email = ?';
    db.query(checkEmailQuery, [email], (checkEmailErr, checkEmailResult) => {
      if (checkEmailErr) {
        console.error('Error checking email:', checkEmailErr);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }

      // Jika email sudah ada, beri respons
      if (checkEmailResult.length > 0) {
        return res.status(400).json({ success: false, message: 'Email already exists. Please use a different email.' });
      }

      // Periksa panjang password
      if (password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password should be at least 8 characters long.' });
      }

      // Hash password sebelum menyimpan ke database
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Query untuk insert user baru ke database
      const insertUserQuery = 'INSERT INTO user (email, username, password) VALUES (?, ?, ?)';
      db.query(insertUserQuery, [email, username, hashedPassword], (insertErr, result) => {
        if (insertErr) {
          console.error('Error during user registration:', insertErr);
          return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }

        if (result.affectedRows > 0) {
          return res.status(200).json({ success: true, message: 'User Registered Successfully' });
        } else {
          return res.status(500).json({ success: false, message: 'Failed to Register User' });
        }
      });
    });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});



// Route get all data user
router.get('/', (req, res) => {
  const query = 'SELECT * FROM user';
  db.query(query, (error, results, fields) => {
    if (error) {
      console.error('Error in MySQL query: ' + error.message);
      res.status(500).send('Error in MySQL query');
      return;
    }
    res.json({ message: 'Success', user: req.user, data: results });
  });
});

// Rute untuk mendapatkan data user berdasarkan ID
router.get('/:id', (req, res) => {
  const userId = req.params.id;
  // Query ke database untuk mendapatkan data user berdasarkan ID
  const query = 'SELECT * FROM user WHERE user_id = ?';
  db.query(query, [userId], (error, results, fields) => {
    if (error) {
      console.error('Failed to get user data: ' + error.message);
      res.status(500).send('Failed to get user data');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('User not Found');
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
    // Hash kata sandi menggunakan bcrypt jika ada perubahan kata sandi
    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Periksa apakah pengguna sudah ada sebelum memperbarui data
    const checkUserQuery = 'SELECT * FROM user WHERE user_id = ?';
    db.query(checkUserQuery, [userId], async (checkError, checkResults, checkFields) => {
      if (checkError) {
        console.error('Failed to get user data' + checkError.message);
        res.status(500).send('Failed to get user data');
        return;
      } else if (checkResults.length === 0) {
        res.status(404).send('User not Found');
        return;
      }

      // Update data User
      const updateUserQuery = 'UPDATE user SET username = ?, email = ?, password = ? WHERE user_id = ?';
      db.query(updateUserQuery, [username, email, hashedPassword, userId], (updateError, updateResults, updateFields) => {
        if (updateError) {
          console.error('Failed to update user data' + updateError.message);
          res.status(500).send('Failed Update user data');
          return;
        }

        // Query untuk mendapatkan data user yang baru saja diperbarui
        const getUpdatedUserQuery = 'SELECT * FROM user WHERE user_id = ?';
        db.query(getUpdatedUserQuery, [userId], (getError, getResults, getFields) => {
          if (getError) {
            console.error('Failed to get updated user data' + getError.message);
            res.status(500).send('Failed to get updated user data');
            return;
          }

          const updatedUser = getResults[0];
          // Hapus kolom password sebelum mengirimkan data ke klien
          delete updatedUser.password;
          // Kirim respons dengan data user yang baru saja diperbarui
          res.status(200).json({ message: 'Update user data Successful', user: updatedUser, });
        });
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

  const checkUserQuery = 'SELECT * FROM user WHERE user_id = ?';
  db.query(checkUserQuery, [userId], (checkError, checkResults, checkFields) => {
    if (checkError) {
      console.error('Failed to get user data' + checkError.message);
      res.status(500).send('Failed to get user data');
      return;
    }

    if (checkResults.length === 0) {
      res.status(404).send('User not Found');
      return;
    }

    const deleteUserQuery = 'DELETE FROM user WHERE user_id = ?';
    db.query(deleteUserQuery, [userId], (deleteError, deleteResults, deleteFields) => {
      if (deleteError) {
        console.error('Failed to Delete user data' + deleteError.message);
        res.status(500).send('Failed to delete user data');
        return;
      }

      res.status(200).send('User data has been Deleted');
    });
  });
});

module.exports = router;
