const router = require("express").Router();
const {
  createProduct,
  getProducts,
  getOneById,
  deleteOneById,
  findByIdAndUpdate,
} = require("../Controller/ProductController");
const { isAdmin } = require("../middleware/admin");
router.post("/create", isAdmin, createProduct);
router.get("/", getProducts);
router.get("/:id", getOneById);
router.delete("/:id", deleteOneById);
router.get("/:id", getOneById);
router.put("/:id", isAdmin, findByIdAndUpdate);

module.exports = router;
