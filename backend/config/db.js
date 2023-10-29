const mysql = require('mysql');

function connectDB() {
  const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  };

  let connection;

  function createConnection() {
    connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
      if (err) {
        console.error('MySQL Database connection FAIL');
        console.error(err);
        reconnect();
      } else {
        console.log('MySQL Database connection SUCCESS');
        handleDisconnect(connection);
      }
    });
  }

  function reconnect() {
    setTimeout(() => {
      console.log('Reconnecting to MySQL...');
      createConnection();
    }, 5000);
  }

  createConnection();

  function handleDisconnect(db) {
    db.on('error', (err) => {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('MySQL connection lost, attempting to reconnect...');
        reconnect();
      } else {
        throw err;
      }
    });
  }

  return connection;
}

module.exports = { connectDB };
