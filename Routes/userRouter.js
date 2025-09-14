const router = require("express").Router();
const {
  signup,
  login,
  getProfile,
  logout,
  deleteAddress,
  addAddress,
  updateAddress,
} = require("../Controller/userController");
const { checkAuthontication } = require("../middleware/authontication");
const { authorization } = require("../middleware/authorization");
const { getAllOrders } = require("../Controller/ordersController");
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", authorization, getProfile);
router.delete("/profile/address/:id", authorization, deleteAddress);
router.put("/profile/address/:id", authorization, updateAddress);

router.post("/profile/address", authorization, addAddress);
router.get("/check", checkAuthontication);
router.get("/orders", authorization, getAllOrders);

module.exports = router;
