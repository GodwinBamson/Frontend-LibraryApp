// import { Fragment } from 'react';
// import { Disclosure, Menu, Transition } from '@headlessui/react';
// import { Bars3Icon, XMarkIcon, BookOpenIcon } from '@heroicons/react/24/outline';
// import { Link, useNavigate } from 'react-router-dom';

// const navigation = [
//     { name: 'Books', href: '/books', current: true },
//     { name: 'My Books', href: '/dashboard', current: false },
// ];

// export default function Navbar() {
//     const navigate = useNavigate();
//     const user = JSON.parse(localStorage.getItem('user'));
//     const isAdmin = user?.role === 'admin';

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         navigate('/login');
//     };

//     return (
//         <Disclosure as="nav" className="bg-gray-800">
//             {({ open }) => (
//                 <>
//                     <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//                         <div className="flex h-16 items-center justify-between">
//                             <div className="flex items-center">
//                                 <div className="flex-shrink-0">
//                                     <BookOpenIcon className="h-8 w-8 text-white" />
//                                 </div>
//                                 <div className="hidden md:block">
//                                     <div className="ml-10 flex items-baseline space-x-4">
//                                         {navigation.map((item) => (
//                                             <Link
//                                                 key={item.name}
//                                                 to={item.href}
//                                                 className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
//                                             >
//                                                 {item.name}
//                                             </Link>
//                                         ))}
//                                         {isAdmin && (
//                                             <Link
//                                                 to="/admin/books"
//                                                 className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
//                                             >
//                                                 Admin Panel
//                                             </Link>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="hidden md:block">
//                                 <div className="ml-4 flex items-center md:ml-6">
//                                     <Menu as="div" className="relative ml-3">
//                                         <div>
//                                             <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
//                                                 <span className="sr-only">Open user menu</span>
//                                                 <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
//                                                     {user?.name?.charAt(0)}
//                                                 </div>
//                                             </Menu.Button>
//                                         </div>
//                                         <Transition
//                                             as={Fragment}
//                                             enter="transition ease-out duration-100"
//                                             enterFrom="transform opacity-0 scale-95"
//                                             enterTo="transform opacity-100 scale-100"
//                                             leave="transition ease-in duration-75"
//                                             leaveFrom="transform opacity-100 scale-100"
//                                             leaveTo="transform opacity-0 scale-95"
//                                         >
//                                             <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                                                 <Menu.Item>
//                                                     {({ active }) => (
//                                                         <Link
//                                                             to="/profile"
//                                                             className={`${
//                                                                 active ? 'bg-gray-100' : ''
//                                                             } block px-4 py-2 text-sm text-gray-700`}
//                                                         >
//                                                             Your Profile
//                                                         </Link>
//                                                     )}
//                                                 </Menu.Item>
//                                                 <Menu.Item>
//                                                     {({ active }) => (
//                                                         <button
//                                                             onClick={handleLogout}
//                                                             className={`${
//                                                                 active ? 'bg-gray-100' : ''
//                                                             } block w-full text-left px-4 py-2 text-sm text-gray-700`}
//                                                         >
//                                                             Sign out
//                                                         </button>
//                                                     )}
//                                                 </Menu.Item>
//                                             </Menu.Items>
//                                         </Transition>
//                                     </Menu>
//                                 </div>
//                             </div>
//                             <div className="-mr-2 flex md:hidden">
//                                 <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
//                                     <span className="sr-only">Open main menu</span>
//                                     {open ? (
//                                         <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
//                                     ) : (
//                                         <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
//                                     )}
//                                 </Disclosure.Button>
//                             </div>
//                         </div>
//                     </div>
//                 </>
//             )}
//         </Disclosure>
//     );
// }





import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MenuIcon, CloseIcon, BookIcon } from '../components/Icons';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.role === 'admin';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <BookIcon className="h-8 w-8 text-white" />
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link
                                    to="/books"
                                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Books
                                </Link>
                                <Link
                                    to="/dashboard"
                                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    My Books
                                </Link>
                                {isAdmin && (
                                    <Link
                                        to="/admin/books"
                                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            <div className="relative ml-3">
                                <div className="flex items-center space-x-4">
                                    <span className="text-gray-300 text-sm">
                                        Hello, {user?.name}
                                    </span>
                                    <Link
                                        to="/profile"
                                        className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                        >
                            {isOpen ? <CloseIcon /> : <MenuIcon />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link
                            to="/books"
                            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Books
                        </Link>
                        <Link
                            to="/dashboard"
                            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            My Books
                        </Link>
                        {isAdmin && (
                            <Link
                                to="/admin/books"
                                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                Admin Panel
                            </Link>
                        )}
                        <Link
                            to="/profile"
                            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Profile
                        </Link>
                        <button
                            onClick={() => {
                                handleLogout();
                                setIsOpen(false);
                            }}
                            className="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}