import mongoose from "mongoose";

const ticketSchema = mongoose.Schema(
  {
    category: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "urgent"],
      default: "medium",
    },
    department: { type: String, required: true }, // NEW
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // ALREADY TRACKS WHO POSTED
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
