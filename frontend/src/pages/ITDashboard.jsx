import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import DashboardOverview from "../components/DashboardOverview";
import TicketList from "../components/TicketList";
import api from "../api/axios";
import toast from "react-hot-toast";

const ITDashboard = () => {
  const [tickets, setTickets] = useState([]);

  // Optional: fetch tickets on mount
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.get("/tickets");
        setTickets(res.data);
      } catch {
        toast.error("Failed to load tickets");
      }
    };
    fetchTickets();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-4">
        <DashboardOverview />
        <TicketList tickets={tickets} setTickets={setTickets} />
      </div>
    </>
  );
};

export default ITDashboard;
