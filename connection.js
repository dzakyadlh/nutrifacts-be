// Koneksi ke Database MySql
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_percobaan_user',
});
connection.connect((err) => {
  if (err) {
    console.error('Koneksi MySQL gagal: ' + err.stack);
    return;
  }

  console.log('Berhasil terkoneksi ke MySQL dengan ID ' + connection.threadId);
});

module.exports = connection