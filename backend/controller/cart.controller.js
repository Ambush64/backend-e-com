const { sendResponseError } = require('../middleware/middleware');
const { connectDB } = require('../config/db');
const connection = connectDB();

const getCartProducts = (req, res) => {
  const userId = req.user.id;
  const getCartQuery = `
    SELECT c.*, p.* 
    FROM cart c
    LEFT JOIN product p ON c.productId = p.id
    WHERE c.userId = ?
  `;

  connection.query(getCartQuery, [userId], (error, results, fields) => {
    if (error) {
      console.error(error);
      sendResponseError(500, `Error: ${error}`, res);
    } else {
      res.status(200).send({ status: 'ok', carts: results });
    }
  });
};

const addProductInCart = (req, res) => {
  const { productId, count } = req.body;
  const userId = req.user.id;

  // Custom validation functions
  const isNumeric = (value) => !isNaN(parseFloat(value)) && isFinite(value);

  // Validate productId
  if (!productId || !isNumeric(productId)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  // Validate count
  if (!count || !isNumeric(count)) {
    return res.status(400).json({ error: 'Invalid count' });
  }

  const upsertCartQuery = `
    INSERT INTO cart (userId, productId, count)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE count = ?
  `;

  connection.query(upsertCartQuery, [userId, productId, count, count], (error, results) => {
    if (error) {
      console.error(error);
      sendResponseError(500, `Error: ${error}`, res);
    } else {
      res.status(201).send({ status: 'ok', cart: { userId, productId, count } });
    }
  });
};


const deleteProductInCart = (req, res) => {
  const cartId = req.params.id;
  const deleteCartQuery = 'DELETE FROM cart WHERE id = ?';

  connection.query(deleteCartQuery, [cartId], (error, results) => {
    if (error) {
      console.error(error);
      sendResponseError(500, `Error: ${error}`, res);
    } else {
      res.status(200).send({ status: 'ok' });
    }
  });
};

module.exports = { addProductInCart, deleteProductInCart, getCartProducts };
