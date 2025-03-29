import apiClient from '@/lib/apiClient.js';

// API service for payment methode

//------------------------- GET APIs --------------------//

export const getAllPaymentMethodsRequest = async (userid) => {
    return apiClient(`/payment-methodsuserId=${userid}`, {
        method: "GET",
        requiresAuth: false,
        
    });
};

export const getPaymentMethodRequest = async () => {
    return apiClient(`/payment-methods/507f1f77bcf86cd799439012`, {
        method: "GET",
        requiresAuth: false,
        
    });
};

export const getAllPaymentsRequest = async () => {
    return apiClient(`/payments`, {
        method: "GET",
        requiresAuth: false,
        
    });
};

export const getPaymentRequest = async () => {
    return apiClient(`/payments/507f1f77bcf86cd799439012`, {
        method: "GET",
        requiresAuth: false,
        
    });
};

export const adminPaymentRequest = async () => {
    return apiClient(`/admin/payments`, {
        method: "GET",
        requiresAuth: false,
        
    });
};

//------------------------- POST APIs --------------------//

export const createNewPaymentMethodeRequest = async (body) => {
    return apiClient(`/payment-methods`, {
        method: "POST",
        requiresAuth: false,
        body,
    });
};

export const processPaymentRequest = async (body) => {
    return apiClient(`/payments`, {
        method: "POST",
        requiresAuth: false,
        body,
    });
};

export const refundRequest = async () => {
    return apiClient(`/refunds`, {
        method: "POST",
        requiresAuth: false,
        
    });
};

export const webhooksPaymentRequest = async () => {
    return apiClient(`/webhooks/payment`, {
        method: "POST",
        requiresAuth: false,
        
    });
};

//------------------------- PUT APIs --------------------//

export const updatePaymentMethodeRequest = async (body) => {
    return apiClient(`/payment-methods`, {
        method: "PUT",
        requiresAuth: false,
        body,
    });
};

//------------------------- DELETE APIs --------------------//

export const deletePaymentMethodeRequest = async () => {
    return apiClient(`/payment-methods/507f1f77bcf86cd799439012`, {
        method: "DELETE",
        requiresAuth: false,
        
    });
};

