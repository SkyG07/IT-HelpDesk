import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState("dim"); // default light theme

  // Apply theme to HTML and save to localStorage
  useEffect(() => {
    document.querySelector("html").setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
    else {
      // Optional: auto-detect system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dim" : "pastel");
    }
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "pastel" ? "dim" : "pastel");
  };

  return (
    <div className="navbar bg-base-100 shadow mb-6">
      <div className="flex-1">
        <span className="btn btn-ghost text-lg">LGU IT Helpdesk</span>
      </div>

      <div className="flex-none gap-3 items-center">
        {/* Theme toggle button */}
        <button
          className="btn btn-ghost btn-circle"
          onClick={toggleTheme}
          title="Toggle Light/Dark Mode"
        >
          {theme === "pastel" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <div className="text-sm text-right">
          <div className="font-semibold">{user?.name}</div>
          <div className="text-xs opacity-70">{user?.role}</div>
        </div>

        <button onClick={logout} className="btn btn-outline btn-sm">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
