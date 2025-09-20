const express = require("express");
const router = express.Router();
const { getOrdersForAdmin } = require("../Controller/ordersController");
const { authorization } = require("../middleware/authorization");
const { isAdmin } = require("../middleware/admin");
router.get("/", authorization, isAdmin, getOrdersForAdmin);

module.exports = router;
