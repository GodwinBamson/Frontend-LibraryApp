// import { useState, useEffect } from 'react';
// import { borrowAPI } from '../services/api';
// import { format, isAfter } from 'date-fns';

// export default function Dashboard() {
//     const [borrowedBooks, setBorrowedBooks] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const user = JSON.parse(localStorage.getItem('user'));

//     useEffect(() => {
//         fetchBorrowedBooks();
//     }, []);

//     const fetchBorrowedBooks = async () => {
//         try {
//             setLoading(true);
//             const response = await borrowAPI.getMyBooks();
//             setBorrowedBooks(response.data);
//         } catch (error) {
//             console.error('Error fetching borrowed books:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleReturn = async (bookId) => {
//         try {
//             await borrowAPI.returnBook(bookId);
//             alert('Book returned successfully!');
//             fetchBorrowedBooks();
//         } catch (error) {
//             alert(error.response?.data?.message || 'Failed to return book');
//         }
//     };

//     const isOverdue = (dueDate) => {
//         return isAfter(new Date(), new Date(dueDate));
//     };

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="mb-8">
//                 <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
//                 <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
//             </div>

//             <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4">My Borrowed Books</h2>
                
//                 {loading ? (
//                     <div className="text-center py-8">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
//                     </div>
//                 ) : borrowedBooks.length > 0 ? (
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead>
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Book
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Borrowed Date
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Due Date
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Status
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Actions
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {borrowedBooks
//                                     .filter(book => !book.returned)
//                                     .map((borrowed) => (
//                                         <tr key={borrowed._id}>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="flex items-center">
//                                                     <div className="ml-4">
//                                                         <div className="text-sm font-medium text-gray-900">
//                                                             {borrowed.book?.title}
//                                                         </div>
//                                                         <div className="text-sm text-gray-500">
//                                                             {borrowed.book?.author}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                 {format(new Date(borrowed.borrowedDate), 'MMM dd, yyyy')}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                 {format(new Date(borrowed.dueDate), 'MMM dd, yyyy')}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                                                     isOverdue(borrowed.dueDate)
//                                                         ? 'bg-red-100 text-red-800'
//                                                         : 'bg-green-100 text-green-800'
//                                                 }`}>
//                                                     {isOverdue(borrowed.dueDate) ? 'Overdue' : 'Active'}
//                                                 </span>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                                 {!borrowed.returned && (
//                                                     <button
//                                                         onClick={() => handleReturn(borrowed.book?._id)}
//                                                         className="text-indigo-600 hover:text-indigo-900 mr-4"
//                                                     >
//                                                         Return
//                                                     </button>
//                                                 )}
//                                                 {borrowed.book?.pdfUrl && (
//                                                     <a
//                                                         href={borrowed.book.pdfUrl}
//                                                         target="_blank"
//                                                         rel="noopener noreferrer"
//                                                         className="text-green-600 hover:text-green-900"
//                                                     >
//                                                         Read Online
//                                                     </a>
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 ) : (
//                     <p className="text-gray-600 text-center py-8">
//                         You haven't borrowed any books yet. Start exploring our collection!
//                     </p>
//                 )}
//             </div>

//             <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4">Reading History</h2>
//                 {borrowedBooks
//                     .filter(book => book.returned)
//                     .length > 0 ? (
//                     <div className="space-y-4">
//                         {borrowedBooks
//                             .filter(book => book.returned)
//                             .map((borrowed) => (
//                                 <div key={borrowed._id} className="flex items-center justify-between border-b border-gray-200 pb-4">
//                                     <div>
//                                         <h3 className="text-sm font-medium text-gray-900">
//                                             {borrowed.book?.title}
//                                         </h3>
//                                         <p className="text-sm text-gray-500">
//                                             Returned on {format(new Date(borrowed.returnedDate), 'MMM dd, yyyy')}
//                                         </p>
//                                     </div>
//                                     <span className="text-xs text-gray-500">
//                                         Borrowed: {format(new Date(borrowed.borrowedDate), 'MMM dd, yyyy')}
//                                     </span>
//                                 </div>
//                             ))}
//                     </div>
//                 ) : (
//                     <p className="text-gray-600 text-center py-8">
//                         No reading history yet.
//                     </p>
//                 )}
//             </div>
//         </div>
//     );
// }




// import { useState, useEffect } from 'react';
// import { borrowAPI } from '../services/api';

// export default function Dashboard() {
//     const [borrowedBooks, setBorrowedBooks] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const user = JSON.parse(localStorage.getItem('user'));

//     useEffect(() => {
//         fetchBorrowedBooks();
//     }, []);

//     const fetchBorrowedBooks = async () => {
//         try {
//             setLoading(true);
//             const response = await borrowAPI.getMyBooks();
//             setBorrowedBooks(response.data);
//         } catch (error) {
//             console.error('Error fetching borrowed books:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleReturn = async (bookId) => {
//         try {
//             await borrowAPI.returnBook(bookId);
//             alert('Book returned successfully!');
//             fetchBorrowedBooks();
//         } catch (error) {
//             alert(error.response?.data?.message || 'Failed to return book');
//         }
//     };

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric'
//         });
//     };

//     const isOverdue = (dueDate) => {
//         const today = new Date();
//         const due = new Date(dueDate);
//         return today > due;
//     };

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="mb-8">
//                 <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
//                 <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
//             </div>

//             <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4">My Borrowed Books</h2>
                
//                 {loading ? (
//                     <div className="text-center py-8">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
//                     </div>
//                 ) : borrowedBooks.length > 0 ? (
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead>
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Book
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Borrowed Date
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Due Date
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Status
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Actions
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {borrowedBooks
//                                     .filter(book => !book.returned)
//                                     .map((borrowed) => (
//                                         <tr key={borrowed._id}>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="flex items-center">
//                                                     <div className="ml-4">
//                                                         <div className="text-sm font-medium text-gray-900">
//                                                             {borrowed.book?.title}
//                                                         </div>
//                                                         <div className="text-sm text-gray-500">
//                                                             {borrowed.book?.author}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                 {formatDate(borrowed.borrowedDate)}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                 {formatDate(borrowed.dueDate)}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                                                     isOverdue(borrowed.dueDate)
//                                                         ? 'bg-red-100 text-red-800'
//                                                         : 'bg-green-100 text-green-800'
//                                                 }`}>
//                                                     {isOverdue(borrowed.dueDate) ? 'Overdue' : 'Active'}
//                                                 </span>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                                 {!borrowed.returned && (
//                                                     <button
//                                                         onClick={() => handleReturn(borrowed.book?._id)}
//                                                         className="text-indigo-600 hover:text-indigo-900 mr-4"
//                                                     >
//                                                         Return
//                                                     </button>
//                                                 )}
//                                                 {borrowed.book?.pdfUrl && (
//                                                     <a
//                                                         href={borrowed.book.pdfUrl}
//                                                         target="_blank"
//                                                         rel="noopener noreferrer"
//                                                         className="text-green-600 hover:text-green-900"
//                                                     >
//                                                         Read Online
//                                                     </a>
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 ) : (
//                     <p className="text-gray-600 text-center py-8">
//                         You haven't borrowed any books yet. Start exploring our collection!
//                     </p>
//                 )}
//             </div>

//             <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4">Reading History</h2>
//                 {borrowedBooks
//                     .filter(book => book.returned)
//                     .length > 0 ? (
//                     <div className="space-y-4">
//                         {borrowedBooks
//                             .filter(book => book.returned)
//                             .map((borrowed) => (
//                                 <div key={borrowed._id} className="flex items-center justify-between border-b border-gray-200 pb-4">
//                                     <div>
//                                         <h3 className="text-sm font-medium text-gray-900">
//                                             {borrowed.book?.title}
//                                         </h3>
//                                         <p className="text-sm text-gray-500">
//                                             Returned on {formatDate(borrowed.returnedDate)}
//                                         </p>
//                                     </div>
//                                     <span className="text-xs text-gray-500">
//                                         Borrowed: {formatDate(borrowed.borrowedDate)}
//                                     </span>
//                                 </div>
//                             ))}
//                     </div>
//                 ) : (
//                     <p className="text-gray-600 text-center py-8">
//                         No reading history yet.
//                     </p>
//                 )}
//             </div>
//         </div>
//     );
// }



import { useState, useEffect } from 'react';
import { borrowAPI } from '../services/api';

export default function Dashboard() {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchBorrowedBooks();
    }, []);

    const fetchBorrowedBooks = async () => {
        try {
            setLoading(true);
            const response = await borrowAPI.getMyBooks();
            setBorrowedBooks(response.data);
        } catch (error) {
            console.error('Error fetching borrowed books:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (bookId) => {
        try {
            await borrowAPI.returnBook(bookId);
            alert('Book returned successfully!');
            fetchBorrowedBooks();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to return book');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isOverdue = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        return today > due;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">My Borrowed Books</h2>
                
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    </div>
                ) : borrowedBooks.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Book
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Borrowed Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Due Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {borrowedBooks
                                    .filter(book => !book.returned)
                                    .map((borrowed) => (
                                        <tr key={borrowed._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {borrowed.book?.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {borrowed.book?.author}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(borrowed.borrowedDate)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(borrowed.dueDate)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    isOverdue(borrowed.dueDate)
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {isOverdue(borrowed.dueDate) ? 'Overdue' : 'Active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {!borrowed.returned && (
                                                    <button
                                                        onClick={() => handleReturn(borrowed.book?._id)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    >
                                                        Return
                                                    </button>
                                                )}
                                                {borrowed.book?.pdfUrl && (
                                                    <a
                                                        href={borrowed.book.pdfUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Read Online
                                                    </a>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600 text-center py-8">
                        You haven't borrowed any books yet. Start exploring our collection!
                    </p>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Reading History</h2>
                {borrowedBooks
                    .filter(book => book.returned)
                    .length > 0 ? (
                    <div className="space-y-4">
                        {borrowedBooks
                            .filter(book => book.returned)
                            .map((borrowed) => (
                                <div key={borrowed._id} className="flex items-center justify-between border-b border-gray-200 pb-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">
                                            {borrowed.book?.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Returned on {formatDate(borrowed.returnedDate)}
                                        </p>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        Borrowed: {formatDate(borrowed.borrowedDate)}
                                    </span>
                                </div>
                            ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-center py-8">
                        No reading history yet.
                    </p>
                )}
            </div>
        </div>
    );
}