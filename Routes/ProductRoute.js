const router = require("express").Router();
const {
  createProduct,
  getTopSeller,
  getOneById,
} = require("../Controller/ProductController");
router.post("/create", createProduct);
router.get("/top-seller", getTopSeller);
router.get("/:id", getOneById);

module.exports = router;
