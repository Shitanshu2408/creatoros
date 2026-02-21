const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, paymentController.addPayment);
router.get("/monthly-revenue", authMiddleware, paymentController.getMonthlyRevenue);
router.get("/top-clients", authMiddleware, paymentController.getTopClients);
router.get("/revenue-range", authMiddleware, paymentController.getRevenueByDateRange);

module.exports = router;