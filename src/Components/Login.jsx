import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import { BASE_URL, BASE_URL1 } from "../../config";

const Login = ({ setRole }) => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        try {
            const { data } = await axios.post(`${BASE_URL}/api/auth/login`, form);

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.user.role);
            axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`; // Set token globally

            setRole(data.user.role);
            navigate("/dashboard");
        } catch (error) {
            console.error("Login error:", error);
            setError(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <form className="log-in-form" onSubmit={handleSubmit}>
            <div className="login-container">
                <input name="email" placeholder="Email" onChange={handleChange} required />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                
                {error && <p style={{ color: "red" }}>{error}</p>}
                
                <button type="submit">Login</button>
            </div>
        </form>
    );
};

export default Login;
