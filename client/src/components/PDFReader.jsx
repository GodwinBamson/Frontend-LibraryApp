/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PDFReader({ pdfUrl, bookTitle, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pdfData, setPdfData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchPdf = async () => {
      try {
        setLoading(true);

        // If it's a Cloudinary URL (production), open directly
        if (pdfUrl.includes("cloudinary.com")) {
          // For Cloudinary URLs, we can open directly in new tab
          // or use fetch with proper headers
          setPdfData(pdfUrl); // Store URL directly for iframe
          setLoading(false);
          return;
        }

        // For local server URLs, use fetch with auth
        const response = await fetch(pdfUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          redirect: "follow",
          mode: "cors",
          credentials: "omit",
        });

        if (!response.ok) {
          throw new Error(`Failed to load PDF: ${response.status}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfData(url);
        setLoading(false);
      } catch (err) {
        console.error("PDF loading error:", err);

        // Fallback: try opening directly in new tab
        window.open(pdfUrl, "_blank");
        onClose(); // Close the modal since we opened in new tab
      }
    };

    fetchPdf();

    return () => {
      if (pdfData && !pdfData.includes("cloudinary.com")) {
        URL.revokeObjectURL(pdfData);
      }
    };
  }, [pdfUrl, navigate]);

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");

      // For download, we can open in new tab which handles redirects better
      if (pdfUrl.includes("cloudinary.com")) {
        // If it's already a Cloudinary URL, open directly
        window.open(pdfUrl, "_blank");
      } else {
        // Otherwise use fetch with redirect
        const response = await fetch(pdfUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          redirect: "follow",
        });

        if (!response.ok) throw new Error("Download failed");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${bookTitle || "book"}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download PDF. Try opening in new tab instead.");

      // Fallback: open in new tab
      window.open(pdfUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading PDF Reader...</p>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to Load PDF
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => {
                // Try opening directly in new tab as fallback
                window.open(pdfUrl, "_blank");
                onClose();
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Open in New Tab
            </button>
            <div className="flex space-x-2">
              <button
                onClick={handleDownload}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Download
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      {/* PDF Toolbar */}
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
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
          <span className="font-medium">{bookTitle || "PDF Reader"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium flex items-center"
          >
            <svg
              className="h-4 w-4 mr-1"
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
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 bg-gray-800">
        {pdfData ? (
          <iframe
            src={`${pdfData}#toolbar=0&navpanes=0`}
            className="w-full h-full"
            title={bookTitle}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            Failed to load PDF
          </div>
        )}
      </div>
    </div>
  );
}




