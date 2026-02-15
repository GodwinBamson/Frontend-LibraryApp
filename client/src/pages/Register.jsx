// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { authAPI } from '../services/api';

// export default function Register() {
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//         studentId: '',
//         role: 'student'
//     });
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');

//         if (formData.password !== formData.confirmPassword) {
//             setError('Passwords do not match');
//             setLoading(false);
//             return;
//         }

//         if (formData.password.length < 6) {
//             setError('Password must be at least 6 characters long');
//             setLoading(false);
//             return;
//         }

//         const registrationData = {
//             name: formData.name,
//             email: formData.email,
//             password: formData.password,
//             studentId: formData.studentId,
//             role: formData.role
//         };

//         try {
//             const response = await authAPI.register(registrationData);
//             localStorage.setItem('token', response.data.token);
//             localStorage.setItem('user', JSON.stringify(response.data.user));
            
//             // Redirect based on role
//             if (response.data.user.role === 'admin') {
//                 navigate('/admin/books');
//             } else {
//                 navigate('/books');
//             }
//         } catch (err) {
//             setError(err.response?.data?.message || 'Registration failed. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-md w-full space-y-8">
//                 <div>
//                     <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//                         Create your account
//                     </h2>
//                     <p className="mt-2 text-center text-sm text-gray-600">
//                         Or{' '}
//                         <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
//                             sign in to existing account
//                         </Link>
//                     </p>
//                 </div>
                
//                 <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//                     {error && (
//                         <div className="rounded-md bg-red-50 p-4">
//                             <div className="text-sm text-red-700">{error}</div>
//                         </div>
//                     )}
                    
//                     <div className="rounded-md shadow-sm space-y-4">
//                         <div>
//                             <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Full Name *
//                             </label>
//                             <input
//                                 id="name"
//                                 name="name"
//                                 type="text"
//                                 autoComplete="name"
//                                 required
//                                 value={formData.name}
//                                 onChange={handleChange}
//                                 className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                                 placeholder="Enter your full name"
//                             />
//                         </div>

//                         <div>
//                             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Email Address *
//                             </label>
//                             <input
//                                 id="email"
//                                 name="email"
//                                 type="email"
//                                 autoComplete="email"
//                                 required
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                                 placeholder="Enter your email address"
//                             />
//                         </div>

//                         <div>
//                             <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Student ID *
//                             </label>
//                             <input
//                                 id="studentId"
//                                 name="studentId"
//                                 type="text"
//                                 autoComplete="off"
//                                 required
//                                 value={formData.studentId}
//                                 onChange={handleChange}
//                                 className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                                 placeholder="Enter your student ID"
//                             />
//                         </div>

//                         <div className="grid grid-cols-2 gap-4">
//                             <div>
//                                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Password *
//                                 </label>
//                                 <input
//                                     id="password"
//                                     name="password"
//                                     type="password"
//                                     autoComplete="new-password"
//                                     required
//                                     value={formData.password}
//                                     onChange={handleChange}
//                                     className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                                     placeholder="Create a password"
//                                 />
//                                 <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
//                             </div>

//                             <div>
//                                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Confirm Password *
//                                 </label>
//                                 <input
//                                     id="confirmPassword"
//                                     name="confirmPassword"
//                                     type="password"
//                                     autoComplete="new-password"
//                                     required
//                                     value={formData.confirmPassword}
//                                     onChange={handleChange}
//                                     className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                                     placeholder="Confirm password"
//                                 />
//                             </div>
//                         </div>

//                         <div>
//                             <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Account Type
//                             </label>
//                             <select
//                                 id="role"
//                                 name="role"
//                                 value={formData.role}
//                                 onChange={handleChange}
//                                 className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                             >
//                                 <option value="student">Student</option>
//                                 <option value="admin">Administrator</option>
//                             </select>
//                             <p className="text-xs text-gray-500 mt-1">
//                                 {formData.role === 'admin' 
//                                     ? 'Admin accounts have full management privileges' 
//                                     : 'Student accounts can borrow and read books'}
//                             </p>
//                         </div>
//                     </div>

//                     <div className="bg-gray-50 p-4 rounded-md">
//                         <h4 className="text-sm font-medium text-gray-900 mb-2">Registration Requirements:</h4>
//                         <ul className="text-xs text-gray-600 space-y-1">
//                             <li>• Valid student ID is required for verification</li>
//                             <li>• Password must be at least 6 characters long</li>
//                             <li>• Use your institutional email if available</li>
//                             <li>• Admin accounts require special approval</li>
//                         </ul>
//                     </div>

//                     <div>
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {loading ? (
//                                 <>
//                                     <span className="absolute left-0 inset-y-0 flex items-center pl-3">
//                                         <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                     </span>
//                                     Creating Account...
//                                 </>
//                             ) : (
//                                 'Create Account'
//                             )}
//                         </button>
//                     </div>

//                     <div className="text-center">
//                         <p className="text-sm text-gray-600">
//                             By registering, you agree to our{' '}
//                             <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
//                                 Terms of Service
//                             </a>{' '}
//                             and{' '}
//                             <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
//                                 Privacy Policy
//                             </a>
//                         </p>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }






// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { authAPI } from '../services/api';

// export default function Register() {
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//         studentId: '',
//         role: 'student'
//     });
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');

//         if (formData.password !== formData.confirmPassword) {
//             setError('Passwords do not match');
//             setLoading(false);
//             return;
//         }

//         if (formData.password.length < 6) {
//             setError('Password must be at least 6 characters long');
//             setLoading(false);
//             return;
//         }

//         const registrationData = {
//             name: formData.name,
//             email: formData.email,
//             password: formData.password,
//             studentId: formData.studentId,
//             role: formData.role
//         };

//         try {
//             const response = await authAPI.register(registrationData);
//             localStorage.setItem('token', response.data.token);
//             localStorage.setItem('user', JSON.stringify(response.data.user));
            
//             if (response.data.user.role === 'admin') {
//                 navigate('/admin/books');
//             } else {
//                 navigate('/books');
//             }
//         } catch (err) {
//             setError(err.response?.data?.message || 'Registration failed. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-md w-full space-y-8">
//                 <div>
//                     <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//                         Create your account
//                     </h2>
//                     <p className="mt-2 text-center text-sm text-gray-600">
//                         Or{' '}
//                         <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
//                             sign in to existing account
//                         </Link>
//                     </p>
//                 </div>
                
//                 <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//                     {error && (
//                         <div className="rounded-md bg-red-50 p-4">
//                             <div className="text-sm text-red-700">{error}</div>
//                         </div>
//                     )}
                    
//                     <div className="rounded-md shadow-sm space-y-4">
//                         <div>
//                             <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Full Name *
//                             </label>
//                             <input
//                                 id="name"
//                                 name="name"
//                                 type="text"
//                                 autoComplete="name"
//                                 required
//                                 value={formData.name}
//                                 onChange={handleChange}
//                                 className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                                 placeholder="Enter your full name"
//                             />
//                         </div>

//                         <div>
//                             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Email Address *
//                             </label>
//                             <input
//                                 id="email"
//                                 name="email"
//                                 type="email"
//                                 autoComplete="email"
//                                 required
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                                 placeholder="Enter your email address"
//                             />
//                         </div>

//                         <div>
//                             <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Student ID *
//                             </label>
//                             <input
//                                 id="studentId"
//                                 name="studentId"
//                                 type="text"
//                                 autoComplete="off"
//                                 required
//                                 value={formData.studentId}
//                                 onChange={handleChange}
//                                 className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                                 placeholder="Enter your student ID"
//                             />
//                         </div>

//                         <div className="grid grid-cols-2 gap-4">
//                             <div>
//                                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Password *
//                                 </label>
//                                 <input
//                                     id="password"
//                                     name="password"
//                                     type="password"
//                                     autoComplete="new-password"
//                                     required
//                                     value={formData.password}
//                                     onChange={handleChange}
//                                     className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                                     placeholder="Create a password"
//                                 />
//                                 <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
//                             </div>

//                             <div>
//                                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                                     Confirm Password *
//                                 </label>
//                                 <input
//                                     id="confirmPassword"
//                                     name="confirmPassword"
//                                     type="password"
//                                     autoComplete="new-password"
//                                     required
//                                     value={formData.confirmPassword}
//                                     onChange={handleChange}
//                                     className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                                     placeholder="Confirm password"
//                                 />
//                             </div>
//                         </div>

//                         <div>
//                             <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Account Type
//                             </label>
//                             <select
//                                 id="role"
//                                 name="role"
//                                 value={formData.role}
//                                 onChange={handleChange}
//                                 className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                             >
//                                 <option value="student">Student</option>
//                                 <option value="admin">Administrator</option>
//                             </select>
//                             <p className="text-xs text-gray-500 mt-1">
//                                 {formData.role === 'admin' 
//                                     ? 'Admin accounts have full management privileges' 
//                                     : 'Student accounts can borrow and read books'}
//                             </p>
//                         </div>
//                     </div>

//                     <div className="bg-gray-50 p-4 rounded-md">
//                         <h4 className="text-sm font-medium text-gray-900 mb-2">Registration Requirements:</h4>
//                         <ul className="text-xs text-gray-600 space-y-1">
//                             <li>• Valid student ID is required for verification</li>
//                             <li>• Password must be at least 6 characters long</li>
//                             <li>• Use your institutional email if available</li>
//                             <li>• Admin accounts require special approval</li>
//                         </ul>
//                     </div>

//                     <div>
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {loading ? (
//                                 <>
//                                     <span className="absolute left-0 inset-y-0 flex items-center pl-3">
//                                         <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                     </span>
//                                     Creating Account...
//                                 </>
//                             ) : (
//                                 'Create Account'
//                             )}
//                         </button>
//                     </div>

//                     <div className="text-center">
//                         <p className="text-sm text-gray-600">
//                             By registering, you agree to our{' '}
//                             <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
//                                 Terms of Service
//                             </a>{' '}
//                             and{' '}
//                             <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
//                                 Privacy Policy
//                             </a>
//                         </p>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }





import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        studentId: "",
        role: "student",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [debugInfo, setDebugInfo] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }
        
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return false;
        }
        
        if (!formData.name.trim()) {
            setError("Name is required");
            return false;
        }
        
        if (!formData.studentId.trim()) {
            setError("Student ID is required");
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address");
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setDebugInfo("");
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);

        try {
            setDebugInfo("Creating your account...");
            console.log('1. Starting registration process...');
            
            const response = await authAPI.register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                studentId: formData.studentId,
                role: formData.role,
            });

            console.log('2. Registration response:', response);
            setDebugInfo("Account created! Redirecting...");

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            if (response.data.user.role === "admin") {
                navigate("/admin/books");
            } else {
                navigate("/books");
            }
        } catch (err) {
            console.error('3. Registration error:', err);
            
            let errorMessage = "Registration failed";
            
            if (err.code === 'NETWORK_ERROR') {
                errorMessage = "Cannot connect to server. Please check your internet connection.";
                setDebugInfo("Network error - Check backend connection");
            } else if (err.status === 400) {
                errorMessage = err.message || "Invalid registration data";
                setDebugInfo("Validation error - Check your input");
            } else if (err.status === 409) {
                errorMessage = "User with this email or student ID already exists";
                setDebugInfo("User already exists");
            } else if (err.message) {
                errorMessage = err.message;
                setDebugInfo(`Error: ${err.message}`);
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{" "}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            sign in to existing account
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="text-sm text-red-700">{error}</div>
                        </div>
                    )}

                    {debugInfo && (
                        <div className="rounded-md bg-blue-50 p-4">
                            <div className="text-sm text-blue-700">{debugInfo}</div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name *
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                                Student ID *
                            </label>
                            <input
                                id="studentId"
                                type="text"
                                name="studentId"
                                required
                                value={formData.studentId}
                                onChange={handleChange}
                                placeholder="Enter student ID"
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password *
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password *
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm password"
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}