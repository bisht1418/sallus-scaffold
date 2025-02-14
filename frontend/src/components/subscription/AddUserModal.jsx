import React, { useEffect, useState } from 'react';
import { X, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const AddUserModal = ({ isOpen, onClose, onSubmit }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [userDetails, setUserDetails] = useState({
        userName: '',
        userEmail: '',
        phoneNumber: '',
        company: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'unset';
            };
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        onSubmit(e);
        setLoading(false);
    };



    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Backdrop with blue tint */}
            <div className="absolute inset-0 bg-gray-600 bg-opacity-20 backdrop-blur-sm " />

            <div className="relative w-full max-w-xl mx-4 max-h-[90vh] overflow-auto rounded-2xl">
                {/* Card Container */}
                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                        <div className="flex justify-between items-center">
                            <button
                                onClick={onClose}
                                className="flex items-center text-white hover:bg-blue-700 rounded-lg px-3 py-2 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                <span>Back</span>
                            </button>
                            <button
                                onClick={onClose}
                                className="text-white hover:bg-blue-700 rounded-full p-2 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <h2 className="text-white text-xl font-semibold mt-4">Invite New User</h2>
                    </div>

                    {/* Form */}
                    <form onSubmit={(e) => handleSubmit(e)} className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                required
                                placeholder="Enter username"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                onChange={(e) => setUserDetails({ ...userDetails, userName: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                required
                                placeholder="mail@example.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                onChange={(e) => setUserDetails({ ...userDetails, userEmail: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                type="tel"
                                required
                                placeholder="000-000-0000"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                onChange={(e) => setUserDetails({ ...userDetails, phoneNumber: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Company</label>
                            <input
                                type="text"
                                required
                                placeholder="Enter company name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                onChange={(e) => setUserDetails({ ...userDetails, company: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="Enter password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                'Add User'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddUserModal;