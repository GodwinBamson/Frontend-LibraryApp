// import { useState, useEffect } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { bookAPI, borrowAPI } from '../services/api';
// import { ArrowLeftIcon, BookOpenIcon, CalendarIcon, UserIcon, HashtagIcon } from '@heroicons/react/24/outline';

// export default function BookDetail() {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [book, setBook] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [borrowing, setBorrowing] = useState(false);
//     const user = JSON.parse(localStorage.getItem('user'));

//     useEffect(() => {
//         fetchBook();
//     }, [id]);

//     const fetchBook = async () => {
//         try {
//             setLoading(true);
//             const response = await bookAPI.getBookById(id);
//             setBook(response.data);
//         } catch (err) {
//             setError('Book not found or error loading details');
//             console.error('Error fetching book:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleBorrow = async () => {
//         if (!user) {
//             navigate('/login');
//             return;
//         }

//         if (user.role !== 'student') {
//             alert('Only students can borrow books');
//             return;
//         }

//         if (book.availableCopies < 1) {
//             alert('No copies available for borrowing');
//             return;
//         }

//         try {
//             setBorrowing(true);
//             await borrowAPI.borrowBook(id);
//             alert('Book borrowed successfully! You have 14 days to return it.');
//             fetchBook(); // Refresh book data
//         } catch (err) {
//             alert(err.response?.data?.message || 'Failed to borrow book');
//         } finally {
//             setBorrowing(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="container mx-auto px-4 py-12">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//                     <p className="mt-4 text-gray-600">Loading book details...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error || !book) {
//         return (
//             <div className="container mx-auto px-4 py-12">
//                 <div className="text-center">
//                     <div className="text-red-600 mb-4">{error || 'Book not found'}</div>
//                     <Link
//                         to="/books"
//                         className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
//                     >
//                         <ArrowLeftIcon className="h-5 w-5 mr-2" />
//                         Back to Books
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="mb-6">
//                 <Link
//                     to="/books"
//                     className="inline-flex items-center text-gray-600 hover:text-gray-900"
//                 >
//                     <ArrowLeftIcon className="h-5 w-5 mr-2" />
//                     Back to All Books
//                 </Link>
//             </div>

//             <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//                 <div className="md:flex">
//                     {/* Book Cover */}
//                     <div className="md:w-1/3 p-8 bg-gray-50 flex items-center justify-center">
//                         {book.coverImage ? (
//                             <img
//                                 src={book.coverImage}
//                                 alt={book.title}
//                                 className="w-64 h-auto rounded-lg shadow-md"
//                             />
//                         ) : (
//                             <div className="w-64 h-80 bg-indigo-100 rounded-lg flex items-center justify-center">
//                                 <BookOpenIcon className="h-32 w-32 text-indigo-300" />
//                             </div>
//                         )}
//                     </div>

//                     {/* Book Details */}
//                     <div className="md:w-2/3 p-8">
//                         <div className="flex justify-between items-start mb-6">
//                             <div>
//                                 <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
//                                 <div className="flex items-center text-gray-600 mb-4">
//                                     <UserIcon className="h-5 w-5 mr-2" />
//                                     <span className="text-lg">{book.author}</span>
//                                 </div>
//                             </div>
//                             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
//                                 {book.category}
//                             </span>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                             <div className="flex items-center text-gray-700">
//                                 <HashtagIcon className="h-5 w-5 mr-2 text-gray-400" />
//                                 <span className="font-medium">ISBN:</span>
//                                 <span className="ml-2">{book.isbn}</span>
//                             </div>
//                             <div className="flex items-center text-gray-700">
//                                 <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
//                                 <span className="font-medium">Published:</span>
//                                 <span className="ml-2">{book.publishedYear}</span>
//                             </div>
//                             {book.publisher && (
//                                 <div className="flex items-center text-gray-700">
//                                     <span className="font-medium">Publisher:</span>
//                                     <span className="ml-2">{book.publisher}</span>
//                                 </div>
//                             )}
//                             <div className="flex items-center text-gray-700">
//                                 <span className="font-medium">Copies Available:</span>
//                                 <span className={`ml-2 font-semibold ${
//                                     book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'
//                                 }`}>
//                                     {book.availableCopies} / {book.totalCopies}
//                                 </span>
//                             </div>
//                         </div>

//                         <div className="mb-8">
//                             <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
//                             <p className="text-gray-700 leading-relaxed whitespace-pre-line">
//                                 {book.description}
//                             </p>
//                         </div>

//                         <div className="border-t border-gray-200 pt-6">
//                             <div className="flex flex-col md:flex-row justify-between items-center">
//                                 <div className="mb-4 md:mb-0">
//                                     {book.availableCopies > 0 ? (
//                                         <div className="text-green-600 font-medium">
//                                             ✓ Available for borrowing
//                                         </div>
//                                     ) : (
//                                         <div className="text-red-600 font-medium">
//                                             ✗ Currently unavailable
//                                         </div>
//                                     )}
//                                     <p className="text-sm text-gray-500 mt-1">
//                                         Borrow period: 14 days
//                                     </p>
//                                 </div>

//                                 <div className="flex space-x-4">
//                                     {book.pdfUrl && (
//                                         <a
//                                             href={book.pdfUrl}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                             className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors"
//                                         >
//                                             <BookOpenIcon className="h-5 w-5 mr-2" />
//                                             Read Online
//                                         </a>
//                                     )}

//                                     {user?.role === 'student' && book.availableCopies > 0 && (
//                                         <button
//                                             onClick={handleBorrow}
//                                             disabled={borrowing}
//                                             className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                                         >
//                                             {borrowing ? (
//                                                 <>
//                                                     <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                                                     Processing...
//                                                 </>
//                                             ) : (
//                                                 'Borrow This Book'
//                                             )}
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>

//                             {user?.role === 'admin' && (
//                                 <div className="mt-6 pt-6 border-t border-gray-200">
//                                     <div className="flex space-x-4">
//                                         <Link
//                                             to={`/admin/books`}
//                                             onClick={() => {
//                                                 // You could pass the book data to edit
//                                                 localStorage.setItem('editBook', JSON.stringify(book));
//                                             }}
//                                             className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
//                                         >
//                                             Edit Details
//                                         </Link>
//                                         <button className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50">
//                                             Delete Book
//                                         </button>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Additional Information */}
//             <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="bg-white rounded-lg shadow p-6">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Borrowing Information</h3>
//                     <ul className="space-y-2 text-gray-600">
//                         <li className="flex items-start">
//                             <div className="h-5 w-5 text-green-500 mr-2">✓</div>
//                             <span>Maximum borrow period: 14 days</span>
//                         </li>
//                         <li className="flex items-start">
//                             <div className="h-5 w-5 text-green-500 mr-2">✓</div>
//                             <span>Renewals may be available upon request</span>
//                         </li>
//                         <li className="flex items-start">
//                             <div className="h-5 w-5 text-green-500 mr-2">✓</div>
//                             <span>Late returns may incur penalties</span>
//                         </li>
//                         <li className="flex items-start">
//                             <div className="h-5 w-5 text-green-500 mr-2">✓</div>
//                             <span>Books must be returned in good condition</span>
//                         </li>
//                     </ul>
//                 </div>

//                 <div className="bg-white rounded-lg shadow p-6">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Details</h3>
//                     <dl className="space-y-2">
//                         <div className="flex justify-between">
//                             <dt className="text-gray-600">Added to Library</dt>
//                             <dd className="text-gray-900 font-medium">
//                                 {new Date(book.createdAt).toLocaleDateString()}
//                             </dd>
//                         </div>
//                         <div className="flex justify-between">
//                             <dt className="text-gray-600">Last Updated</dt>
//                             <dd className="text-gray-900 font-medium">
//                                 {new Date(book.updatedAt).toLocaleDateString()}
//                             </dd>
//                         </div>
//                         <div className="flex justify-between">
//                             <dt className="text-gray-600">Status</dt>
//                             <dd className="text-gray-900 font-medium">
//                                 {book.availableCopies > 0 ? 'Available' : 'Checked Out'}
//                             </dd>
//                         </div>
//                     </dl>
//                 </div>
//             </div>
//         </div>
//     );
// }




// import { useState, useEffect } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { bookAPI, borrowAPI } from '../services/api';
// import { ArrowLeftIcon, BookIcon, CalendarIcon, UserIcon, HashtagIcon } from '../components/Icons';

// export default function BookDetail() {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [book, setBook] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [borrowing, setBorrowing] = useState(false);
//     const user = JSON.parse(localStorage.getItem('user'));

//     useEffect(() => {
//         fetchBook();
//     }, [id]);

//     const fetchBook = async () => {
//         try {
//             setLoading(true);
//             const response = await bookAPI.getBookById(id);
//             setBook(response.data);
//         } catch (err) {
//             setError('Book not found or error loading details');
//             console.error('Error fetching book:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleBorrow = async () => {
//         if (!user) {
//             navigate('/login');
//             return;
//         }

//         if (user.role !== 'student') {
//             alert('Only students can borrow books');
//             return;
//         }

//         if (book.availableCopies < 1) {
//             alert('No copies available for borrowing');
//             return;
//         }

//         try {
//             setBorrowing(true);
//             await borrowAPI.borrowBook(id);
//             alert('Book borrowed successfully! You have 14 days to return it.');
//             fetchBook(); // Refresh book data
//         } catch (err) {
//             alert(err.response?.data?.message || 'Failed to borrow book');
//         } finally {
//             setBorrowing(false);
//         }
//     };

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric'
//         });
//     };

//     if (loading) {
//         return (
//             <div className="container mx-auto px-4 py-12">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//                     <p className="mt-4 text-gray-600">Loading book details...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error || !book) {
//         return (
//             <div className="container mx-auto px-4 py-12">
//                 <div className="text-center">
//                     <div className="text-red-600 mb-4">{error || 'Book not found'}</div>
//                     <Link
//                         to="/books"
//                         className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
//                     >
//                         <ArrowLeftIcon />
//                         <span className="ml-2">Back to Books</span>
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="mb-6">
//                 <Link
//                     to="/books"
//                     className="inline-flex items-center text-gray-600 hover:text-gray-900"
//                 >
//                     <ArrowLeftIcon />
//                     <span className="ml-2">Back to All Books</span>
//                 </Link>
//             </div>

//             <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//                 <div className="md:flex">
//                     {/* Book Cover */}
//                     <div className="md:w-1/3 p-8 bg-gray-50 flex items-center justify-center">
//                         {book.coverImage ? (
//                             <img
//                                 src={book.coverImage}
//                                 alt={book.title}
//                                 className="w-64 h-auto rounded-lg shadow-md"
//                             />
//                         ) : (
//                             <div className="w-64 h-80 bg-indigo-100 rounded-lg flex items-center justify-center">
//                                 <BookIcon className="h-32 w-32 text-indigo-300" />
//                             </div>
//                         )}
//                     </div>

//                     {/* Book Details */}
//                     <div className="md:w-2/3 p-8">
//                         <div className="flex justify-between items-start mb-6">
//                             <div>
//                                 <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
//                                 <div className="flex items-center text-gray-600 mb-4">
//                                     <UserIcon />
//                                     <span className="ml-2 text-lg">{book.author}</span>
//                                 </div>
//                             </div>
//                             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
//                                 {book.category}
//                             </span>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                             <div className="flex items-center text-gray-700">
//                                 <HashtagIcon />
//                                 <span className="ml-2 font-medium">ISBN:</span>
//                                 <span className="ml-2">{book.isbn}</span>
//                             </div>
//                             <div className="flex items-center text-gray-700">
//                                 <CalendarIcon />
//                                 <span className="ml-2 font-medium">Published:</span>
//                                 <span className="ml-2">{book.publishedYear}</span>
//                             </div>
//                             {book.publisher && (
//                                 <div className="flex items-center text-gray-700">
//                                     <span className="font-medium">Publisher:</span>
//                                     <span className="ml-2">{book.publisher}</span>
//                                 </div>
//                             )}
//                             <div className="flex items-center text-gray-700">
//                                 <span className="font-medium">Copies Available:</span>
//                                 <span className={`ml-2 font-semibold ${
//                                     book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'
//                                 }`}>
//                                     {book.availableCopies} / {book.totalCopies}
//                                 </span>
//                             </div>
//                         </div>

//                         <div className="mb-8">
//                             <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
//                             <p className="text-gray-700 leading-relaxed whitespace-pre-line">
//                                 {book.description}
//                             </p>
//                         </div>

//                         <div className="border-t border-gray-200 pt-6">
//                             <div className="flex flex-col md:flex-row justify-between items-center">
//                                 <div className="mb-4 md:mb-0">
//                                     {book.availableCopies > 0 ? (
//                                         <div className="text-green-600 font-medium">
//                                             ✓ Available for borrowing
//                                         </div>
//                                     ) : (
//                                         <div className="text-red-600 font-medium">
//                                             ✗ Currently unavailable
//                                         </div>
//                                     )}
//                                     <p className="text-sm text-gray-500 mt-1">
//                                         Borrow period: 14 days
//                                     </p>
//                                 </div>

//                                 <div className="flex space-x-4">
//                                     {book.pdfUrl && (
//                                         <a
//                                             href={book.pdfUrl}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                             className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors"
//                                         >
//                                             <BookIcon />
//                                             <span className="ml-2">Read Online</span>
//                                         </a>
//                                     )}

//                                     {user?.role === 'student' && book.availableCopies > 0 && (
//                                         <button
//                                             onClick={handleBorrow}
//                                             disabled={borrowing}
//                                             className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                                         >
//                                             {borrowing ? (
//                                                 <>
//                                                     <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                                                     Processing...
//                                                 </>
//                                             ) : (
//                                                 'Borrow This Book'
//                                             )}
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }



import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { bookAPI, borrowAPI } from '../services/api';

export default function BookDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [borrowing, setBorrowing] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchBook();
    }, [id]);

    const fetchBook = async () => {
        try {
            setLoading(true);
            const response = await bookAPI.getBookById(id);
            setBook(response.data);
        } catch (err) {
            setError('Book not found or error loading details');
            console.error('Error fetching book:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBorrow = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.role !== 'student') {
            alert('Only students can borrow books');
            return;
        }

        if (book.availableCopies < 1) {
            alert('No copies available for borrowing');
            return;
        }

        try {
            setBorrowing(true);
            await borrowAPI.borrowBook(id);
            alert('✅ Book borrowed successfully! You have 14 days to return it.');
            fetchBook();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to borrow book');
        } finally {
            setBorrowing(false);
        }
    };

    const handleRead = () => {
        if (book?.pdfUrl) {
            window.open(book.pdfUrl, '_blank', 'noopener,noreferrer');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading book details...</p>
                </div>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">
                    <div className="text-red-600 mb-4">{error || 'Book not found'}</div>
                    <Link
                        to="/books"
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Books
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link
                    to="/books"
                    className="inline-flex items-center text-gray-600 hover:text-gray-900"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to All Books
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="md:flex">
                    {/* Book Cover */}
                    <div className="md:w-1/3 p-8 bg-gray-50 flex items-center justify-center">
                        {book.coverImage ? (
                            <img
                                src={book.coverImage}
                                alt={book.title}
                                className="w-64 h-auto rounded-lg shadow-md"
                            />
                        ) : (
                            <div className="w-64 h-80 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Book Details */}
                    <div className="md:w-2/3 p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                                <div className="flex items-center text-gray-600 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="text-lg">{book.author}</span>
                                </div>
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                {book.category}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                </svg>
                                <span className="font-medium">ISBN:</span>
                                <span className="ml-2">{book.isbn}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="font-medium">Published:</span>
                                <span className="ml-2">{book.publishedYear}</span>
                            </div>
                            {book.publisher && (
                                <div className="flex items-center text-gray-700">
                                    <span className="font-medium">Publisher:</span>
                                    <span className="ml-2">{book.publisher}</span>
                                </div>
                            )}
                            <div className="flex items-center text-gray-700">
                                <span className="font-medium">Copies Available:</span>
                                <span className={`ml-2 font-semibold ${
                                    book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {book.availableCopies} / {book.totalCopies}
                                </span>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {book.description}
                            </p>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Read Online Button - Always show if PDF exists */}
                                {book.pdfUrl && (
                                    <button
                                        onClick={handleRead}
                                        className="flex-1 inline-flex items-center justify-center px-6 py-3 border-2 border-green-600 text-green-600 font-medium rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Read Online
                                    </button>
                                )}

                                {/* Borrow Button - Only for students with available copies */}
                                {user?.role === 'student' && (
                                    book.availableCopies > 0 ? (
                                        <button
                                            onClick={handleBorrow}
                                            disabled={borrowing}
                                            className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {borrowing ? (
                                                <>
                                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    Borrow This Book
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            disabled
                                            className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 bg-gray-100 text-gray-500 font-medium rounded-md cursor-not-allowed"
                                        >
                                            Currently Unavailable
                                        </button>
                                    )
                                )}
                            </div>

                            {/* Borrow Info */}
                            {user?.role === 'student' && (
                                <div className="mt-4 p-4 bg-blue-50 rounded-md">
                                    <p className="text-sm text-blue-800">
                                        <span className="font-semibold">📚 Borrow Period:</span> 14 days
                                    </p>
                                    <p className="text-sm text-blue-800 mt-1">
                                        <span className="font-semibold">⚠️ Late Return:</span> Overdue books may incur penalties
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* PDF Preview Section */}
            {book.pdfUrl && (
                <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">📖 Read Online</h2>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <div>
                                    <p className="font-medium text-gray-900">{book.title} - PDF Version</p>
                                    <p className="text-sm text-gray-500">Click the button below to open the book in a new tab</p>
                                </div>
                            </div>
                            <button
                                onClick={handleRead}
                                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Open PDF Reader
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}