const express = require("express");
const router = express.Router();

const clientController = require("../controllers/clientController");
const authMiddleware = require("../middleware/authMiddleware");


// ===============================
// CREATE CLIENT
// ===============================
router.post(
  "/",
  authMiddleware,
  clientController.createClient
);


// ===============================
// GET ALL CLIENTS
// ===============================
router.get(
  "/",
  authMiddleware,
  clientController.getClients
);


// ===============================
// UPDATE CLIENT  ✅ NEW
// ===============================
router.put(
  "/:id",
  authMiddleware,
  clientController.updateClient
);


// ===============================
// DELETE CLIENT  ✅ NEW
// ===============================
router.delete(
  "/:id",
  authMiddleware,
  clientController.deleteClient
);


module.exports = router;