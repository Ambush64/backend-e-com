const { connectDB } = require("../config/db");
const connection = connectDB();

const getProducts = (req, res) => {
  connection.query('SELECT * FROM product', (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    } else {
      res.json(results);
    }
  });
};

const getProductById = (req, res) => {
  const productId = req.params.id;
  connection.query('SELECT * FROM product WHERE id = ?', [productId], (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    } else if (results.length === 0) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.json(results[0]);
    }
  });
};

const createProduct = (req, res) => {
  const { name, description, price, imageUrl } = req.body;

  // Custom validation functions
  const isNumeric = (value) => !isNaN(parseFloat(value)) && isFinite(value);

  // Validate name
  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Name is required' });
  }

  // Validate description
  if (!description || description.trim() === '') {
    return res.status(400).json({ message: 'Description is required' });
  }

  // Validate price
  if (!price || !isNumeric(price) || price <= 0) {
    return res.status(400).json({ message: 'Invalid price' });
  }

  // Validate imageUrl (optional)
  if (imageUrl && !imageUrl.startsWith('http')) {
    return res.status(400).json({ message: 'Invalid imageUrl' });
  }

  // If all validations pass, insert the product into the database
  connection.query(
    'INSERT INTO product (name, description, price, imageUrl) VALUES (?, ?, ?, ?)',
    [name, description, price, imageUrl],
    (error, results, fields) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      } else {
        const product = {
          id: results.insertId,
          name,
          description,
          price,
          imageUrl,
        };
        res.status(201).json(product);
      }
    }
  );
};


const updateProduct = (req, res) => {
  const productId = req.params.id;
  const updateFields = req.body;

  // Custom validation functions
  const isNumeric = (value) => !isNaN(parseFloat(value)) && isFinite(value);

  // Validate productId
  if (!isNumeric(productId)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  // Validate updateFields (only if provided)
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: 'Update data is required' });
  }

  // If all validations pass, update the product in the database
  connection.query(
    'UPDATE product SET ? WHERE id = ?',
    [updateFields, productId],
    (error, results, fields) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        connection.query(
          'SELECT * FROM product WHERE id = ?',
          [productId],
          (error, selectResults, fields) => {
            if (error) {
              console.error(error);
              res.status(500).json({ message: 'Server Error' });
            } else {
              res.json(selectResults[0]);
            }
          }
        );
      }
    }
  );
};


const deleteProduct = (req, res) => {
  const productId = req.params.id;
  connection.query('DELETE FROM product WHERE id = ?', [productId], (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.json({ message: "Product deleted" });
    }
  });
};

const getProductsByKeyword = (req, res) => {
  const { keyword } = req.query;
  connection.query('SELECT * FROM product WHERE name LIKE ? OR description LIKE ?', [`%${keyword}%`, `%${keyword}%`], (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    } else {
      res.json(results);
    }
  });
};

const getProductsByPriceRange = (req, res) => {
  const { minPrice, maxPrice } = req.query;
  connection.query('SELECT * FROM product WHERE price >= ? AND price <= ?', [minPrice, maxPrice], (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    } else {
      res.json(results);
    }
  });
};

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
  getProductsByPriceRange,
  getProductsByKeyword
};
