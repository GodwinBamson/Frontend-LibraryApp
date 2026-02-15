// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { authAPI } from "../services/api";

// export default function Login() {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [debugInfo, setDebugInfo] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setDebugInfo("");

//     try {
//       setDebugInfo("Attempting to connect to server...");
//       console.log("1. Starting login process...");
//       console.log("2. Form data:", {
//         email: formData.email,
//         password: "[REDACTED]",
//       });

//       const response = await authAPI.login(formData);

//       console.log("3. Response received:", response);
//       setDebugInfo("Login successful! Redirecting...");

//       // Store token and user data
//       localStorage.setItem("token", response.data.token);
//       localStorage.setItem("user", JSON.stringify(response.data.user));

//       // Redirect based on role
//       if (response.data.user.role === "admin") {
//         navigate("/admin/books");
//       } else {
//         navigate("/books");
//       }
//     } catch (err) {
//       console.error("4. Error caught:", err);

//       let errorMessage = "Login failed";

//       if (err.code === "NETWORK_ERROR") {
//         errorMessage =
//           "Cannot connect to server. Please check if the backend is running.";
//         setDebugInfo("Network error - Check backend connection");
//       } else if (err.status === 401) {
//         errorMessage = "Invalid email or password";
//         setDebugInfo("Authentication failed - Wrong credentials");
//       } else if (err.status === 400) {
//         errorMessage = err.message || "Invalid request";
//         setDebugInfo("Bad request - Check your input");
//       } else if (err.message) {
//         errorMessage = err.message;
//         setDebugInfo(`Error: ${err.message}`);
//       }

//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Test connection function
//   const testConnection = async () => {
//     try {
//       setDebugInfo("Testing connection...");
//       const response = await fetch(
//         "https://library-server-5rpq.onrender.com/api/test",
//       );
//       const data = await response.json();
//       setDebugInfo(`✅ Server connected: ${data.message}`);
//       console.log("Test connection successful:", data);
//     } catch (error) {
//       setDebugInfo(`❌ Connection failed: ${error.message}`);
//       console.error("Test connection failed:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Sign in to your account
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Or{" "}
//             <Link
//               to="/register"
//               className="font-medium text-indigo-600 hover:text-indigo-500"
//             >
//               register as a new student
//             </Link>
//           </p>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           {error && (
//             <div className="rounded-md bg-red-50 p-4">
//               <div className="text-sm text-red-700">{error}</div>
//             </div>
//           )}

//           {debugInfo && (
//             <div className="rounded-md bg-blue-50 p-4">
//               <div className="text-sm text-blue-700">{debugInfo}</div>
//             </div>
//           )}

//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <label htmlFor="email" className="sr-only">
//                 Email address
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 required
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Email address"
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 required
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Password"
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//               />
//             </div>
//           </div>

//           <div className="flex flex-col space-y-3">
//             <button
//               type="submit"
//               disabled={loading}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
//             >
//               {loading ? "Signing in..." : "Sign in"}
//             </button>

//             <button
//               type="button"
//               onClick={testConnection}
//               className="text-sm text-indigo-600 hover:text-indigo-500"
//             >
//               Test Server Connection
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



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

      navigate(
        res.data.user.role === "admin" ? "/admin/books" : "/books",
      );
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
