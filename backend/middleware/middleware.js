const { connectDB } = require('../config/db');
const { verifyToken } = require('../utils/utility.function');
const connection = connectDB();

const sendResponseError = (statusCode, msg, res) => {
  res.status(statusCode || 400).send(!!msg ? msg : 'Invalid input !!');
};

const verifyUser = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    sendResponseError(400, 'You are not authorized', res);
    return;
  } else if (!authorization.startsWith('Bearer ')) {
    sendResponseError(400, 'You are not authorized', res);
    return;
  }

  const token = authorization.split(' ')[1];
  try {
    const payload = await verifyToken(token);

    if (payload) {
      const userId = payload.id;
      const userResults = await new Promise((resolve, reject) => {
        connection.query('SELECT * FROM users WHERE id = ?', [userId], (selectError, results) => {
          if (selectError) {
            reject(selectError);
          } else {
            resolve(results);
          }
        });
      });


      if (userResults.length === 0) {
        sendResponseError(400, 'You are not authorized', res);
      } else {
        const user = userResults[0];
        req['user'] = user;
        next();
      }
    } else {
      sendResponseError(400, 'You are not authorized', res);
    }
  } catch (error) {
    console.error('Error: ', error);
    sendResponseError(400, `Error: ${error}`, res);
  }
};

module.exports = {
  sendResponseError,
  verifyUser,
};
