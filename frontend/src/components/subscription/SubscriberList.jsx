import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSubscriptionData } from "../../Services/subscriptionService";
import { Users, Search, RefreshCw, UserX, ChevronRight, ChevronLeft } from "lucide-react";

const SubscriberList = () => {
    // Redux state access with safe optional chaining
    const currentLanguage = useSelector((state) => state?.global?.current_language) || 'en';
    const loggedInUserDetails = useSelector((state) => state?.auth?.loggedInUser) || {};

    // State management with safe initial values
    const [userSubscriberData, setUserSubscriberData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Safe date parsing with fallback
    const getDateDetails = (dateString) => {
        if (!dateString || typeof dateString !== 'string') return 'Invalid Date';

        const date = new Date(dateString);
        if (isNaN(date)) return 'Invalid Date';

        const month = date.getMonth();
        const year = date.getFullYear();
        const dateOfMonth = date.getDate();
        const monthName = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ][month] || 'Invalid Month';

        return `${dateOfMonth} ${monthName} ${year}`;
    };

    // Pagination controls with boundary checks
    const handlePageChange = (pageNumber) => {
        const validPage = Math.max(1, Math.min(pageNumber, totalPages));
        setCurrentPage(validPage);
    };

    const handlePageSizeChange = (event) => {
        const newSize = Math.max(1, Number(event.target.value));
        setItemsPerPage(newSize);
        setCurrentPage(1);
    };

    // Safe data filtering
    const filteredUsers = (userSubscriberData || []).filter(user => {
        const userName = String(user?.userName || '').toLowerCase();
        const userEmail = String(user?.userEmail || '').toLowerCase();
        const company = String(user?.company || '').toLowerCase();
        const search = String(searchTerm || '').toLowerCase();

        return userName.includes(search) ||
            userEmail.includes(search) ||
            company.includes(search);
    });

    // Pagination calculations with safe values
    const pageSizeOptions = [5, 10, 20, 50];
    const totalItems = filteredUsers.length || 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const startIndex = Math.max(0, (currentPage - 1) * itemsPerPage);
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentItems = filteredUsers.slice(startIndex, endIndex);

    // API call with error handling
    const getSubscriptionDataAndCount = async () => {
        try {
            setError(null);
            setIsLoading(true);

            const creatorId = loggedInUserDetails?.createdBy;
            if (!creatorId) {
                throw new Error("Invalid user ID");
            }

            const dataResponse = await getSubscriptionData(creatorId);
            if (!dataResponse?.data) {
                throw new Error("Invalid response structure");
            }

            const userDataResponse = Array.isArray(dataResponse.data) ? dataResponse.data : [];
            const filterUserDataResponse = userDataResponse.filter(
                item => !item?.isDeleted && item?.isInvitedUser
            );

            setUserSubscriberData(filterUserDataResponse);
        } catch (err) {
            setError(err.message || "Failed to fetch subscriber data");
            setUserSubscriberData([]);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        if (loggedInUserDetails?.createdBy) {
            getSubscriptionDataAndCount();
        }
    }, [loggedInUserDetails?.createdBy]);  // Added dependency

    const handleRefresh = () => {
        if (!isRefreshing) {
            setIsRefreshing(true);
            getSubscriptionDataAndCount();
        }
    };

    const PaginationControls = () => (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                        <span className="font-medium">
                            {Math.min(endIndex, totalItems)}
                        </span>{" "}
                        of <span className="font-medium">{totalItems}</span> results
                    </p>
                    <select
                        value={itemsPerPage}
                        onChange={handlePageSizeChange}
                        className="rounded-md border border-gray-300 py-1 px-2 text-sm"
                    >
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size} per page
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <nav
                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                        aria-label="Pagination"
                    >
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        {[...Array(totalPages)].map((_, index) => {
                            const pageNumber = index + 1;
                            const isCurrentPage = pageNumber === currentPage;
                            const isNearCurrent = Math.abs(pageNumber - currentPage) <= 1;
                            const isEndPage = pageNumber === 1 || pageNumber === totalPages;

                            if (isNearCurrent || isEndPage) {
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => handlePageChange(pageNumber)}
                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${isCurrentPage
                                            ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                            : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                                            }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            } else if (
                                (index === 1 && currentPage > 3) ||
                                (index === totalPages - 2 && currentPage < totalPages - 2)
                            ) {
                                return (
                                    <span
                                        key={pageNumber}
                                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
                                    >
                                        ...
                                    </span>
                                );
                            }
                            return null;
                        })}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );

    // Loading skeleton component
    const LoadingSkeleton = () => (
        <div className="animate-pulse">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex space-x-4 py-4 border-b border-gray-200">
                    <div className="flex-1 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    // Error state component
    const ErrorState = () => (
        <div className="text-center py-12">
            <div className="text-red-500 mb-4">
                <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
                Try Again
            </button>
        </div>
    );

    // Empty state component
    const EmptyState = () => (
        <div className="text-center py-12">
            <UserX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg mb-2">No subscribers found</p>
            <p className="text-gray-400 text-sm">
                Start by inviting users to your subscription
            </p>
        </div>
    );

    return (
        <div className="custom-container rounded-xl  bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Subscribers</h1>
                            <p className="mt-1 text-sm text-gray-500">Subscription users</p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <RefreshCw
                                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                            />
                            Refresh
                        </button>
                    </div>

                    {/* Search bar */}
                    <div className="mt-4">
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Search by name, email, or company..."
                            />
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="bg-white rounded-lg shadow">
                    {isLoading ? (
                        <div className="p-6">
                            <LoadingSkeleton />
                        </div>
                    ) : error ? (
                        <ErrorState />
                    ) : filteredUsers?.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Company
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Access Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredUsers?.map((user) => (
                                            <tr
                                                key={user._id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                                <span className="text-gray-500 font-medium">
                                                                    {user.userName.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {user.userName}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {user.userEmail}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {user.company}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                            }`}
                                                    >
                                                        {user.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {getDateDetails(user.startTime)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <PaginationControls />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscriberList;
