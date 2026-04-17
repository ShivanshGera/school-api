const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection(process.env.MYSQL_URL);

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("MySQL Connected");

    // CREATE TABLE IF NOT EXISTS
    db.query(`
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        address VARCHAR(255),
        latitude FLOAT,
        longitude FLOAT
      )
    `, (err) => {
      if (err) {
        console.error("Error creating table:", err);
      } else {
        console.log("Schools table ready ✅");
      }
    });

    // INSERT DUMMY DATA (only if empty)
    db.query(`SELECT COUNT(*) AS count FROM schools`, (err, result) => {
      if (!err && result[0].count === 0) {
        db.query(`
          INSERT INTO schools (name, address, latitude, longitude)
          VALUES 
          ('ABC School', 'Delhi', 28.61, 77.23),
          ('XYZ School', 'Noida', 28.57, 77.32)
        `, (err) => {
          if (err) console.error("Insert error:", err);
          else console.log("Dummy data inserted ✅");
        });
      }
    });
  }
});

module.exports = db;