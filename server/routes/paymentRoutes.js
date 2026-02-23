const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");


// CREATE
router.post("/", authMiddleware, paymentController.addPayment);

// READ ALL (NEW)
router.get("/", authMiddleware, paymentController.getPayments);

// UPDATE
router.put("/:id", authMiddleware, paymentController.updatePayment);

// DELETE
router.delete("/:id", authMiddleware, paymentController.deletePayment);


// ANALYTICS
router.get("/monthly-revenue", authMiddleware, paymentController.getMonthlyRevenue);

router.get("/top-clients", authMiddleware, paymentController.getTopClients);

router.get("/revenue-range", authMiddleware, paymentController.getRevenueByDateRange);


module.exports = router;