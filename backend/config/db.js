const mysql = require('mysql');

function connectDB() {
  let connection;

  function createConnection() {
    connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    connection.connect((err) => {
      if (err) {
        console.error('MySQL Database connection FAIL');
        console.error(err); // Log the error for debugging

        // Attempt to reconnect after a delay (e.g., 5 seconds)
        setTimeout(createConnection, 5000);
      } else {
        console.log('MySQL Database connection SUCCESS');
      }
    });

    connection.on('error', (err) => {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        // Connection was lost, attempt to reconnect
        createConnection();
      } else {
        throw err;
      }
    });
  }

  createConnection();

  return connection;
}

module.exports = { connectDB };
