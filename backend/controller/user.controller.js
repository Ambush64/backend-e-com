const bcrypt = require('bcrypt');
const { sendResponseError } = require('../middleware/middleware');
const { checkPassword, newToken } = require('../utils/utility.function');
const { connectDB } = require('../config/db');
const connection = connectDB();

const signUpUser = (req, res, callback) => {
  const { email, fullName, password } = req.body;
  bcrypt.hash(password, 8, (hashError, hash) => {
    if (hashError) {
      console.error('Error: ', hashError);
      sendResponseError(500, 'Something wrong, please try again', res);
      return;
    }

    connection.query('INSERT INTO users (email, fullName, password) VALUES (?, ?, ?)', [email, fullName, hash], (insertError, results) => {
      if (insertError) {
        console.error('Error: ', insertError);
        sendResponseError(500, 'Use a different email', res);
      } else {
        res.status(201).send('Successfully account opened'); // Set the response status code
        callback(results);
      }
    });
  });
};




const signInUser = (req, res) => {
  const { password, email } = req.body;

  connection.query('SELECT * FROM users WHERE email = ?', [email], (selectError, userResults) => {
    if (selectError) {
      console.error('Error: ', selectError);
      sendResponseError(500, `Error: ${selectError}`, res);
      return;
    }

    if (userResults.length === 0) {
      sendResponseError(400, 'You have to sign up first!', res);
      return;
    }

    const user = userResults[0];
    const hashedPassword = user.password;

    bcrypt.compare(password, hashedPassword, (compareError, same) => {
      if (compareError) {
        console.error('Error: ', compareError);
        sendResponseError(500, `Error: ${compareError}`, res);
        return;
      }

      if (same) {
        let token = newToken(user);
        res.status(200).send({ status: 'ok', token });
      } else {
        sendResponseError(400, 'Invalid password!', res);
      }
    });
  });
};

const getUser = (req, res) => {
  res.status(200).send({ user: req.user });
};

module.exports = { signUpUser, signInUser, getUser };
