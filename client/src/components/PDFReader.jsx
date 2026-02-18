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

    // For Cloudinary URLs (production)
    if (pdfUrl && pdfUrl.includes("cloudinary.com")) {
      setPdfData(pdfUrl);
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
        console.error("PDF loading error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPdf();

    return () => {
      if (pdfData && !pdfData.includes("cloudinary.com")) {
        URL.revokeObjectURL(pdfData);
      }
    };
  }, [pdfUrl, navigate]);

  // Function to open in new tab with disabled features
  const openInNewTab = () => {
    if (pdfData) {
      // Add parameters to disable toolbar, nav panes, and scrollbar
      const viewerUrl = pdfData.includes("cloudinary.com")
        ? `${pdfData}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`
        : `${pdfData}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;

      window.open(viewerUrl, "_blank");
      onClose();
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
          <div className="flex space-x-2">
            <button
              onClick={openInNewTab}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Open in New Tab
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
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      {/* PDF Toolbar - Only Close Button and Open in New Tab */}
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
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
          <span className="font-medium">{bookTitle || "PDF Reader"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={openInNewTab}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium flex items-center"
            title="Open in New Tab (No Download/Print)"
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
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Open in New Tab
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 bg-gray-800">
        {pdfData ? (
          <iframe
            src={
              pdfData.includes("cloudinary.com")
                ? `${pdfData}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`
                : `${pdfData}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`
            }
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
