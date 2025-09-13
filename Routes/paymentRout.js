// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const { createPayment } = require("../Controller/paymentController");
const { authorization } = require("../middleware/authorization");
router.post("/checkout", authorization, createPayment);

module.exports = router;
