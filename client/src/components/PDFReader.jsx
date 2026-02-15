import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PDFReader({ pdfUrl, bookTitle, onClose }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Preload PDF
        const checkPdf = async () => {
            try {
                const response = await fetch(pdfUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to load PDF');
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to load PDF file');
                setLoading(false);
            }
        };

        checkPdf();
    }, [pdfUrl, navigate]);

    const handleDownload = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(pdfUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) throw new Error('Download failed');
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${bookTitle || 'book'}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert('Failed to download PDF');
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
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
            {/* PDF Toolbar */}
            <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <span className="font-medium">{bookTitle || 'PDF Reader'}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleDownload}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium flex items-center"
                    >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                    </button>
                </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 bg-gray-800">
                <iframe
                    src={`${pdfUrl}#toolbar=0&navpanes=0`}
                    className="w-full h-full"
                    title={bookTitle}
                />
            </div>
        </div>
    );
}