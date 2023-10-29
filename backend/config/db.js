const mysql = require('mysql');

const connectDB = () => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  connection.connect((err) => {
    if (err) {
      console.error('MySQL Database connection FAIL');
      console.error(err); // Log the error for debugging
      // Attempt to reconnect here, or handle the error as needed
      // You can use a library like "mysql2" for connection pooling and automatic reconnection.
    } else {
      console.log('MySQL Database connection SUCCESS');
    }
  });

  return connection;
};
