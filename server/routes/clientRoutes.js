const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, clientController.createClient);
router.get("/", authMiddleware, clientController.getClients);

module.exports = router;