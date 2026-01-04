import Ticket from "../models/Ticket.js";

// @desc   Create ticket (Employee)
// @route  POST /api/tickets
// @access Protected
export const createTicket = async (req, res) => {
  const { category, description, department, priority } = req.body;

  if (!category || !description || !department) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const ticket = await Ticket.create({
    category,
    description,
    department,
    priority,
    createdBy: req.user._id, // link ticket to user
  });

  res.status(201).json(ticket);
};

// @desc   Get tickets (Employee sees own, IT sees all)
// @route  GET /api/tickets
// @access Protected
export const getTickets = async (req, res) => {
  let tickets;

  // IT staff sees all tickets, employees see their own
  if (req.user.role === "it_staff") {
    tickets = await Ticket.find({ deleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");
  } else {
    tickets = await Ticket.find({
      createdBy: req.user._id,
      deleted: { $ne: true },
    }).sort({ createdAt: -1 });
  }

  res.json(tickets);
};

// @desc   Update ticket status (IT only)
// @route  PATCH /api/tickets/:id/status
// @access IT Staff
export const updateTicketStatus = async (req, res) => {
  const { status } = req.body;

  const allowedStatuses = ["pending", "in_progress", "resolved"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  ticket.status = status;
  await ticket.save();

  res.json(ticket);
};

// @desc   Soft delete a ticket (IT only)
// @route  PATCH /api/tickets/:id/delete
// @access IT Staff
// @desc   Delete ticket completely (IT only)
// @route  DELETE /api/tickets/:id
// @access IT Staff
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.json({ message: "Ticket deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete ticket" });
  }
};
