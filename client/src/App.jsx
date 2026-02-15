/* eslint-disable react/prop-types */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Books from "./pages/Books";
import Dashboard from "./pages/Dashboard";
import AdminBooks from "./pages/AdminBooks";
import BookDetail from "./pages/BookDetail";
import Profile from "./pages/Profile";

function PrivateRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/books" />;
  }

  return children;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/books"
            element={
              <PrivateRoute>
                <Books />
              </PrivateRoute>
            }
          />
          <Route
            path="/books/:id"
            element={
              <PrivateRoute>
                <BookDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/books"
            element={
              <PrivateRoute adminOnly={true}>
                <AdminBooks />
              </PrivateRoute>
            }
          />

          {/* Redirect root to books */}
          <Route path="/" element={<Navigate to="/books" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
