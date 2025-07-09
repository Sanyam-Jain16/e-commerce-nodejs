const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  deleteUser,
  getUserById,
  updateUser,
} = require("../controllers/adminUserController");

const { admin, protect } = require("../middlewares/authMiddleware");

router.get("/", protect, admin, getAllUsers);
router.delete("/:id", protect, admin, deleteUser);
router.get("/:id", protect, admin, getUserById);
router.put("/:id", protect, admin, updateUser);

module.exports = router;
