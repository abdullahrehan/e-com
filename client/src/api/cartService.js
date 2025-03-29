import apiClient from '@/lib/apiClient.js';

// API service for cart

//------------------------- GET APIs --------------------//

export const getCartRequest = async () => {
    return apiClient(`/user/cart`, {
        method: "GET",
        requiresAuth: false,
        
    });
};

//------------------------- POST APIs --------------------//

export const addCartItemRequest = async (body) => {
    return apiClient(`/user/cart`, {
        method: "POST",
        requiresAuth: false,
        body,
    });
};

//------------------------- PUT APIs --------------------//

export const updateCartRequest = async (body) => {
    return apiClient(`/user/cart`, {
        method: "PUT",
        requiresAuth: false,
        body,
    });
};

//------------------------- DELETE APIs --------------------//

export const clearCartRequest = async () => {
    return apiClient(`/user/cart`, {
        method: "DELETE",
        requiresAuth: false,
        
    });
};

export const deleteCartItemRequest = async (body) => {
    return apiClient(`/user/cart`, {
        method: "DELETE",
        requiresAuth: false,
        body,
    });
};

