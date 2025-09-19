const router = require("express").Router();
const {
  signup,
  login,
  getProfile,
  logout,
  deleteAddress,
  addAddress,
  updateAddress,
  checkRole,
} = require("../Controller/userController");
const { authorization } = require("../middleware/authorization");
const { getAllOrders } = require("../Controller/ordersController");
const { isAdmin } = require("../middleware/Admin");
router.post("/signup", signup);
router.post("/login", login);
router.delete("/logout", logout);
router.get("/profile", authorization, getProfile);
router.delete("/profile/address/:id", authorization, deleteAddress);
router.put("/profile/address/:id", authorization, updateAddress);

router.post("/profile/address", authorization, addAddress);
router.get("/orders", authorization, getAllOrders);

module.exports = router;
