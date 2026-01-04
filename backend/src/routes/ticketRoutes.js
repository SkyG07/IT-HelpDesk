import express from "express";
import {
  createTicket,
  getTickets,
  updateTicketStatus,
  deleteTicket, // ✅ import controller
} from "../controllers/ticketController.js";

import { protect, isITStaff } from "../middleware/authMiddleware.js";

const router = express.Router();

// Employee & IT
router.post("/", protect, createTicket);
router.get("/", protect, getTickets);

// IT only
router.patch("/:id/status", protect, isITStaff, updateTicketStatus);
router.delete("/:id", protect, isITStaff, deleteTicket);

export default router;
