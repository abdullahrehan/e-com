import apiClient from '@/lib/apiClient.js';

// API service for wishlist

//------------------------- GET APIs --------------------//

export const getWishlistRequest = async () => {
    return apiClient(`/user/wishlist`, {
        method: "GET",
        requiresAuth: false,
        
    });
};

export const addProductWishlistRequest = async (body) => {
    return apiClient(`/user/wishlist`, {
        method: "GET",
        requiresAuth: false,
        body,
    });
};

export const removeProductWishlistRequest = async (body) => {
    return apiClient(`/user/wishlist`, {
        method: "GET",
        requiresAuth: false,
        body,
    });
};

//------------------------- POST APIs --------------------//

export const createWishlistRequest = async (body) => {
    return apiClient(`/user/wishlist`, {
        method: "POST",
        requiresAuth: false,
        body,
    });
};

//------------------------- PUT APIs --------------------//

export const updateWishlistRequest = async (body) => {
    return apiClient(`/user/wishlist/507f1f77bcf86cd799439011`, {
        method: "PUT",
        requiresAuth: false,
        body,
    });
};

//------------------------- DELETE APIs --------------------//

export const deleteWishlistRequest = async () => {
    return apiClient(`/user/wishlist/507f1f77bcf86cd799439011`, {
        method: "DELETE",
        requiresAuth: false,
        
    });
};

