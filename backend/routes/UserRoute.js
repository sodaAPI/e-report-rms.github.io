import express from "express";
import {
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
} from "../controllers/User.js";

import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

//CRUD
// router.get("/", verifyUser, adminOnly, getAllUsers);
// router.get("/:id", verifyUser, adminOnly, getUserById);
// router.post("/", verifyUser, adminOnly, createUser);
// router.patch("/:id", verifyUser, adminOnly, updateUser);
// router.delete("/:id", verifyUser, adminOnly, deleteUser);

router.get("/", verifyUser, adminOnly, getAllUsers);
router.get("/:id", verifyUser, adminOnly, getUserById);
router.post("/", createUser);
router.patch("/:id", verifyUser, updateUser);
router.delete("/:id", verifyUser, adminOnly, deleteUser);

export default router;
