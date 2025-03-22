import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = ({ setRole }) => {
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post(`${BASE_URL}/api/auth/logout`, {}, { withCredentials: true })
      .then(() => {
        setRole("");
        localStorage.removeItem("role"); // 🔹 Clear role from localStorage
        navigate("/login");
      })
      .catch((err) => {
        console.error("Logout Error:", err);
        navigate("/login");
      });
  }, [setRole, navigate]);

  return <p>Logging out...</p>;
};

export default Logout;
