import { useEffect, useState } from "react";
import api from "../api/axios";

const DashboardOverview = () => {
  const [tickets, setTickets] = useState([]);
  const [counts, setCounts] = useState({
    pending: 0,
    in_progress: 0,
    resolved: 0,
  });

  useEffect(() => {
    const fetchTickets = async () => {
      const res = await api.get("/tickets"); // backend should populate createdBy
      setTickets(res.data);

      // Count statuses
      const pending = res.data.filter((t) => t.status === "pending").length;
      const inProgress = res.data.filter(
        (t) => t.status === "in_progress"
      ).length;
      const resolved = res.data.filter((t) => t.status === "resolved").length;

      setCounts({ pending, in_progress: inProgress, resolved });
    };
    fetchTickets();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="card bg-base-100 shadow p-4 text-center">
        <h3 className="text-lg font-semibold mb-2">Pending Tickets</h3>
        <span className="text-2xl font-bold">{counts.pending}</span>
      </div>
      <div className="card bg-base-100 shadow p-4 text-center">
        <h3 className="text-lg font-semibold mb-2">In Progress</h3>
        <span className="text-2xl font-bold">{counts.in_progress}</span>
      </div>
      <div className="card bg-base-100 shadow p-4 text-center">
        <h3 className="text-lg font-semibold mb-2">Resolved</h3>
        <span className="text-2xl font-bold">{counts.resolved}</span>
      </div>
    </div>
  );
};

export default DashboardOverview;
