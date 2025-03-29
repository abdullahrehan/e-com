import apiClient from '@/lib/apiClient.js';

// API service for inventory

//------------------------- GET APIs --------------------//

export const getAllInventoryRequest = async () => {
    return apiClient(`/product/inventory`, {
        method: "GET",
        requiresAuth: false,
        
    });
};

export const getInventoryRequest = async () => {
    return apiClient(`/product/inventory/507f1f77bcf86cd799439013`, {
        method: "GET",
        requiresAuth: false,
        
    });
};

//------------------------- POST APIs --------------------//

export const addNewInventoryRequest = async (body) => {
    return apiClient(`/product/inventory`, {
        method: "POST",
        requiresAuth: false,
        body,
    });
};

//------------------------- PUT APIs --------------------//

export const updateInventoryRequest = async (body) => {
    return apiClient(`/product/inventory/507f1f77bcf86cd799439012`, {
        method: "PUT",
        requiresAuth: false,
        body,
    });
};

//------------------------- DELETE APIs --------------------//

export const deleteInventoryRequest = async () => {
    return apiClient(`/product/inventory/507f1f77bcf86cd799439012`, {
        method: "DELETE",
        requiresAuth: false,
        
    });
};

