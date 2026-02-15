import { useState } from 'react';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default function TestUpload() {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            console.log('📎 File selected:', e.target.files[0].name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!file) {
            alert('Please select a file');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('pdfFile', file);
        formData.append('title', 'Test Book');
        formData.append('author', 'Test Author');
        formData.append('isbn', '1234567890');
        formData.append('description', 'Test Description');
        formData.append('category', 'Science');
        formData.append('publishedYear', '2026');
        formData.append('totalCopies', '1');

        console.log('📤 Sending test upload...');

        try {
            const res = await api.post('/books/test-upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('✅ Response:', res.data);
            setResponse(res.data);
            
            if (res.data.file) {
                alert('✅ File uploaded successfully!');
            } else {
                alert('❌ No file received by server');
            }
        } catch (error) {
            console.error('❌ Error:', error);
            setResponse({ error: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">Test File Upload</h1>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select PDF File:
                        </label>
                        <input
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? 'Uploading...' : 'Test Upload'}
                    </button>
                </form>

                {response && (
                    <div className="mt-6 p-4 bg-gray-100 rounded-md">
                        <h2 className="font-bold mb-2">Response:</h2>
                        <pre className="text-sm overflow-auto whitespace-pre-wrap">
                            {JSON.stringify(response, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}



// import { useState } from 'react';
// import axios from 'axios';

// const api = axios.create({
//     baseURL: 'http://localhost:5000/api',
// });

// // Add auth token
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
    
//     // IMPORTANT: Don't set Content-Type for FormData
//     if (config.data instanceof FormData) {
//         delete config.headers['Content-Type'];
//     }
    
//     return config;
// });

// export default function TestUpload() {
//     const [file, setFile] = useState(null);
//     const [response, setResponse] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [uploadType, setUploadType] = useState('test'); // 'test' or 'create'

//     const handleFileChange = (e) => {
//         if (e.target.files[0]) {
//             const selectedFile = e.target.files[0];
            
//             // Validate file type
//             if (selectedFile.type !== 'application/pdf') {
//                 alert('Please select a PDF file');
//                 e.target.value = '';
//                 return;
//             }
            
//             // Validate file size (50MB)
//             if (selectedFile.size > 50 * 1024 * 1024) {
//                 alert('File size must be less than 50MB');
//                 e.target.value = '';
//                 return;
//             }
            
//             setFile(selectedFile);
//             console.log('📎 File selected:', {
//                 name: selectedFile.name,
//                 type: selectedFile.type,
//                 size: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
//             });
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         if (!file) {
//             alert('Please select a file');
//             return;
//         }

//         // Check if user is logged in
//         const token = localStorage.getItem('token');
//         if (!token) {
//             alert('You must be logged in as admin');
//             return;
//         }

//         setLoading(true);
        
//         const formData = new FormData();
//         formData.append('pdfFile', file);
        
//         if (uploadType === 'create') {
//             // Add book data for create
//             formData.append('title', 'Test Book ' + Date.now());
//             formData.append('author', 'Test Author');
//             formData.append('isbn', 'TEST' + Date.now());
//             formData.append('description', 'Test Description');
//             formData.append('category', 'Science');
//             formData.append('publishedYear', '2026');
//             formData.append('totalCopies', '1');
//             formData.append('publisher', 'Test Publisher');
//             formData.append('coverImage', '');
            
//             console.log('📤 Testing full book creation...');
//         } else {
//             console.log('📤 Testing file upload only...');
//         }

//         // Log FormData contents
//         console.log('📦 FormData contents:');
//         for (let pair of formData.entries()) {
//             if (pair[0] === 'pdfFile') {
//                 console.log(`   📎 ${pair[0]}:`, pair[1] instanceof File ? 
//                     `File: ${pair[1].name} (${pair[1].type})` : pair[1]);
//             } else {
//                 console.log(`   📝 ${pair[0]}:`, pair[1]);
//             }
//         }

//         try {
//             const endpoint = uploadType === 'create' ? '/books' : '/books/test-upload';
//             console.log(`📤 Sending to: ${endpoint}`);
            
//             const res = await api.post(endpoint, formData);
            
//             console.log('✅ Response:', res.data);
//             setResponse(res.data);
            
//             // Check if file was uploaded
//             if (res.data.file && res.data.file !== 'No file uploaded') {
//                 alert('✅ File uploaded successfully!');
                
//                 // Show Cloudinary URL if available
//                 if (res.data.file.path) {
//                     console.log('🔗 Cloudinary URL:', res.data.file.path);
//                 }
//             } else {
//                 alert('⚠️ File may not have been uploaded. Check response.');
//             }
//         } catch (error) {
//             console.error('❌ Error:', error);
            
//             let errorMessage = error.message;
//             if (error.response) {
//                 errorMessage = error.response.data?.message || error.response.statusText;
//                 console.error('Server response:', error.response.data);
//             }
            
//             setResponse({ 
//                 success: false,
//                 error: errorMessage,
//                 details: error.response?.data || 'No additional details'
//             });
            
//             alert(`❌ Error: ${errorMessage}`);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 p-8">
//             <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
//                 <h1 className="text-2xl font-bold mb-6">Test File Upload with Cloudinary</h1>
                
//                 <div className="mb-6">
//                     <div className="flex space-x-4 border-b pb-4">
//                         <label className="flex items-center">
//                             <input
//                                 type="radio"
//                                 value="test"
//                                 checked={uploadType === 'test'}
//                                 onChange={(e) => setUploadType(e.target.value)}
//                                 className="mr-2"
//                             />
//                             <span className="text-sm font-medium">Test Upload Only</span>
//                         </label>
//                         <label className="flex items-center">
//                             <input
//                                 type="radio"
//                                 value="create"
//                                 checked={uploadType === 'create'}
//                                 onChange={(e) => setUploadType(e.target.value)}
//                                 className="mr-2"
//                             />
//                             <span className="text-sm font-medium">Full Book Creation</span>
//                         </label>
//                     </div>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* File Input */}
//                     <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Select PDF File: *
//                         </label>
//                         <input
//                             type="file"
//                             accept=".pdf,application/pdf"
//                             onChange={handleFileChange}
//                             className="w-full p-2 border border-gray-300 rounded-md"
//                             required
//                         />
//                         {file && (
//                             <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
//                                 <div className="flex items-center">
//                                     <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                                     </svg>
//                                     <span className="text-sm font-medium text-gray-700">
//                                         {file.name}
//                                     </span>
//                                     <span className="ml-auto text-xs text-gray-500">
//                                         {(file.size / 1024 / 1024).toFixed(2)} MB
//                                     </span>
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Auth Status */}
//                     <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
//                         <div className="flex items-center">
//                             <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                             <span className="text-sm text-blue-700">
//                                 Auth Status: {localStorage.getItem('token') ? '✅ Logged in' : '❌ Not logged in'}
//                             </span>
//                         </div>
//                     </div>

//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
//                     >
//                         {loading ? (
//                             <span className="flex items-center justify-center">
//                                 <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
//                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                                 </svg>
//                                 Uploading to Cloudinary...
//                             </span>
//                         ) : (
//                             uploadType === 'create' ? 'Create Test Book with PDF' : 'Test Upload to Cloudinary'
//                         )}
//                     </button>
//                 </form>

//                 {response && (
//                     <div className="mt-6">
//                         <h2 className="font-bold mb-2">Response from Server:</h2>
//                         <div className="p-4 bg-gray-100 rounded-md overflow-auto max-h-96">
//                             <pre className="text-sm whitespace-pre-wrap">
//                                 {JSON.stringify(response, null, 2)}
//                             </pre>
//                         </div>
                        
//                         {/* Quick Summary */}
//                         <div className="mt-4 grid grid-cols-2 gap-4">
//                             <div className="p-3 bg-green-50 border border-green-200 rounded-md">
//                                 <h3 className="font-medium text-sm mb-1">File Upload Status</h3>
//                                 <p className="text-xs">
//                                     {response.file && response.file !== 'No file uploaded' ? (
//                                         <span className="text-green-600">✅ File received</span>
//                                     ) : (
//                                         <span className="text-red-600">❌ No file received</span>
//                                     )}
//                                 </p>
//                             </div>
//                             <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
//                                 <h3 className="font-medium text-sm mb-1">Cloudinary URL</h3>
//                                 <p className="text-xs truncate">
//                                     {response.file?.path ? (
//                                         <a href={response.file.path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//                                             View PDF
//                                         </a>
//                                     ) : (
//                                         'No URL'
//                                     )}
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }