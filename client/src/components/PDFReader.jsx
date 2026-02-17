// // /* eslint-disable no-unused-vars */
// // /* eslint-disable react/prop-types */

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// export default function PDFReader({ pdfUrl, bookTitle, onClose }) {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [pdfData, setPdfData] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     const fetchPdf = async () => {
//       try {
//         setLoading(true);

//         // If it's a Cloudinary URL (production), open directly
//         if (pdfUrl.includes("cloudinary.com")) {
//           // For Cloudinary URLs, we can open directly in new tab
//           // or use fetch with proper headers
//           setPdfData(pdfUrl); // Store URL directly for iframe
//           setLoading(false);
//           return;
//         }

//         // For local server URLs, use fetch with auth
//         const response = await fetch(pdfUrl, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           redirect: "follow",
//           mode: "cors",
//           credentials: "omit",
//         });

//         if (!response.ok) {
//           throw new Error(`Failed to load PDF: ${response.status}`);
//         }

//         const blob = await response.blob();
//         const url = URL.createObjectURL(blob);
//         setPdfData(url);
//         setLoading(false);
//       } catch (err) {
//         console.error("PDF loading error:", err);

//         // Fallback: try opening directly in new tab
//         window.open(pdfUrl, "_blank");
//         onClose(); // Close the modal since we opened in new tab
//       }
//     };

//     fetchPdf();

//     return () => {
//       if (pdfData && !pdfData.includes("cloudinary.com")) {
//         URL.revokeObjectURL(pdfData);
//       }
//     };
//   }, [pdfUrl, navigate]);

//   const handleDownload = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       // For download, we can open in new tab which handles redirects better
//       if (pdfUrl.includes("cloudinary.com")) {
//         // If it's already a Cloudinary URL, open directly
//         window.open(pdfUrl, "_blank");
//       } else {
//         // Otherwise use fetch with redirect
//         const response = await fetch(pdfUrl, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           redirect: "follow",
//         });

//         if (!response.ok) throw new Error("Download failed");

//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = `${bookTitle || "book"}.pdf`;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         window.URL.revokeObjectURL(url);
//       }
//     } catch (err) {
//       console.error("Download error:", err);
//       alert("Failed to download PDF. Try opening in new tab instead.");

//       // Fallback: open in new tab
//       window.open(pdfUrl, "_blank");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-lg shadow-xl">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading PDF Reader...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-lg shadow-xl max-w-md">
//           <div className="text-red-600 text-center mb-4">
//             <svg
//               className="h-16 w-16 mx-auto"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//               />
//             </svg>
//           </div>
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">
//             Failed to Load PDF
//           </h3>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <div className="flex flex-col space-y-2">
//             <button
//               onClick={() => {
//                 // Try opening directly in new tab as fallback
//                 window.open(pdfUrl, "_blank");
//                 onClose();
//               }}
//               className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               Open in New Tab
//             </button>
//             <div className="flex space-x-2">
//               <button
//                 onClick={handleDownload}
//                 className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//               >
//                 Download
//               </button>
//               <button
//                 onClick={onClose}
//                 className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
//       {/* PDF Toolbar */}
//       <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
//           >
//             <svg
//               className="h-5 w-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </button>
//           <span className="font-medium">{bookTitle || "PDF Reader"}</span>
//         </div>
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={handleDownload}
//             className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium flex items-center"
//           >
//             <svg
//               className="h-4 w-4 mr-1"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//               />
//             </svg>
//             Download
//           </button>
//         </div>
//       </div>

//       {/* PDF Viewer */}
//       <div className="flex-1 bg-gray-800">
//         {pdfData ? (
//           <iframe
//             src={`${pdfData}#toolbar=0&navpanes=0`}
//             className="w-full h-full"
//             title={bookTitle}
//           />
//         ) : (
//           <div className="flex items-center justify-center h-full text-white">
//             Failed to load PDF
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */

// import { useEffect } from "react";

// export default function PDFReader({ pdfUrl, bookTitle, onClose }) {
//   useEffect(() => {
//     // Open PDF in new tab
//     window.open(pdfUrl, "_blank", "noopener,noreferrer");
//     // Close the modal immediately
//     onClose();
//   }, [pdfUrl, onClose]);

//   // Don't render anything - just a trigger component
//   return null;
// }



/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

// import { useEffect } from "react";

// export default function PDFReader({ pdfUrl, bookTitle, onClose }) {
//   useEffect(() => {
//     // Add #toolbar=0 to hide download button in browser PDF viewer
//     const pdfViewerUrl = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`;
//     window.open(pdfViewerUrl, "_blank", "noopener,noreferrer");
//     onClose();
//   }, [pdfUrl, onClose]);

//   return null;
// }



/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PDFViewer({ pdfUrl, bookTitle, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        setLoading(true);
        
        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        
        setNumPages(pdf.numPages);
        
        // Load first page
        await renderPage(pdf, 1);
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading PDF:", err);
        setError("Failed to load PDF. Please try again.");
        setLoading(false);
      }
    };

    loadPDF();
  }, [pdfUrl]);

  const renderPage = async (pdf, pageNum) => {
    try {
      // Get the page
      const page = await pdf.getPage(pageNum);
      
      // Set scale based on container width
      const container = containerRef.current;
      const scale = container ? container.clientWidth / page.getViewport({ scale: 1 }).width : 1.5;
      const viewport = page.getViewport({ scale });
      
      // Prepare canvas
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      // Render the page
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
    } catch (err) {
      console.error("Error rendering page:", err);
    }
  };

  const handlePrevPage = () => {
    if (pageNumber <= 1) return;
    setPageNumber(prev => prev - 1);
    // Reload page when page changes
    setTimeout(async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        await renderPage(pdf, pageNumber - 1);
      } catch (err) {
        console.error("Error loading page:", err);
      }
    }, 100);
  };

  const handleNextPage = () => {
    if (pageNumber >= numPages) return;
    setPageNumber(prev => prev + 1);
    setTimeout(async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        await renderPage(pdf, pageNumber + 1);
      } catch (err) {
        console.error("Error loading page:", err);
      }
    }, 100);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading PDF...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we prepare your document</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md">
          <div className="text-red-600 text-center mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load PDF</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Custom Toolbar - No download button! */}
      <div className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="font-medium truncate max-w-md">{bookTitle}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-300">
            Page {pageNumber} of {numPages}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={pageNumber <= 1}
              className={`p-2 rounded-lg transition-colors ${
                pageNumber <= 1 
                  ? 'text-gray-600 cursor-not-allowed' 
                  : 'hover:bg-gray-700 text-white'
              }`}
              title="Previous page"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNextPage}
              disabled={pageNumber >= numPages}
              className={`p-2 rounded-lg transition-colors ${
                pageNumber >= numPages 
                  ? 'text-gray-600 cursor-not-allowed' 
                  : 'hover:bg-gray-700 text-white'
              }`}
              title="Next page"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* PDF Canvas Container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto bg-gray-900 flex justify-center p-4"
        onContextMenu={(e) => e.preventDefault()} // Disable right-click
      >
        <canvas 
          ref={canvasRef} 
          className="shadow-2xl rounded-lg"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

      {/* Watermark */}
      <div className="absolute bottom-4 right-4 text-gray-600 text-xs opacity-50 pointer-events-none">
        Library Management System
      </div>
    </div>
  );
}