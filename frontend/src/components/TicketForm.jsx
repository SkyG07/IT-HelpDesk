import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const TicketForm = ({ onTicketAdded }) => {
  // receive a callback to notify parent
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [department, setDepartment] = useState("");
  const [otherDepartment, setOtherDepartment] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    const finalCategory = category === "Other" ? otherCategory : category;
    const finalDepartment =
      department === "Other" ? otherDepartment : department;

    if (!finalCategory || !finalDepartment) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const res = await api.post("/tickets", {
        description,
        category: finalCategory,
        department: finalDepartment,
      });

      // Reset form
      setDescription("");
      setCategory("");
      setOtherCategory("");
      setDepartment("");
      setOtherDepartment("");

      toast.success("Ticket submitted successfully!");

      // Notify parent component (TicketList) to add this ticket to state
      if (onTicketAdded) onTicketAdded(res.data);
    } catch (err) {
      toast.error("Failed to submit ticket.");
    }
  };

  return (
    <div className="card bg-base-100 shadow mb-6">
      <div className="card-body">
        <h2 className="card-title">Submit IT Request</h2>

        <form onSubmit={submitHandler}>
          {/* Department Dropdown */}
          <select
            className="select select-bordered w-full mb-3"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Department
            </option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Engineering">Engineering</option>
            <option value="Health">Health</option>
            <option value="General">General</option>
            <option value="Other">Other</option>
          </select>

          {department === "Other" && (
            <input
              className="input input-bordered w-full mb-3"
              placeholder="Specify other department"
              value={otherDepartment}
              onChange={(e) => setOtherDepartment(e.target.value)}
              required
            />
          )}

          {/* Category Dropdown */}
          <select
            className="select select-bordered w-full mb-3"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="Printer">Printer</option>
            <option value="Network">Network</option>
            <option value="Software">Software</option>
            <option value="PC/Hardware">PC/Hardware</option>
            <option value="Other">Other</option>
          </select>

          {category === "Other" && (
            <input
              className="input input-bordered w-full mb-3"
              placeholder="Specify other category"
              value={otherCategory}
              onChange={(e) => setOtherCategory(e.target.value)}
              required
            />
          )}

          {/* Description */}
          <textarea
            className="textarea textarea-bordered w-full mb-3"
            placeholder="Describe the issue clearly..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <button className="btn btn-primary">Submit Ticket</button>
        </form>
      </div>
    </div>
  );
};

export default TicketForm;
