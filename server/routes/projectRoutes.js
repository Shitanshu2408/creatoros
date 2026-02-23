const express = require("express");
const router = express.Router();

const projectController = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");


// ===============================
// CREATE PROJECT
// ===============================
router.post(
  "/",
  authMiddleware,
  projectController.createProject
);


// ===============================
// GET ALL PROJECTS
// ===============================
router.get(
  "/",
  authMiddleware,
  projectController.getProjects
);


// ===============================
// GET PROJECT SUMMARY (KEEP)
// ===============================
router.get(
  "/summary",
  authMiddleware,
  projectController.getProjectSummary
);


// ===============================
// UPDATE PROJECT  ✅ NEW
// ===============================
router.put(
  "/:id",
  authMiddleware,
  projectController.updateProject
);


// ===============================
// DELETE PROJECT  ✅ NEW
// ===============================
router.delete(
  "/:id",
  authMiddleware,
  projectController.deleteProject
);


module.exports = router;