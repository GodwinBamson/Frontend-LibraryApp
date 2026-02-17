// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { bookAPI, borrowAPI } from "../services/api";
// import PDFReader from "../components/PDFReader";

// export default function Books() {
//   const [books, setBooks] = useState([]);
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [categories, setCategories] = useState([]);
//   const [selectedPdf, setSelectedPdf] = useState(null);
//   const user = JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     fetchBooks();
//     fetchCategories();
//   }, [search, category]);

//   const fetchBooks = async () => {
//     try {
//       setLoading(true);
//       const params = {};
//       if (search) params.search = search;
//       if (category) params.category = category;

//       const response = await bookAPI.getAllBooks(params);
//       setBooks(response.data);
//     } catch (error) {
//       console.error("Error fetching books:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await bookAPI.getAllBooks();
//       const uniqueCategories = [
//         ...new Set(response.data.map((book) => book.category)),
//       ];
//       setCategories(uniqueCategories);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const handleBorrow = async (bookId) => {
//     if (!user) {
//       alert("Please login to borrow books");
//       return;
//     }

//     if (user.role !== "student") {
//       alert("Only students can borrow books");
//       return;
//     }

//     try {
//       await borrowAPI.borrowBook(bookId);
//       alert(" Book borrowed successfully! You have 14 days to return it.");
//       fetchBooks();
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to borrow book");
//     }
//   };

//   const handleRead = (pdfUrl, bookTitle) => {
//     setSelectedPdf({ url: pdfUrl, title: bookTitle });
//   };

//   return (
//     <>
//       <div className="container mx-auto px-4 py-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Library Books</h1>
//           <p className="text-gray-600 mt-2">
//             Browse, borrow, and read books from our collection
//           </p>
//         </div>

//         <div className="mb-6 flex flex-col md:flex-row gap-4">
//           <div className="flex-1">
//             <input
//               type="text"
//               placeholder="Search books by title, author, or ISBN..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//             />
//           </div>
//           <div className="w-full md:w-64">
//             <select
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//             >
//               <option value="">All Categories</option>
//               {categories.map((cat) => (
//                 <option key={cat} value={cat}>
//                   {cat}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {loading ? (
//           <div className="text-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//             <p className="mt-4 text-gray-600">Loading books...</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {books.map((book) => (
//               <div
//                 key={book._id}
//                 className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//               >
//                 <div className="p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
//                       {book.category}
//                     </span>
//                     <span className="text-sm text-gray-500">
//                       {book.availableCopies} of {book.totalCopies} available
//                     </span>
//                   </div>

//                   <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                     <Link
//                       to={`/books/${book._id}`}
//                       className="hover:text-indigo-600"
//                     >
//                       {book.title}
//                     </Link>
//                   </h3>

//                   <p className="text-gray-600 mb-1">by {book.author}</p>
//                   <p className="text-sm text-gray-500 mb-4">
//                     ISBN: {book.isbn}
//                   </p>

//                   <p className="text-gray-700 line-clamp-3 mb-6">
//                     {book.description}
//                   </p>

//                   <div className="flex flex-col gap-3">
//                     {/* PDF Read Online Section */}
//                     {book.pdfUrl && (
//                       <div className="flex items-center justify-between bg-green-50 p-3 rounded-md border border-green-200">
//                         <div className="flex items-center">
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="h-5 w-5 text-green-600 mr-2"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
//                             />
//                           </svg>
//                           <span className="text-sm text-gray-700">
//                             PDF Available
//                           </span>
//                         </div>
//                         <button
//                           onClick={() => handleRead(book.pdfUrl, book.title)}
//                           className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
//                         >
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="h-4 w-4 mr-1"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                             />
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                             />
//                           </svg>
//                           Read Online
//                         </button>
//                       </div>
//                     )}

//                     {/* Borrow Section */}
//                     <div className="flex items-center justify-between">
//                       <div className="text-sm text-gray-500">
//                         Published: {book.publishedYear}
//                       </div>
//                       {user?.role === "student" &&
//                         (book.availableCopies > 0 ? (
//                           <button
//                             onClick={() => handleBorrow(book._id)}
//                             className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
//                           >
//                             Borrow
//                           </button>
//                         ) : (
//                           <span className="px-4 py-2 bg-gray-300 text-gray-600 text-sm font-medium rounded-md cursor-not-allowed">
//                             Unavailable
//                           </span>
//                         ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {!loading && books.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-gray-600">
//               No books found. Try a different search.
//             </p>
//           </div>
//         )}
//       </div>

//       {/* PDF Reader Modal */}
//       {selectedPdf && (
//         <PDFReader
//           pdfUrl={selectedPdf.url}
//           bookTitle={selectedPdf.title}
//           onClose={() => setSelectedPdf(null)}
//         />
//       )}
//     </>
//   );
// }





import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { bookAPI, borrowAPI } from "../services/api";
import PDFReader from "../components/PDFReader";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, [search, category]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;

      const response = await bookAPI.getAllBooks(params);
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await bookAPI.getAllBooks();
      const uniqueCategories = [
        ...new Set(response.data.map((book) => book.category)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleBorrow = async (bookId) => {
    if (!user) {
      alert("Please login to borrow books");
      return;
    }

    if (user.role !== "student") {
      alert("Only students can borrow books");
      return;
    }

    try {
      await borrowAPI.borrowBook(bookId);
      alert("✅ Book borrowed successfully! You have 14 days to return it.");
      fetchBooks();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to borrow book");
    }
  };

  // ✅ FIXED: Pass the entire book object
  const handleRead = (book) => {
    if (!book.pdfFile) {
      alert("No PDF available for this book");
      return;
    }

    if (import.meta.env.PROD && book.pdfUrl?.includes("cloudinary")) {
      // Production: use Cloudinary URL
      setSelectedPdf({ url: book.pdfUrl, title: book.title });
    } else {
      // Development: use backend endpoint with ID
      const pdfUrl = `${API_URL}/books/pdf/${book._id}`;
      setSelectedPdf({ url: pdfUrl, title: book.title });
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Library Books</h1>
          <p className="text-gray-600 mt-2">
            Browse, borrow, and read books from our collection
          </p>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search books by title, author, or ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="w-full md:w-64">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading books...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      {book.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {book.availableCopies} of {book.totalCopies} available
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <Link
                      to={`/books/${book._id}`}
                      className="hover:text-indigo-600"
                    >
                      {book.title}
                    </Link>
                  </h3>

                  <p className="text-gray-600 mb-1">by {book.author}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    ISBN: {book.isbn}
                  </p>

                  <p className="text-gray-700 line-clamp-3 mb-6">
                    {book.description}
                  </p>

                  <div className="flex flex-col gap-3">
                    {/* PDF Read Online Section */}
                    {book.pdfFile && (
                      <div className="flex items-center justify-between bg-green-50 p-3 rounded-md border border-green-200">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-600 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-sm text-gray-700">
                            PDF Available
                          </span>
                        </div>
                        <button
                          onClick={() => handleRead(book)}  // ✅ Pass entire book
                          className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          Read Online
                        </button>
                      </div>
                    )}

                    {/* Borrow Section */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Published: {book.publishedYear}
                      </div>
                      {user?.role === "student" &&
                        (book.availableCopies > 0 ? (
                          <button
                            onClick={() => handleBorrow(book._id)}
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                          >
                            Borrow
                          </button>
                        ) : (
                          <span className="px-4 py-2 bg-gray-300 text-gray-600 text-sm font-medium rounded-md cursor-not-allowed">
                            Unavailable
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && books.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No books found. Try a different search.
            </p>
          </div>
        )}
      </div>

      {/* PDF Reader Modal */}
      {selectedPdf && (
        <PDFReader
          pdfUrl={selectedPdf.url}
          bookTitle={selectedPdf.title}
          onClose={() => setSelectedPdf(null)}
        />
      )}
    </>
  );
}









// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */

// import { useState, useEffect, useRef } from "react";
// import * as pdfjsLib from "pdfjs-dist";

// // Set the worker source
// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// export default function PDFViewer({ pdfUrl, bookTitle, onClose }) {
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const canvasRef = useRef(null);
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const loadPDF = async () => {
//       try {
//         setLoading(true);
        
//         // Load the PDF document
//         const loadingTask = pdfjsLib.getDocument(pdfUrl);
//         const pdf = await loadingTask.promise;
        
//         setNumPages(pdf.numPages);
        
//         // Load first page
//         await renderPage(pdf, 1);
        
//         setLoading(false);
//       } catch (err) {
//         console.error("Error loading PDF:", err);
//         setError("Failed to load PDF. Please try again.");
//         setLoading(false);
//       }
//     };

//     loadPDF();
//   }, [pdfUrl]);

//   const renderPage = async (pdf, pageNum) => {
//     try {
//       // Get the page
//       const page = await pdf.getPage(pageNum);
      
//       // Set scale based on container width
//       const container = containerRef.current;
//       const scale = container ? container.clientWidth / page.getViewport({ scale: 1 }).width : 1.5;
//       const viewport = page.getViewport({ scale });
      
//       // Prepare canvas
//       const canvas = canvasRef.current;
//       const context = canvas.getContext('2d');
//       canvas.height = viewport.height;
//       canvas.width = viewport.width;
      
//       // Render the page
//       const renderContext = {
//         canvasContext: context,
//         viewport: viewport
//       };
      
//       await page.render(renderContext).promise;
//     } catch (err) {
//       console.error("Error rendering page:", err);
//     }
//   };

//   const handlePrevPage = () => {
//     if (pageNumber <= 1) return;
//     setPageNumber(prev => prev - 1);
//     // Reload page when page changes
//     setTimeout(async () => {
//       try {
//         const loadingTask = pdfjsLib.getDocument(pdfUrl);
//         const pdf = await loadingTask.promise;
//         await renderPage(pdf, pageNumber - 1);
//       } catch (err) {
//         console.error("Error loading page:", err);
//       }
//     }, 100);
//   };

//   const handleNextPage = () => {
//     if (pageNumber >= numPages) return;
//     setPageNumber(prev => prev + 1);
//     setTimeout(async () => {
//       try {
//         const loadingTask = pdfjsLib.getDocument(pdfUrl);
//         const pdf = await loadingTask.promise;
//         await renderPage(pdf, pageNumber + 1);
//       } catch (err) {
//         console.error("Error loading page:", err);
//       }
//     }, 100);
//   };

//   if (loading) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
//           <p className="text-white text-lg">Loading PDF...</p>
//           <p className="text-gray-400 text-sm mt-2">Please wait while we prepare your document</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
//         <div className="bg-white rounded-lg p-8 max-w-md">
//           <div className="text-red-600 text-center mb-4">
//             <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//             </svg>
//           </div>
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load PDF</h3>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={onClose}
//             className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
//       {/* Custom Toolbar - No download button! */}
//       <div className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
//             title="Close"
//           >
//             <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//           <span className="font-medium truncate max-w-md">{bookTitle}</span>
//         </div>
        
//         <div className="flex items-center space-x-4">
//           <span className="text-sm text-gray-300">
//             Page {pageNumber} of {numPages}
//           </span>
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={handlePrevPage}
//               disabled={pageNumber <= 1}
//               className={`p-2 rounded-lg transition-colors ${
//                 pageNumber <= 1 
//                   ? 'text-gray-600 cursor-not-allowed' 
//                   : 'hover:bg-gray-700 text-white'
//               }`}
//               title="Previous page"
//             >
//               <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//             </button>
//             <button
//               onClick={handleNextPage}
//               disabled={pageNumber >= numPages}
//               className={`p-2 rounded-lg transition-colors ${
//                 pageNumber >= numPages 
//                   ? 'text-gray-600 cursor-not-allowed' 
//                   : 'hover:bg-gray-700 text-white'
//               }`}
//               title="Next page"
//             >
//               <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* PDF Canvas Container */}
//       <div 
//         ref={containerRef}
//         className="flex-1 overflow-auto bg-gray-900 flex justify-center p-4"
//         onContextMenu={(e) => e.preventDefault()} // Disable right-click
//       >
//         <canvas 
//           ref={canvasRef} 
//           className="shadow-2xl rounded-lg"
//           style={{ maxWidth: '100%', height: 'auto' }}
//         />
//       </div>

//       {/* Watermark */}
//       <div className="absolute bottom-4 right-4 text-gray-600 text-xs opacity-50 pointer-events-none">
//         Library Management System
//       </div>
//     </div>
//   );
// }