import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authAPI.login(formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate(res.data.user.role === "admin" ? "/admin/books" : "/books");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-6 bg-white p-8 shadow">
        <h2 className="text-2xl font-bold text-center">Sign in</h2>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2"
          />

          <input
            type="password"
            name="password"
            required
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border px-3 py-2"
          />

          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-sm text-center">
          No account?{" "}
          <Link to="/register" className="text-indigo-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
