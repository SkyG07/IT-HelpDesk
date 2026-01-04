import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import toast from "react-hot-toast";
import { RefreshCw } from "lucide-react";

/* -------------------- Helpers -------------------- */
const statusBadge = (status) => {
  switch (status) {
    case "pending":
      return "badge badge-warning";
    case "in_progress":
      return "badge badge-info";
    case "resolved":
      return "badge badge-success";
    default:
      return "badge";
  }
};

/* -------------------- Component -------------------- */
const TicketList = ({ tickets = [], setTickets }) => {
  const { user } = useAuth();

  const [filteredTickets, setFilteredTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [otherDepartment, setOtherDepartment] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  /* -------------------- API -------------------- */
  const fetchTickets = async () => {
    try {
      toast.loading("Refreshing tickets...", { id: "refresh" });
      const res = await api.get("/tickets");
      setTickets(res.data);
      toast.success("Tickets refreshed", { id: "refresh" });
    } catch {
      toast.error("Failed to fetch tickets", { id: "refresh" });
    }
  };

  /* -------------------- Initial Load -------------------- */
  useEffect(() => {
    if (tickets.length === 0) fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------------------- Filter / Search / Sort -------------------- */
  useEffect(() => {
    let temp = [...tickets];

    if (departmentFilter) {
      if (departmentFilter === "Other" && otherDepartment) {
        temp = temp.filter(
          (t) =>
            t.department &&
            t.department.toLowerCase() === otherDepartment.toLowerCase()
        );
      } else if (departmentFilter !== "Other") {
        temp = temp.filter((t) => t.department === departmentFilter);
      }
    }

    if (statusFilter) {
      temp = temp.filter((t) => t.status === statusFilter);
    }

    if (search) {
      const lower = search.toLowerCase();
      temp = temp.filter(
        (t) =>
          t.category?.toLowerCase().includes(lower) ||
          t.description?.toLowerCase().includes(lower) ||
          t.createdBy?.name?.toLowerCase().includes(lower)
      );
    }

    temp.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });

    setFilteredTickets(temp);
  }, [
    tickets,
    departmentFilter,
    otherDepartment,
    statusFilter,
    search,
    sortOrder,
  ]);

  /* -------------------- Actions -------------------- */
  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/tickets/${id}/status`, { status });
      setTickets((prev = []) =>
        prev.map((t) => (t._id === id ? { ...t, status } : t))
      );
      toast.success(`Ticket marked as ${status.replace("_", " ")}`);
    } catch {
      toast.error("Failed to update ticket status");
    }
  };

  const deleteTicket = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      await api.delete(`/tickets/${id}`);
      setTickets((prev = []) => prev.filter((t) => t._id !== id));
      toast.success("Ticket deleted successfully!");
    } catch {
      toast.error("Failed to delete ticket");
    }
  };

  /* -------------------- Empty State -------------------- */
  if (!tickets || tickets.length === 0) {
    return <div className="alert alert-info">No tickets found.</div>;
  }

  /* -------------------- Render -------------------- */
  return (
    <div>
      {/* Filters + Sort */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by category, description, or name"
          className="input input-bordered input-md flex-1 min-w-[240px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="select select-bordered select-md min-w-[160px]"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="">All Departments</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Engineering">Engineering</option>
          <option value="Health">Health</option>
          <option value="General">General</option>
          <option value="Other">Other</option>
        </select>

        {departmentFilter === "Other" && (
          <input
            className="input input-bordered input-md min-w-[160px]"
            placeholder="Other department"
            value={otherDepartment}
            onChange={(e) => setOtherDepartment(e.target.value)}
          />
        )}

        <select
          className="select select-bordered select-md min-w-[150px]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          className="select select-bordered select-md min-w-[150px]"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        <button
          className="btn btn-outline btn-md flex items-center gap-2"
          onClick={fetchTickets}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Tickets Table */}
      <div className="overflow-x-auto w-full">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Department</th>
              <th>Posted By</th>
              <th>Submitted At</th>
              <th>Status</th>
              {user.role === "it_staff" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((t) => (
              <tr key={t._id}>
                <td>{t.category}</td>
                <td className="max-w-[280px] truncate" title={t.description}>
                  {t.description}
                </td>
                <td>{t.department}</td>
                <td>
                  {t.createdBy?.name}
                  <br />
                  <span className="text-xs opacity-70">
                    {t.createdBy?.email}
                  </span>
                </td>
                <td>{new Date(t.createdAt).toLocaleString()}</td>
                <td>
                  <span className={statusBadge(t.status)}>
                    {t.status.replace("_", " ")}
                  </span>
                </td>

                {user.role === "it_staff" && (
                  <td className="space-x-1">
                    {t.status !== "in_progress" && (
                      <button
                        className="btn btn-xs btn-info"
                        onClick={() => updateStatus(t._id, "in_progress")}
                      >
                        In Progress
                      </button>
                    )}
                    {t.status !== "resolved" && (
                      <button
                        className="btn btn-xs btn-success"
                        onClick={() => updateStatus(t._id, "resolved")}
                      >
                        Resolve
                      </button>
                    )}
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => deleteTicket(t._id)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketList;
