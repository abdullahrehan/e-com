import apiClient from '@/lib/apiClient.js';

// API service for promo

//------------------------- GET APIs --------------------//

export const getPromoCodeRequest = async () => {
    return apiClient(`/promo/507f1f77bcf86cd799439011`, {
        method: "GET",
        requiresAuth: false,
        
    });
};

export const getAllPromoCodesRequest = async () => {
    return apiClient(`/promo`, {
        method: "GET",
        requiresAuth: false,
        
    });
};

//------------------------- POST APIs --------------------//

export const createPromoCodeRequest = async (body) => {
    return apiClient(`/promo`, {
        method: "POST",
        requiresAuth: false,
        body,
    });
};

export const verifyPromoCodeRequest = async (body) => {
    return apiClient(`/promo`, {
        method: "POST",
        requiresAuth: false,
        body,
    });
};

//------------------------- PUT APIs --------------------//

export const updatePromoCodeRequest = async (body) => {
    return apiClient(`/promo`, {
        method: "PUT",
        requiresAuth: false,
        body,
    });
};

//------------------------- DELETE APIs --------------------//

export const deletePromoCodeRequest = async () => {
    return apiClient(`/promo/507f1f77bcf86cd799439011`, {
        method: "DELETE",
        requiresAuth: false,
        
    });
};

