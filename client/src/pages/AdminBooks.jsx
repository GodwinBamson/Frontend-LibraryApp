// /* eslint-disable no-unused-vars */

// import { useState, useEffect } from "react";
// import { bookAPI } from "../services/api";
// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
// import {
//   PlusIcon,
//   PencilIcon,
//   TrashIcon,
//   DownloadIcon,
// } from "../components/Icons";

// export default function AdminBooks() {
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [editingBook, setEditingBook] = useState(null);
//   const [formData, setFormData] = useState({
//     title: "",
//     author: "",
//     isbn: "",
//     description: "",
//     category: "",
//     publishedYear: new Date().getFullYear(),
//     publisher: "",
//     totalCopies: 1,
//     pdfFile: null,
//     coverImage: "",
//   });
//   const [uploading, setUploading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");

//   const categories = [
//     "Fiction",
//     "Non-Fiction",
//     "Science",
//     "Technology",
//     "History",
//     "Biography",
//     "Education",
//     "Religion",
//     "Art",
//     "Business",
//   ];

//   useEffect(() => {
//     fetchBooks();
//   }, []);

//   const fetchBooks = async () => {
//     try {
//       setLoading(true);
//       const response = await bookAPI.getAllBooks();
//       setBooks(response.data);
//     } catch (error) {
//       console.error("Error fetching books:", error);
//       alert("Failed to fetch books. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "pdfFile" && files) {
//       const file = files[0];
//       if (file) {
//         if (file.type !== "application/pdf") {
//           alert("Please select a PDF file");
//           e.target.value = "";
//           setFormData({ ...formData, pdfFile: null });
//           return;
//         }
//         if (file.size > 50 * 1024 * 1024) {
//           alert("File size must be less than 50MB");
//           e.target.value = "";
//           setFormData({ ...formData, pdfFile: null });
//           return;
//         }
//         setFormData({ ...formData, pdfFile: file });
//       } else {
//         setFormData({ ...formData, pdfFile: null });
//       }
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate required fields
//     if (
//       !formData.title ||
//       !formData.author ||
//       !formData.isbn ||
//       !formData.category ||
//       !formData.description
//     ) {
//       alert("Please fill in all required fields");
//       return;
//     }

//     try {
//       setUploading(true);

//       // Create FormData object
//       const formDataToSend = new FormData();

//       // Append all text fields
//       formDataToSend.append("title", formData.title.trim());
//       formDataToSend.append("author", formData.author.trim());
//       formDataToSend.append("isbn", formData.isbn.trim());
//       formDataToSend.append("description", formData.description.trim());
//       formDataToSend.append("category", formData.category);
//       formDataToSend.append("publishedYear", formData.publishedYear.toString());
//       formDataToSend.append("publisher", formData.publisher?.trim() || "");
//       formDataToSend.append("totalCopies", formData.totalCopies.toString());
//       formDataToSend.append("coverImage", formData.coverImage?.trim() || "");

//       // Append PDF file if selected
//       if (formData.pdfFile instanceof File) {
//         formDataToSend.append("pdfFile", formData.pdfFile);
//         console.log("📎 Appending PDF file:", formData.pdfFile.name);
//       }

//       // Log FormData contents for debugging
//       console.log(" Submitting form data:");
//       for (let pair of formDataToSend.entries()) {
//         console.log(
//           pair[0] + ": " + (pair[0] === "pdfFile" ? pair[1].name : pair[1]),
//         );
//       }

//       // Make API call using bookAPI service
//       let response;
//       if (editingBook) {
//         console.log("✏️ Updating book:", editingBook._id);
//         response = await bookAPI.updateBook(editingBook._id, formDataToSend);
//       } else {
//         console.log("➕ Creating new book");
//         response = await bookAPI.createBook(formDataToSend);
//       }

//       console.log(" Book saved successfully:", response.data);
//       alert(` Book ${editingBook ? "updated" : "added"} successfully!`);

//       // Reset form and refresh books
//       resetForm();
//       await fetchBooks();
//     } catch (error) {
//       console.error(" Error saving book:", error);

//       // Handle different error types
//       let errorMessage = "Operation failed";
//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.message) {
//         errorMessage = error.message;
//       }

//       alert(` ${errorMessage}`);
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Update handlePdfView function
//   const handlePdfView = (book) => {
//     if (!book || !book.pdfFile) {
//       alert("No PDF available for this book");
//       return;
//     }

//     // Get the API URL
//     const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

//     // Use the backend endpoint directly
//     const pdfUrl = `${API_URL}/books/pdf/${book._id}`;

//     // Open in new tab - browser will handle the request
//     window.open(pdfUrl, "_blank");
//   };

//   // Add this function for downloading
//   const handleDownloadPdf = async (book) => {
//     if (!book || !book.pdfFile) {
//       alert("No PDF available to download");
//       return;
//     }

//     try {
//       let pdfUrl = book.pdfFile;
//       let filename =
//         book.pdfFilename || `${book.title.replace(/\s+/g, "_")}.pdf`;

//       // For Cloudinary URLs
//       if (book.pdfFile.includes("cloudinary")) {
//         // Remove version parameter
//         pdfUrl = pdfUrl.replace(/\/v\d+\//, "/");

//         // Add timestamp to prevent caching
//         const separator = pdfUrl.includes("?") ? "&" : "?";
//         pdfUrl = `${pdfUrl}${separator}_t=${Date.now()}`;
//       }
//       // For local development
//       else {
//         const API_URL =
//           import.meta.env.VITE_API_URL || "http://localhost:5000/api";
//         pdfUrl = `${API_URL}/books/pdf/${book._id}?_t=${Date.now()}`;
//       }

//       // Create download link
//       const link = document.createElement("a");
//       link.href = pdfUrl;
//       link.download = filename;
//       link.target = "_blank";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error("Error downloading PDF:", error);
//       alert("Failed to download PDF. Please try again.");
//     }
//   };

//   const resetForm = () => {
//     setShowForm(false);
//     setEditingBook(null);
//     setFormData({
//       title: "",
//       author: "",
//       isbn: "",
//       description: "",
//       category: "",
//       publishedYear: new Date().getFullYear(),
//       publisher: "",
//       totalCopies: 1,
//       pdfFile: null,
//       coverImage: "",
//     });

//     // Reset file input
//     const fileInput = document.querySelector('input[type="file"]');
//     if (fileInput) fileInput.value = "";
//   };

//   const handleEdit = (book) => {
//     setEditingBook(book);
//     setFormData({
//       title: book.title || "",
//       author: book.author || "",
//       isbn: book.isbn || "",
//       description: book.description || "",
//       category: book.category || "",
//       publishedYear: book.publishedYear || new Date().getFullYear(),
//       publisher: book.publisher || "",
//       totalCopies: book.totalCopies || 1,
//       pdfFile: null, // Don't set the file, user can upload new one
//       coverImage: book.coverImage || "",
//     });
//     setShowForm(true);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleDelete = async (id) => {
//     if (
//       !window.confirm(
//         "Are you sure you want to delete this book? This action cannot be undone.",
//       )
//     ) {
//       return;
//     }

//     try {
//       setLoading(true);
//       await bookAPI.deleteBook(id);
//       alert(" Book deleted successfully!");
//       await fetchBooks();
//     } catch (error) {
//       console.error("Error deleting book:", error);
//       alert(
//         error.response?.data?.message || "Delete failed. Please try again.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredBooks = books.filter((book) => {
//     const matchesSearch =
//       searchTerm === "" ||
//       (book.title &&
//         book.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (book.author &&
//         book.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (book.isbn && book.isbn.includes(searchTerm));

//     const matchesCategory =
//       selectedCategory === "" || book.category === selectedCategory;

//     return matchesSearch && matchesCategory;
//   });

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Book Management</h1>
//           <p className="text-gray-600 mt-2">
//             Add, edit, or remove books from the library
//           </p>
//         </div>
//         <button
//           onClick={() => {
//             resetForm();
//             setShowForm(true);
//           }}
//           className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
//           disabled={uploading}
//         >
//           <PlusIcon className="w-5 h-5" />
//           <span className="ml-2">Add New Book</span>
//         </button>
//       </div>

//       {/* Search & Filter */}
//       <div className="mb-6 flex flex-col md:flex-row gap-4">
//         <input
//           type="text"
//           placeholder="Search by title, author, or ISBN..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         />
//         <select
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//           className="md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         >
//           <option value="">All Categories</option>
//           {categories.map((cat) => (
//             <option key={cat} value={cat}>
//               {cat}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Book Form */}
//       {showForm && (
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-2 border-indigo-100">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">
//             {editingBook ? "✏️ Edit Book" : "➕ Add New Book"}
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Title and Author */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Title <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="Enter book title"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Author <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="author"
//                   value={formData.author}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="Enter author name"
//                 />
//               </div>
//             </div>

//             {/* ISBN and Category */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   ISBN <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="isbn"
//                   value={formData.isbn}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="Enter ISBN"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Category <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 >
//                   <option value="">Select a category</option>
//                   {categories.map((cat) => (
//                     <option key={cat} value={cat}>
//                       {cat}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Year and Copies */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Published Year <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="number"
//                   name="publishedYear"
//                   value={formData.publishedYear}
//                   onChange={handleChange}
//                   required
//                   min="1000"
//                   max={new Date().getFullYear()}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Total Copies <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="number"
//                   name="totalCopies"
//                   value={formData.totalCopies}
//                   onChange={handleChange}
//                   required
//                   min="1"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Description <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 required
//                 rows="3"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 placeholder="Enter book description"
//               />
//             </div>

//             {/* Cover Image and Publisher */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Cover Image URL
//                 </label>
//                 <input
//                   type="url"
//                   name="coverImage"
//                   value={formData.coverImage}
//                   onChange={handleChange}
//                   placeholder="https://example.com/cover.jpg"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Publisher
//                 </label>
//                 <input
//                   type="text"
//                   name="publisher"
//                   value={formData.publisher}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="Enter publisher name"
//                 />
//               </div>
//             </div>

//             {/* PDF Upload */}
//             <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Upload PDF File
//               </label>
//               <div className="flex items-center justify-center w-full">
//                 <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
//                   <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                     <svg
//                       className="w-8 h-8 mb-3 text-gray-500"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                       />
//                     </svg>
//                     <p className="mb-2 text-sm text-gray-500">
//                       <span className="font-semibold">Click to upload</span> or
//                       drag and drop
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       PDF files only (Max size: 50MB)
//                     </p>
//                   </div>
//                   <input
//                     type="file"
//                     name="pdfFile"
//                     accept=".pdf,application/pdf"
//                     onChange={handleChange}
//                     className="hidden"
//                   />
//                 </label>
//               </div>

//               {formData.pdfFile && (
//                 <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex justify-between items-center">
//                   <div className="flex items-center">
//                     <svg
//                       className="w-5 h-5 text-green-500 mr-2"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M5 13l4 4L19 7"
//                       />
//                     </svg>
//                     <span className="text-sm font-medium text-gray-700">
//                       {formData.pdfFile.name}
//                     </span>
//                   </div>
//                   <span className="text-xs text-gray-500">
//                     {(formData.pdfFile.size / 1024 / 1024).toFixed(2)} MB
//                   </span>
//                 </div>
//               )}

//               {editingBook && editingBook.pdfFilename && !formData.pdfFile && (
//                 <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
//                   <div className="flex items-center">
//                     <svg
//                       className="w-5 h-5 text-blue-500 mr-2"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                       />
//                     </svg>
//                     <span className="text-sm text-gray-700">
//                       Current PDF: {editingBook.pdfFilename}
//                     </span>
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1 ml-7">
//                     Upload a new file to replace the existing one
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Form Buttons */}
//             <div className="flex justify-end space-x-3 pt-4">
//               <button
//                 type="button"
//                 onClick={resetForm}
//                 disabled={uploading}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={uploading}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center transition-colors"
//               >
//                 {uploading ? (
//                   <>
//                     <svg
//                       className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Processing...
//                   </>
//                 ) : editingBook ? (
//                   "Update Book"
//                 ) : (
//                   "Add Book"
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Book Table */}
//       {loading ? (
//         <div className="text-center py-12">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading books...</p>
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Book
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Details
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Availability
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     PDF
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredBooks.length > 0 ? (
//                   filteredBooks.map((book) => (
//                     <tr key={book._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4">
//                         <div className="text-sm font-medium text-gray-900">
//                           {book.title}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           by {book.author}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900">
//                           ISBN: {book.isbn}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {book.category}
//                         </div>
//                         {book.publisher && (
//                           <div className="text-xs text-gray-400">
//                             {book.publisher} • {book.publishedYear}
//                           </div>
//                         )}
//                       </td>
//                       <td className="px-6 py-4">
//                         <span
//                           className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                             book.totalCopies > 0
//                               ? "bg-green-100 text-green-800"
//                               : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {book.totalCopies > 0
//                             ? `${book.totalCopies} Available`
//                             : "Out of stock"}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         {book.pdfFile ? (
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => handlePdfView(book)}
//                               className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
//                             >
//                               View
//                             </button>
//                             <button
//                               onClick={() => handleDownloadPdf(book)}
//                               className="text-green-600 hover:text-green-900 text-sm font-medium"
//                             >
//                               Download
//                             </button>
//                           </div>
//                         ) : (
//                           <span className="text-xs text-gray-400">No PDF</span>
//                         )}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => handleEdit(book)}
//                             className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
//                             title="Edit book"
//                           >
//                             <PencilIcon className="w-5 h-5" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(book._id)}
//                             className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
//                             title="Delete book"
//                           >
//                             <TrashIcon className="w-5 h-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={5}
//                       className="px-6 py-12 text-center text-gray-500"
//                     >
//                       {searchTerm || selectedCategory ? (
//                         <div>
//                           <p className="text-lg mb-2">
//                             No books match your search criteria
//                           </p>
//                           <button
//                             onClick={() => {
//                               setSearchTerm("");
//                               setSelectedCategory("");
//                             }}
//                             className="text-indigo-600 hover:text-indigo-900 font-medium"
//                           >
//                             Clear filters
//                           </button>
//                         </div>
//                       ) : (
//                         <div>
//                           <p className="text-lg mb-2">No books found</p>
//                           <button
//                             onClick={() => setShowForm(true)}
//                             className="text-indigo-600 hover:text-indigo-900 font-medium"
//                           >
//                             Add your first book
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





/* eslint-disable no-unused-vars */

import { useState, useEffect } from "react";
import { bookAPI } from "../services/api";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  DownloadIcon,
} from "../components/Icons";

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    description: "",
    category: "",
    publishedYear: new Date().getFullYear(),
    publisher: "",
    totalCopies: 1,
    pdfFile: null,
    coverImage: "",
  });
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    "Fiction",
    "Non-Fiction",
    "Science",
    "Technology",
    "History",
    "Biography",
    "Education",
    "Religion",
    "Art",
    "Business",
  ];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookAPI.getAllBooks();
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
      alert("Failed to fetch books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "pdfFile" && files) {
      const file = files[0];
      if (file) {
        if (file.type !== "application/pdf") {
          alert("Please select a PDF file");
          e.target.value = "";
          setFormData({ ...formData, pdfFile: null });
          return;
        }
        if (file.size > 50 * 1024 * 1024) {
          alert("File size must be less than 50MB");
          e.target.value = "";
          setFormData({ ...formData, pdfFile: null });
          return;
        }
        setFormData({ ...formData, pdfFile: file });
      } else {
        setFormData({ ...formData, pdfFile: null });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.author ||
      !formData.isbn ||
      !formData.category ||
      !formData.description
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setUploading(true);

      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("author", formData.author.trim());
      formDataToSend.append("isbn", formData.isbn.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("category", formData.category);
      formDataToSend.append("publishedYear", formData.publishedYear.toString());
      formDataToSend.append("publisher", formData.publisher?.trim() || "");
      formDataToSend.append("totalCopies", formData.totalCopies.toString());
      formDataToSend.append("coverImage", formData.coverImage?.trim() || "");

      if (formData.pdfFile instanceof File) {
        formDataToSend.append("pdfFile", formData.pdfFile);
        console.log("📎 Appending PDF file:", formData.pdfFile.name);
      }

      let response;
      if (editingBook) {
        console.log("✏️ Updating book:", editingBook._id);
        response = await bookAPI.updateBook(editingBook._id, formDataToSend);
      } else {
        console.log("➕ Creating new book");
        response = await bookAPI.createBook(formDataToSend);
      }

      console.log("✅ Book saved successfully:", response.data);
      alert(`✅ Book ${editingBook ? "updated" : "added"} successfully!`);

      resetForm();
      await fetchBooks();
    } catch (error) {
      console.error("❌ Error saving book:", error);

      let errorMessage = "Operation failed";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(`❌ ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  // ✅ FIXED: Always use book ID for PDF URL
  const handlePdfView = (book) => {
    if (!book || !book.pdfFile) {
      alert("No PDF available for this book");
      return;
    }

    // Use the backend endpoint with book ID
    const pdfUrl = `${API_URL}/books/pdf/${book._id}`;
    console.log("📄 Opening PDF:", pdfUrl);
    window.open(pdfUrl, "_blank");
  };

  const handleDownloadPdf = async (book) => {
    if (!book || !book.pdfFile) {
      alert("No PDF available to download");
      return;
    }

    try {
      let pdfUrl;
      let filename = book.pdfFilename || `${book.title.replace(/\s+/g, "_")}.pdf`;

      if (import.meta.env.PROD && book.pdfFile.includes("cloudinary")) {
        // Production: use Cloudinary URL directly
        pdfUrl = book.pdfFile.replace(/\/v\d+\//, "/");
      } else {
        // Development: use backend endpoint with ID
        pdfUrl = `${API_URL}/books/pdf/${book._id}`;
      }

      // Add timestamp to prevent caching
      const separator = pdfUrl.includes("?") ? "&" : "?";
      pdfUrl = `${pdfUrl}${separator}_t=${Date.now()}`;

      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = filename;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingBook(null);
    setFormData({
      title: "",
      author: "",
      isbn: "",
      description: "",
      category: "",
      publishedYear: new Date().getFullYear(),
      publisher: "",
      totalCopies: 1,
      pdfFile: null,
      coverImage: "",
    });

    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title || "",
      author: book.author || "",
      isbn: book.isbn || "",
      description: book.description || "",
      category: book.category || "",
      publishedYear: book.publishedYear || new Date().getFullYear(),
      publisher: book.publisher || "",
      totalCopies: book.totalCopies || 1,
      pdfFile: null,
      coverImage: book.coverImage || "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this book? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await bookAPI.deleteBook(id);
      alert("✅ Book deleted successfully!");
      await fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      alert(
        error.response?.data?.message || "Delete failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      searchTerm === "" ||
      (book.title &&
        book.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (book.author &&
        book.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (book.isbn && book.isbn.includes(searchTerm));

    const matchesCategory =
      selectedCategory === "" || book.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Book Management</h1>
          <p className="text-gray-600 mt-2">
            Add, edit, or remove books from the library
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          disabled={uploading}
        >
          <PlusIcon className="w-5 h-5" />
          <span className="ml-2">Add New Book</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by title, author, or ISBN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Book Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-2 border-indigo-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingBook ? "✏️ Edit Book" : "➕ Add New Book"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title and Author */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter book title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter author name"
                />
              </div>
            </div>

            {/* ISBN and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ISBN <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter ISBN"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Year and Copies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Published Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="publishedYear"
                  value={formData.publishedYear}
                  onChange={handleChange}
                  required
                  min="1000"
                  max={new Date().getFullYear()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Copies <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="totalCopies"
                  value={formData.totalCopies}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter book description"
              />
            </div>

            {/* Cover Image and Publisher */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="https://example.com/cover.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publisher
                </label>
                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter publisher name"
                />
              </div>
            </div>

            {/* PDF Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload PDF File
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-3 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF files only (Max size: 50MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    name="pdfFile"
                    accept=".pdf,application/pdf"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </div>

              {formData.pdfFile && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex justify-between items-center">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">
                      {formData.pdfFile.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {(formData.pdfFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              )}

              {editingBook && editingBook.pdfFilename && !formData.pdfFile && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="text-sm text-gray-700">
                      Current PDF: {editingBook.pdfFilename}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-7">
                    Upload a new file to replace the existing one
                  </p>
                </div>
              )}
            </div>

            {/* Form Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                disabled={uploading}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center transition-colors"
              >
                {uploading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : editingBook ? (
                  "Update Book"
                ) : (
                  "Add Book"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Book Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading books...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Availability
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PDF
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <tr key={book._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {book.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          by {book.author}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          ISBN: {book.isbn}
                        </div>
                        <div className="text-sm text-gray-500">
                          {book.category}
                        </div>
                        {book.publisher && (
                          <div className="text-xs text-gray-400">
                            {book.publisher} • {book.publishedYear}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            book.totalCopies > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {book.totalCopies > 0
                            ? `${book.totalCopies} Available`
                            : "Out of stock"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {book.pdfFile ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handlePdfView(book)}
                              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDownloadPdf(book)}
                              className="text-green-600 hover:text-green-900 text-sm font-medium"
                            >
                              Download
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">No PDF</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(book)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Edit book"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(book._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Delete book"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      {searchTerm || selectedCategory ? (
                        <div>
                          <p className="text-lg mb-2">
                            No books match your search criteria
                          </p>
                          <button
                            onClick={() => {
                              setSearchTerm("");
                              setSelectedCategory("");
                            }}
                            className="text-indigo-600 hover:text-indigo-900 font-medium"
                          >
                            Clear filters
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-lg mb-2">No books found</p>
                          <button
                            onClick={() => setShowForm(true)}
                            className="text-indigo-600 hover:text-indigo-900 font-medium"
                          >
                            Add your first book
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


