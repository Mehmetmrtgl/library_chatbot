// src/components/Navbar.js
import { Link } from "react-router-dom";
import "./Navbar.css"; // stil dosyası istersen

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">🤖 Chat</Link>
      <Link to="/admin">🔐 Admin Giriş</Link>
      <Link to="/admin/dashboard">📊 Dashboard</Link>
    </nav>
  );
};

export default Navbar;
