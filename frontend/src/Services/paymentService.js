// paymentService.js
import baseService from "./baseService";

export const handlePayment = async (data) => {
    try {
        const response = await baseService.post('/process-payment', data);
        if (!response?.data) {
            throw new Error('No response data received');
        }
        return response;
    } catch (error) {
        console.error('Payment processing error:', error);
        throw error; // Re-throw to handle in component
    }
};

export const checkPaymentStatus = async (sessionId) => {
    try {
        const response = await baseService.get(`/check-status`, {
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
};