import Navbar from "../components/Navbar";
import TicketForm from "../components/TicketForm";
import TicketList from "../components/TicketList";
import { useState } from "react";

const EmployeeTicketsPage = () => {
  const [tickets, setTickets] = useState([]);

  return (
    <>
      <Navbar />
      <div className="p-4">
        <TicketForm
          onTicketAdded={(newTicket) =>
            setTickets((prev) => [newTicket, ...prev])
          }
        />
        <TicketList tickets={tickets} setTickets={setTickets} />
      </div>
    </>
  );
};

export default EmployeeTicketsPage;
