import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css";

const Navbar = ({ role, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">Product Store</Link>
      </div>
      <div className="navbar-toggle" onClick={toggleMenu}>
        <div className={`hamburger-icon ${isMenuOpen ? "open" : ""}`}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
      </div>
      <div className={`navbar-right ${isMenuOpen ? "open" : ""}`}>
        {role === "user" && <Link to="/inventory" className="navbar-link">Add Inventory</Link>}
        {role === "admin" && (
          <>
            <Link to="/addproduct" className="navbar-link">Add Product</Link>
            <Link to="/inventory" className="navbar-link">Inventory</Link>
            <Link to="/admin-register" className="navbar-link">Add Staff</Link>
            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
            <Link to="/reportpage" className="navbar-link">Report Page</Link>
          </>
        )}
        {role ? (
          <Link to="/logout" className="navbar-link" onClick={onLogout}>Logout</Link>
        ) : (
          <Link to="/login" className="navbar-link">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
