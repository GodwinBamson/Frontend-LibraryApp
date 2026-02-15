/* eslint-disable no-unused-vars */


// import { useState, useEffect } from "react";
// import { bookAPI } from "../services/api";
// import { PlusIcon, PencilIcon, TrashIcon } from "../components/Icons";

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
//     pdfUrl: "",
//     coverImage: "",
//     pdfFile: null,
//   });
//   const [uploading, setUploading] = useState(false);

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
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (name === "pdfFile" && files) {
//       // Handle file selection
//       if (files.length > 0) {
//         const file = files[0];

//         // Validate file type
//         if (file.type !== "application/pdf") {
//           alert("Please select a PDF file");
//           e.target.value = ""; // Clear the input
//           setFormData({
//             ...formData,
//             pdfFile: null,
//           });
//           return;
//         }

//         // Validate file size (50MB max)
//         if (file.size > 50 * 1024 * 1024) {
//           alert("File size must be less than 50MB");
//           e.target.value = ""; // Clear the input
//           setFormData({
//             ...formData,
//             pdfFile: null,
//           });
//           return;
//         }

//         setFormData({
//           ...formData,
//           pdfFile: file,
//         });
//       } else {
//         setFormData({
//           ...formData,
//           pdfFile: null,
//         });
//       }
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value,
//       });
//     }
//   };

  

// const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//         setUploading(true);

//         const formDataToSend = new FormData();

//         // Append all fields
//         formDataToSend.append("title", formData.title);
//         formDataToSend.append("author", formData.author);
//         formDataToSend.append("isbn", formData.isbn);
//         formDataToSend.append("description", formData.description);
//         formDataToSend.append("category", formData.category);
//         formDataToSend.append("publishedYear", formData.publishedYear.toString());
//         formDataToSend.append("publisher", formData.publisher || "");
//         formDataToSend.append("totalCopies", formData.totalCopies.toString());
//         formDataToSend.append("coverImage", formData.coverImage || "");

//         // Append file if selected
//         if (formData.pdfFile && formData.pdfFile instanceof File) {
//             formDataToSend.append("pdfFile", formData.pdfFile);
//             console.log("📎 Uploading PDF:", formData.pdfFile.name);
//         }

//         const token = localStorage.getItem("token");
        
//         // Determine if we're creating or updating
//         const url = editingBook 
//             ? `http://localhost:5000/api/books/${editingBook._id}`  // PUT for updates
//             : "http://localhost:5000/api/books";                    // POST for new books
            
//         const method = editingBook ? "PUT" : "POST";

//         console.log(`📤 ${method} request to:`, url);

//         const response = await fetch(url, {
//             method: method,
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//             body: formDataToSend,
//         });

//         const data = await response.json();

//         if (!response.ok) {
//             throw new Error(data.message || "Operation failed");
//         }

//         console.log("✅ Server response:", data);
//         alert(`✅ Book ${editingBook ? 'updated' : 'added'} successfully!`);

//         // Reset form
//         setShowForm(false);
//         setEditingBook(null);
//         setFormData({
//             title: "",
//             author: "",
//             isbn: "",
//             description: "",
//             category: "",
//             publishedYear: new Date().getFullYear(),
//             publisher: "",
//             totalCopies: 1,
//             pdfUrl: "",
//             coverImage: "",
//             pdfFile: null,
//         });

//         // Reset file input
//         const fileInput = document.querySelector('input[type="file"]');
//         if (fileInput) fileInput.value = "";

//         fetchBooks();
//     } catch (error) {
//         console.error("Error saving book:", error);
//         alert(error.message || "Operation failed");
//     } finally {
//         setUploading(false);
//     }
// };


// const handleEdit = (book) => {
//     setEditingBook(book);
//     setFormData({
//       title: book.title,
//       author: book.author,
//       isbn: book.isbn,
//       description: book.description,
//       category: book.category,
//       publishedYear: book.publishedYear,
//       publisher: book.publisher || "",
//       totalCopies: book.totalCopies,
//       pdfUrl: book.pdfUrl || "",
//       coverImage: book.coverImage || "",
//       pdfFile: null, // Reset file input
//     });
//     setShowForm(true);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this book?")) {
//       try {
//         await bookAPI.deleteBook(id);
//         alert("✅ Book deleted successfully!");
//         fetchBooks();
//       } catch (error) {
//         alert(error.response?.data?.message || "Delete failed");
//       }
//     }
//   };

//   const categories = [
//     "Fiction",
//     "Non-Fiction",
//     "Science",
//     "Technology",
//     "History",
//     "Biography",
//     "Education",
//   ];

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Book Management</h1>
//           <p className="text-gray-600 mt-2">
//             Add, edit, or remove books from the library
//           </p>
//         </div>
//         <button
//           onClick={() => {
//             setEditingBook(null);
//             setFormData({
//               title: "",
//               author: "",
//               isbn: "",
//               description: "",
//               category: "",
//               publishedYear: new Date().getFullYear(),
//               publisher: "",
//               totalCopies: 1,
//               pdfUrl: "",
//               coverImage: "",
//               pdfFile: null,
//             });
//             setShowForm(true);
//           }}
//           className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//         >
//           <PlusIcon />
//           <span className="ml-2">Add New Book</span>
//         </button>
//       </div>

//       {showForm && (
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">
//             {editingBook ? "Edit Book" : "Add New Book"}
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Title *
//                 </label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Author *
//                 </label>
//                 <input
//                   type="text"
//                   name="author"
//                   value={formData.author}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   ISBN *
//                 </label>
//                 <input
//                   type="text"
//                   name="isbn"
//                   value={formData.isbn}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Category *
//                 </label>
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 >
//                   <option value="">Select a category</option>
//                   {categories.map((cat) => (
//                     <option key={cat} value={cat}>
//                       {cat}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Published Year *
//                 </label>
//                 <input
//                   type="number"
//                   name="publishedYear"
//                   value={formData.publishedYear}
//                   onChange={handleChange}
//                   required
//                   min="1000"
//                   max="9999"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Total Copies *
//                 </label>
//                 <input
//                   type="number"
//                   name="totalCopies"
//                   value={formData.totalCopies}
//                   onChange={handleChange}
//                   required
//                   min="1"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Description *
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 required
//                 rows="3"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               />
//             </div>

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
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//             </div>

//             {/* PDF File Upload Section */}
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

//               {/* Show selected file name */}
//               {formData.pdfFile && formData.pdfFile instanceof File && (
//                 <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <svg
//                         className="h-5 w-5 text-green-600 mr-2"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                         />
//                       </svg>
//                       <span className="text-sm font-medium text-gray-700">
//                         {formData.pdfFile.name}
//                       </span>
//                     </div>
//                     <span className="text-xs text-gray-500">
//                       {(formData.pdfFile.size / 1024 / 1024).toFixed(2)} MB
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {/* Show existing PDF if editing */}
//               {editingBook && editingBook.pdfFilename && !formData.pdfFile && (
//                 <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
//                   <div className="flex items-center">
//                     <svg
//                       className="h-5 w-5 text-blue-600 mr-2"
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
//                   <p className="text-xs text-gray-500 mt-1">
//                     Upload a new file to replace the existing one
//                   </p>
//                 </div>
//               )}
//             </div>

//             <div className="flex justify-end space-x-3">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowForm(false);
//                   setEditingBook(null);
//                   setFormData({
//                     title: "",
//                     author: "",
//                     isbn: "",
//                     description: "",
//                     category: "",
//                     publishedYear: new Date().getFullYear(),
//                     publisher: "",
//                     totalCopies: 1,
//                     pdfUrl: "",
//                     coverImage: "",
//                     pdfFile: null,
//                   });
//                 }}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={uploading}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//               >
//                 {uploading ? (
//                   <>
//                     <svg
//                       className="animate-spin h-4 w-4 mr-2 text-white"
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
//                       />
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       />
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

//       {loading ? (
//         <div className="text-center py-12">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Book
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Details
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Availability
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   PDF
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {books.map((book) => (
//                 <tr key={book._id}>
//                   <td className="px-6 py-4">
//                     <div className="text-sm font-medium text-gray-900">
//                       {book.title}
//                     </div>
//                     <div className="text-sm text-gray-500">{book.author}</div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="text-sm text-gray-900">
//                       ISBN: {book.isbn}
//                     </div>
//                     <div className="text-sm text-gray-500">{book.category}</div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="text-sm">
//                       <span className="font-medium">
//                         {book.availableCopies}
//                       </span>{" "}
//                       of <span className="font-medium">{book.totalCopies}</span>{" "}
//                       available
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     {book.pdfFile ? (
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                         <svg
//                           className="h-3 w-3 mr-1"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                           />
//                         </svg>
//                         PDF
//                       </span>
//                     ) : (
//                       <span className="text-xs text-gray-400">No PDF</span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 text-sm font-medium">
//                     <button
//                       onClick={() => handleEdit(book)}
//                       className="text-indigo-600 hover:text-indigo-900 mr-4"
//                     >
//                       <PencilIcon className="inline mr-1" />
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(book._id)}
//                       className="text-red-600 hover:text-red-900"
//                     >
//                       <TrashIcon className="inline mr-1" />
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }





import { useState, useEffect } from "react";
import { bookAPI } from "../services/api";
import { PlusIcon, PencilIcon, TrashIcon, DownloadIcon } from "../components/Icons";


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
    pdfUrl: "",
    coverImage: "",
    pdfFile: null,
  });
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

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
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "pdfFile" && files) {
      if (files.length > 0) {
        const file = files[0];

        // Validate file type
        if (file.type !== "application/pdf") {
          alert("Please select a PDF file");
          e.target.value = "";
          setFormData({
            ...formData,
            pdfFile: null,
          });
          return;
        }

        // Validate file size (50MB max)
        if (file.size > 50 * 1024 * 1024) {
          alert("File size must be less than 50MB");
          e.target.value = "";
          setFormData({
            ...formData,
            pdfFile: null,
          });
          return;
        }

        setFormData({
          ...formData,
          pdfFile: file,
        });
      } else {
        setFormData({
          ...formData,
          pdfFile: null,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // NEW handleSubmit function using api




const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setUploading(true);

    const formDataToSend = new FormData();

    // Append all fields
    formDataToSend.append("title", formData.title);
    formDataToSend.append("author", formData.author);
    formDataToSend.append("isbn", formData.isbn);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("publishedYear", formData.publishedYear.toString());
    formDataToSend.append("publisher", formData.publisher || "");
    formDataToSend.append("totalCopies", formData.totalCopies.toString());
    formDataToSend.append("coverImage", formData.coverImage || "");

    // Append file if selected
    if (formData.pdfFile && formData.pdfFile instanceof File) {
      formDataToSend.append("pdfFile", formData.pdfFile);
      console.log("📎 PDF File attached:", {
        name: formData.pdfFile.name,
        type: formData.pdfFile.type,
        size: formData.pdfFile.size
      });
    }

    // Log FormData contents
    console.log("📦 FormData contents:");
    for (let pair of formDataToSend.entries()) {
      if (pair[0] === 'pdfFile' && pair[1] instanceof File) {
        console.log(pair[0], `File: ${pair[1].name} (${pair[1].type})`);
      } else {
        console.log(pair[0], pair[1]);
      }
    }

    const token = localStorage.getItem("token");
    
    // Determine if we're creating or updating
    const endpoint = editingBook ? `/books/${editingBook._id}` : '/books';
    const method = editingBook ? 'put' : 'post';

    console.log(`📤 ${method.toUpperCase()} request to:`, endpoint);

    // IMPORTANT: Use fetch instead of axios to avoid interceptor issues
    const url = `http://localhost:5000/api${endpoint}`;
    
    const response = await fetch(url, {
      method: method.toUpperCase(),
      headers: {
        'Authorization': `Bearer ${token}`
        // DO NOT set Content-Type header - let browser set it with boundary
      },
      body: formDataToSend
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Operation failed');
    }

    const data = await response.json();
    
    console.log("✅ Server response:", data);
    
    alert(`✅ Book ${editingBook ? 'updated' : 'added'} successfully!`);

    resetForm();
    fetchBooks();
  } catch (error) {
    console.error("Error saving book:", error);
    
    const errorMessage = error.message || "Operation failed";
    alert(`❌ ${errorMessage}`);
  } finally {
    setUploading(false);
  }
};


  // NEW handlePdfView function
  const handlePdfView = (book) => {
    if (book.pdfUrl) {
      window.open(book.pdfUrl, '_blank');
    } else if (book.pdfFile) {
      // Fallback for development
      window.open(`http://localhost:5000/api/books/pdf/${book._id}`, '_blank');
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
      pdfUrl: "",
      coverImage: "",
      pdfFile: null,
    });
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      description: book.description,
      category: book.category,
      publishedYear: book.publishedYear,
      publisher: book.publisher || "",
      totalCopies: book.totalCopies,
      pdfUrl: book.pdfUrl || "",
      coverImage: book.coverImage || "",
      pdfFile: null,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await bookAPI.deleteBook(id);
        alert("✅ Book deleted successfully!");
        fetchBooks();
      } catch (error) {
        alert(error.response?.data?.message || "Delete failed");
      }
    }
  };

  const handleDownloadPdf = async (book) => {
    try {
      if (book.pdfUrl) {
        // In production, this will open the Cloudinary URL
        window.open(book.pdfUrl, '_blank');
      } else {
        // In development, download through API
        const response = await bookAPI.getPdf(book._id);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${book.title}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      alert("Failed to download PDF");
    }
  };

  const categories = [
    "Fiction",
    "Non-Fiction",
    "Science",
    "Technology",
    "History",
    "Biography",
    "Education",
  ];

  // Filter books based on search and category
  const filteredBooks = books.filter(book => {
    const matchesSearch = searchTerm === "" || 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm);
    
    const matchesCategory = selectedCategory === "" || book.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Book Management</h1>
          <p className="text-gray-600 mt-2">
            Add, edit, or remove books from the library
          </p>
        </div>
        <button
          onClick={() => {
            setEditingBook(null);
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon />
          <span className="ml-2">Add New Book</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="md:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingBook ? "Edit Book" : "Add New Book"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author *
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ISBN *
                </label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Published Year *
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
                  Total Copies *
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

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
                />
              </div>
            </div>

            {/* PDF File Upload Section */}
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

              {/* Show selected file name */}
              {formData.pdfFile && formData.pdfFile instanceof File && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-600 mr-2"
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
                      <span className="text-sm font-medium text-gray-700">
                        {formData.pdfFile.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {(formData.pdfFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
              )}

              {/* Show existing PDF if editing */}
              {editingBook && editingBook.pdfFilename && !formData.pdfFile && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-blue-600 mr-2"
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
                  <p className="text-xs text-gray-500 mt-1">
                    Upload a new file to replace the existing one
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
              >
                {uploading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 mr-2 text-white"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
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

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                      <div className="text-sm text-gray-500">{book.author}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        ISBN: {book.isbn}
                      </div>
                      <div className="text-sm text-gray-500">{book.category}</div>
                      {book.publisher && (
                        <div className="text-xs text-gray-400">{book.publisher}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <span className="font-medium">
                          {book.availableCopies}
                        </span>{" "}
                        of <span className="font-medium">{book.totalCopies}</span>{" "}
                        available
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {book.pdfFile || book.pdfUrl ? (
                        <button
                          onClick={() => handlePdfView(book)}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                        >
                          <DownloadIcon />
                          <span className="ml-1">View PDF</span>
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">No PDF</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <button
                        onClick={() => handleEdit(book)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                      >
                        <PencilIcon />
                        <span className="ml-1">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <TrashIcon />
                        <span className="ml-1">Delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No books found. {searchTerm || selectedCategory ? 'Try adjusting your filters.' : 'Click "Add New Book" to get started.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}