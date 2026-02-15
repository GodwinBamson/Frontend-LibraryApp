import { useState, useEffect } from "react";
import { authAPI } from "../services/api";
import {
  UserCircleIcon,
  EmailIcon,
  IdentificationIcon,
  CalendarIcon,
} from "../components/Icons";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getProfile();
      setUserData(response.data);
    } catch (err) {
      setError("Failed to load profile information");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-red-600">
          {error || "Profile not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-indigo-600 px-8 py-6">
            <div className="flex items-center">
              <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center">
                <UserCircleIcon />
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-bold text-white">
                  {userData.name}
                </h2>
                <div className="flex items-center mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-500 text-white">
                    {userData.role === "admin" ? "Administrator" : "Student"}
                  </span>
                  {userData.studentId && (
                    <span className="ml-3 text-indigo-200">
                      ID: {userData.studentId}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <EmailIcon />
                      <div className="ml-3">
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="font-medium text-gray-900">
                          {userData.email}
                        </div>
                      </div>
                    </div>

                    {userData.studentId && (
                      <div className="flex items-center">
                        <IdentificationIcon />
                        <div className="ml-3">
                          <div className="text-sm text-gray-500">
                            Student ID
                          </div>
                          <div className="font-medium text-gray-900">
                            {userData.studentId}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center">
                      <CalendarIcon />
                      <div className="ml-3">
                        <div className="text-sm text-gray-500">
                          Member Since
                        </div>
                        <div className="font-medium text-gray-900">
                          {formatDate(userData.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Library Statistics
                </h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">
                        {userData.borrowedBooks?.filter((b) => !b.returned)
                          .length || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        Currently Borrowed
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {userData.borrowedBooks?.filter((b) => b.returned)
                          .length || 0}
                      </div>
                      <div className="text-sm text-gray-600">
                        Books Returned
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Currently Borrowed Books
                  </h4>
                  {userData.borrowedBooks?.filter((b) => !b.returned).length >
                  0 ? (
                    <div className="space-y-3">
                      {userData.borrowedBooks
                        .filter((b) => !b.returned)
                        .map((borrowed) => (
                          <div
                            key={borrowed._id}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded"
                          >
                            <div>
                              <div className="font-medium text-gray-900">
                                {borrowed.book?.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                Due: {formatDate(borrowed.dueDate)}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No books currently borrowed
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Account Actions
              </h3>
              <div className="flex space-x-4">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Change Password
                </button>
                <button className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
