// Mengimport library mysql
let mysql = require("mysql");

// Membuat variable connect yang isinya adalah konfigurasi connect ke database mysql
let connect = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_express_1",
});

// Membuat kondisi atau pengecekan apakah koneksi berjalan atau tidak
connect.connect((error) => {
  if (!!error) {
    console.log(error);
  } else {
    console.log("Koneksi ke database berhasil");
  }
});

// export module connect agar bisa digunakan oleh file yang lain
module.exports = connect;
