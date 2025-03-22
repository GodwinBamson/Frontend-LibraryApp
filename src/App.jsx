import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard"; // Correct import
import { useState, useEffect } from "react";
import Logout from "./Components/Logout";
import axios from "axios";
import AddProduct from "./Components/AddProduct";
import Inventory from "./Components/Inventory";
import ReportPage from "./Components/ReportPage";
import AdminRegister from "./Components/AdminRegister";
import { BASE_URL, BASE_URL1 } from "../config";

function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || ""); // Load from localStorage
  const [isLoading, setIsLoading] = useState(true); // Prevents logout flash on refresh

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No token found, user logged out");
        setRole("");
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${BASE_URL}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` }, // Send token in headers
        });

        if (res.data.login) {
          setRole(res.data.role);
          localStorage.setItem("role", res.data.role);
        } else {
          setRole("");
          localStorage.removeItem("role");
        }
      } catch (error) {
        console.error("Verification failed:", error);
      } finally {
        setIsLoading(false); // API finished loading
      }
    };

    verifyUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token"); // Clear token too
    setRole("");
  };

  // Private route component for role-based access
  const PrivateRoute = ({ element, allowedRoles }) => {
    if (isLoading) return <div>Loading...</div>; // Prevent rendering before API response
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/login" />;
    }
    return element;
  };

  return (
    <BrowserRouter>
      <Navbar role={role} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setRole={(newRole) => {
          setRole(newRole);
          localStorage.setItem("role", newRole);
        }} />} />

        {/* Corrected Dashboard Route */}
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} allowedRoles={["admin", "user"]} />} />

        <Route path="/admin-register" element={<PrivateRoute element={<AdminRegister />} allowedRoles={["admin"]} />} />
        <Route path="/logout" element={<Logout setRole={handleLogout} />} />
        <Route path="/addproduct" element={<PrivateRoute element={<AddProduct />} allowedRoles={["admin"]} />} />
        <Route path="/reportpage" element={<PrivateRoute element={<ReportPage />} allowedRoles={["admin"]} />} />
        <Route path="/inventory" element={<PrivateRoute element={<Inventory />} allowedRoles={["admin", "user"]} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
