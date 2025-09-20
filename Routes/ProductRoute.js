const router = require("express").Router();
const {
  createProduct,
  getProducts,
  getOneById,
  deleteOneById,
  findByIdAndUpdate,
} = require("../Controller/ProductController");
const { isAdmin } = require("../middleware/admin");
const { authorization } = require("../middleware/authorization");
router.post("/create", authorization, isAdmin, createProduct);
router.get("/", getProducts);
router.get("/:id", getOneById);
router.delete("/:id", deleteOneById);
router.get("/:id", getOneById);
router.put("/:id", authorization, isAdmin, findByIdAndUpdate);

module.exports = router;
