import apiClient from '@/lib/apiClient.js';

// API service for orders

//------------------------- GET APIs --------------------//

export const getAllOrdersRequest = async () => {
    return apiClient(`/order`, {
        method: "GET",
        requiresAuth: false,
        
    });
};

export const getOrderRequest = async () => {
    return apiClient(`/order/507f1f77bcf86cd799439012`, {
        method: "GET",
        requiresAuth: false,
        
    });
};

//------------------------- POST APIs --------------------//

export const createNewOrderRequest = async (body) => {
    return apiClient(`/order`, {
        method: "POST",
        requiresAuth: false,
        body,
    });
};

//------------------------- PUT APIs --------------------//

export const updateOrderRequest = async (body) => {
    return apiClient(`/order/507f1f77bcf86cd799439012`, {
        method: "PUT",
        requiresAuth: false,
        body,
    });
};

//------------------------- DELETE APIs --------------------//

export const deleteOrderRequest = async () => {
    return apiClient(`/order/507f1f77bcf86cd799439012`, {
        method: "DELETE",
        requiresAuth: false,
        
    });
};

