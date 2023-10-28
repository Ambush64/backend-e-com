const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
  getProductsByPriceRange,
  getProductsByKeyword
} = require("../controller/productControllers");

router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.post("/create", createProduct);
router.get("/search/price", getProductsByPriceRange);
router.get("/search/keyword", getProductsByKeyword);


module.exports = router;
