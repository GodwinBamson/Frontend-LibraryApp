// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// export default function PDFReader({ pdfUrl, bookTitle, onClose }) {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [pdfData, setPdfData] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     // For Cloudinary URLs (production)
//     if (pdfUrl && pdfUrl.includes("cloudinary.com")) {
//       setPdfData(pdfUrl);
//       setLoading(false);
//       return;
//     }

//     // For local server, we need token
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     const fetchPdf = async () => {
//       try {
//         setLoading(true);

//         const response = await fetch(pdfUrl, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           redirect: "follow",
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
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchPdf();

//     return () => {
//       if (pdfData && !pdfData.includes("cloudinary.com")) {
//         URL.revokeObjectURL(pdfData);
//       }
//     };
//   }, [pdfUrl, navigate]);

//   // Function to open in new tab with disabled features
//   const openInNewTab = () => {
//     if (pdfData) {
//       // Add parameters to disable toolbar, nav panes, and scrollbar
//       const viewerUrl = pdfData.includes("cloudinary.com")
//         ? `${pdfData}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`
//         : `${pdfData}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;

//       window.open(viewerUrl, "_blank");
//       onClose();
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
//           <div className="flex space-x-2">
//             <button
//               onClick={openInNewTab}
//               className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               Open in New Tab
//             </button>
//             <button
//               onClick={onClose}
//               className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
//       {/* PDF Toolbar - Only Close Button and Open in New Tab */}
//       <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
//             title="Close"
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
//             onClick={openInNewTab}
//             className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium flex items-center"
//             title="Open in New Tab (No Download/Print)"
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
//                 d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
//               />
//             </svg>
//             Open in New Tab
//           </button>
//         </div>
//       </div>

//       {/* PDF Viewer */}
//       <div className="flex-1 bg-gray-800">
//         {pdfData ? (
//           <iframe
//             src={
//               pdfData.includes("cloudinary.com")
//                 ? `${pdfData}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`
//                 : `${pdfData}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`
//             }
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




/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function PDFReader({ 
  pdfUrl, 
  bookTitle, 
  onClose,
  bookId,
  fallbackUrl,
  mobileRedirectUrl 
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pdfData, setPdfData] = useState(null);
  const [useGoogleViewer, setUseGoogleViewer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const iframeRef = useRef(null);
  const navigate = useNavigate();

  // Detect mobile device
  useEffect(() => {
    const mobile = /iPhone|iPad|iPod|Android|BlackBerry|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
    setIsMobile(mobile);
    console.log("📱 Device Info:", {
      userAgent: navigator.userAgent,
      isMobile: mobile,
      platform: navigator.platform,
      vendor: navigator.vendor
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    console.log("📄 PDF Reader mounted with URL:", pdfUrl);
    console.log("📱 Is mobile:", isMobile);

    // For Cloudinary URLs (production)
    if (pdfUrl && pdfUrl.includes("cloudinary.com")) {
      console.log("☁️ Cloudinary URL detected");
      
      // Add mobile-friendly parameters
      let finalUrl = pdfUrl;
      
      // Add fl_attachment=false to prevent download, and viewer parameters
      if (pdfUrl.includes('?')) {
        finalUrl = `${pdfUrl}&fl_attachment=false#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;
      } else {
        finalUrl = `${pdfUrl}?fl_attachment=false#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;
      }
      
      setPdfData(finalUrl);
      setLoading(false);
      return;
    }

    // For local server, we need token
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchPdf = async () => {
      try {
        setLoading(true);
        console.log("📥 Fetching PDF from:", pdfUrl);

        const response = await fetch(pdfUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          redirect: "follow",
        });

        if (!response.ok) {
          throw new Error(`Failed to load PDF: ${response.status}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfData(url);
        setLoading(false);
      } catch (err) {
        console.error("❌ PDF loading error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPdf();

    return () => {
      if (pdfData && !pdfData.includes("cloudinary.com") && !pdfData.startsWith('blob:')) {
        URL.revokeObjectURL(pdfData);
      }
    };
  }, [pdfUrl, navigate, isMobile]);

  // Handle iframe errors
  const handleIframeError = () => {
    console.log("❌ Iframe failed to load PDF");
    setError("Failed to load PDF in viewer. Your browser may not support embedded PDFs.");
    setLoading(false);
    
    // Auto-try Google Viewer for mobile after error
    if (isMobile && !useGoogleViewer) {
      console.log("🔄 Auto-switching to Google Viewer for mobile");
      setUseGoogleViewer(true);
    }
  };

  const handleIframeLoad = () => {
    console.log("✅ Iframe loaded successfully");
    setLoading(false);
    setError("");
  };

  // Function to open in new tab
  const openInNewTab = () => {
    if (pdfData) {
      let viewerUrl;
      
      if (pdfData.includes("cloudinary.com")) {
        viewerUrl = pdfData.includes('?') 
          ? `${pdfData}&fl_attachment=false#toolbar=0&navpanes=0&scrollbar=0&view=FitH`
          : `${pdfData}?fl_attachment=false#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;
      } else {
        viewerUrl = pdfData;
      }

      window.open(viewerUrl, "_blank");
    }
  };

  // Function to download PDF
  const downloadPdf = () => {
    const link = document.createElement('a');
    link.href = pdfData || fallbackUrl || pdfUrl;
    link.download = `${bookTitle || 'book'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to retry with Google Viewer
  const retryWithGoogleViewer = () => {
    setUseGoogleViewer(true);
    setLoading(true);
    setError("");
  };

  // Function to retry with proxy
  const retryWithProxy = () => {
    if (bookId) {
      const baseUrl = import.meta.env.PROD 
        ? "https://library-server-5rpq.onrender.com" 
        : "http://localhost:5000";
      
      const proxyUrl = `${baseUrl}/api/pdf-proxy/${bookId}`;
      setPdfData(proxyUrl);
      setLoading(true);
      setError("");
      setUseGoogleViewer(false);
    }
  };

  // Function to retry with mobile redirect
  const retryWithMobileRedirect = () => {
    if (mobileRedirectUrl) {
      window.location.href = mobileRedirectUrl;
    }
  };

  // Get Google Docs viewer URL
  const getGoogleViewerUrl = () => {
    const urlToUse = fallbackUrl || pdfUrl || pdfData;
    // Make sure URL is properly encoded
    const encodedUrl = encodeURIComponent(urlToUse);
    return `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;
  };

  // Determine which URL to display
  const getDisplayUrl = () => {
    if (useGoogleViewer) {
      return getGoogleViewerUrl();
    }
    return pdfData;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-center">
            {isMobile ? "Loading PDF for mobile..." : "Loading PDF Reader..."}
          </p>
          {isMobile && (
            <div className="mt-4 text-sm text-gray-500 text-center">
              <p>This may take a moment on mobile devices</p>
              <button
                onClick={downloadPdf}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 w-full"
              >
                Download Instead
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md">
          <div className="text-red-600 text-center mb-4">
            <svg
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
            Failed to Load PDF
          </h3>
          <p className="text-gray-600 mb-4 text-center">{error}</p>
          
          <div className="space-y-2">
            {isMobile && (
              <>
                <button
                  onClick={retryWithGoogleViewer}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Try Google Viewer (Recommended)
                </button>
                
                {bookId && (
                  <button
                    onClick={retryWithProxy}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Retry with Mobile Proxy
                  </button>
                )}
                
                {mobileRedirectUrl && (
                  <button
                    onClick={retryWithMobileRedirect}
                    className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                  >
                    Open in Browser
                  </button>
                )}
              </>
            )}
            
            <button
              onClick={downloadPdf}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Download PDF
            </button>
            
            <button
              onClick={openInNewTab}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Open in New Tab
            </button>
            
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      {/* PDF Toolbar */}
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Close"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <span className="font-medium truncate max-w-xs md:max-w-md">{bookTitle || "PDF Reader"}</span>
          {isMobile && (
            <span className="bg-purple-600 text-xs px-2 py-1 rounded-full">
              📱 Mobile
            </span>
          )}
          {useGoogleViewer && (
            <span className="bg-blue-600 text-xs px-2 py-1 rounded-full">
              Google Viewer
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          {isMobile && !useGoogleViewer && (
            <button
              onClick={retryWithGoogleViewer}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium"
              title="Try Google Viewer for better mobile compatibility"
            >
              Google Viewer
            </button>
          )}
          
          <button
            onClick={downloadPdf}
            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium"
            title="Download PDF"
          >
            <svg
              className="h-4 w-4 inline mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download
          </button>
          
          <button
            onClick={openInNewTab}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm font-medium"
            title="Open in New Tab"
          >
            <svg
              className="h-4 w-4 inline mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            New Tab
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 bg-gray-800 relative">
        {pdfData ? (
          <iframe
            ref={iframeRef}
            src={getDisplayUrl()}
            className="w-full h-full"
            title={bookTitle}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            Failed to load PDF
          </div>
        )}
      </div>

      {/* Mobile Instructions */}
      {isMobile && !useGoogleViewer && (
        <div className="bg-yellow-50 border-t px-4 py-2 text-xs text-gray-600 flex flex-wrap justify-between items-center gap-2">
          <span>
            💡 Having trouble? Try the Google Viewer button or Download.
          </span>
          <div className="flex gap-2">
            {bookId && (
              <button
                onClick={retryWithProxy}
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                Proxy
              </button>
            )}
            {mobileRedirectUrl && (
              <button
                onClick={retryWithMobileRedirect}
                className="text-orange-600 hover:text-orange-800 font-medium"
              >
                Browser
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}