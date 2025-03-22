import { useState, useEffect } from "react";
import axios from "axios";
import { FaPen, FaTrash } from "react-icons/fa";
import "../css/AdminRegister.css";
import { BASE_URL } from "../../config";

const AdminRegister = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null); // Stores the user being edited

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/auth/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error.response?.data || error.message);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingUser) {
        // Update user if in edit mode
        const token = localStorage.getItem("token");
        const res = await axios.put(
          `${BASE_URL}/api/auth/users/${editingUser._id}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUsers(users.map((user) => (user._id === editingUser._id ? res.data : user)));
        setEditingUser(null);
      } else {
        // Register new user
        const res = await axios.post(`${BASE_URL}/api/auth/register`, form);
        setUsers([...users, { ...form, _id: res.data._id }]);
      }

      setForm({ username: "", email: "", password: "", role: "user" });
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error.message);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({ username: user.username, email: user.email, password: "", role: user.role });
  };

  return (
    <div className="admin-register">
      <div className="admin-register-div">
        <h2>ADD USERS</h2>
        <form onSubmit={handleSubmit} className="admin-register-form">
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required /><br />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required /><br />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required={!editingUser} /><br />

          <select name="role" value={form.role} onChange={handleChange} required>
            <option value="user">USER</option>
            <option value="admin">ADMIN</option>
          </select>

          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">{editingUser ? "Update User" : "Register"}</button>
        </form>
      </div>

      <div className="admin-table-details">
        <h3>ALL REGISTERED USERS</h3><br />
        <table className="admin-register-table" border="1">
          <thead>
            <tr>
              <th className="admin-register-username">Username</th>
              <th className="admin-register-thead-mail">Email</th>
              <th className="admin-register-thead-role">Role</th>
              <th className="admin-register-thead-action">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="admin-register-name">{user.username}</td>
                <td className="admin-register-email">{user.email}</td>
                <td className="admin-register-role">{user.role}</td>
                <td  className="admin-register-btn">
                  <button onClick={() => handleEdit(user)}><FaPen size={15} /></button>
                  <button onClick={() => handleDelete(user._id)} style={{ marginLeft: "5px", color: "white" }}>
                    <FaTrash size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRegister;
