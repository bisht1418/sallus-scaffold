import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import baseService from "../Services/baseService";
import { useDispatch } from 'react-redux';
import { updateUserSubscription } from '../Redux/Slice/authSlice';

const PaymentStatus = () => {
    const [status, setStatus] = useState('loading');
    const [error, setError] = useState(null);
    const [isChecking, setIsChecking] = useState(false);
    const apiCalled = useRef(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const checkPaymentStatus = useCallback(async (sessionId) => {
        try {
            const response = await baseService.get('/payment/check-status', {
                params: { session_id: sessionId },
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Status check error:', error);
            throw error;
        }
    }, []);

    const verifyPayment = useCallback(async (sessionId) => {
        if (!sessionId || isChecking || apiCalled.current) return;

        setIsChecking(true);
        apiCalled.current = true;

        try {
            const data = await checkPaymentStatus(sessionId);

            if (data.status === 'complete') {
                setStatus('success');
                updateUserSubscription(dispatch, true);
                toast.success('Payment successful!');
                setTimeout(() => navigate('/'), 2000);
            } else if (data.status === 'pending') {
                setStatus('pending');
                apiCalled.current = false; // Allow rechecking for pending status
            } else {
                setStatus('failed');
                setError(data.message);
                toast.error(data.message || 'Payment verification failed');
            }
        } catch (error) {
            console.error('Verification error:', error);
            setStatus('failed');
            setError('Unable to verify payment status');
            toast.error('Payment verification failed. Please try again.');
        } finally {
            setIsChecking(false);
        }
    }, [isChecking, checkPaymentStatus, navigate]);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const sessionId = queryParams.get('session_id');

        if (sessionId && !apiCalled.current) {
            verifyPayment(sessionId);
        } else if (!sessionId && !apiCalled.current) {
            setStatus('failed');
            setError('No payment session found');
            toast.error('Invalid payment session');
            apiCalled.current = true;
        }
    }, [verifyPayment]); // Removed cleanup function that reset apiCalled

    const handleRetry = useCallback(() => {
        if (isChecking) return;

        const queryParams = new URLSearchParams(window.location.search);
        const sessionId = queryParams.get('session_id');
        if (sessionId) {
            apiCalled.current = false; // Reset the flag for retry
            verifyPayment(sessionId);
        }
    }, [verifyPayment, isChecking]);

    const handleTryAgain = useCallback(() => {
        navigate('/subscription');
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        <p className="mt-4 text-lg">Verifying payment...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="text-center">
                        <div className="mb-4">
                            <svg className="w-16 h-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
                        <p className="text-gray-600">Your subscription has been activated.</p>
                        <p className="text-sm text-gray-500 mb-4">Redirecting to dashboard...</p>
                    </div>
                )}

                {status === 'pending' && (
                    <div className="text-center">
                        <div className="mb-4">
                            <svg className="w-16 h-16 mx-auto text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-yellow-600 mb-2">Payment Pending</h2>
                        <p className="text-gray-600">Your payment is being processed.</p>
                        <button
                            onClick={handleRetry}
                            disabled={isChecking}
                            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-all"
                        >
                            {isChecking ? 'Checking...' : 'Check Status'}
                        </button>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="text-center">
                        <div className="mb-4">
                            <svg className="w-16 h-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h2>
                        <p className="text-gray-600">{error || 'An error occurred during payment'}</p>
                        <button
                            onClick={handleTryAgain}
                            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentStatus;