import apiClient from '@/lib/apiClient.js';

// API service for review

//------------------------- GET APIs --------------------//

export const getAllReviewsRequest = async () => {
    return apiClient(`/review`, {
        method: "GET",
        requiresAuth: false,
        
    });
};

export const getReviewRequest = async () => {
    return apiClient(`/review/507f1f77bcf86cd799439012`, {
        method: "GET",
        requiresAuth: false,
        
    });
};

//------------------------- POST APIs --------------------//

export const addReviewRequest = async (body) => {
    return apiClient(`/review`, {
        method: "POST",
        requiresAuth: false,
        body,
    });
};

//------------------------- PUT APIs --------------------//

export const updateReviewRequest = async (body) => {
    return apiClient(`/review/507f1f77bcf86cd799439012`, {
        method: "PUT",
        requiresAuth: false,
        body,
    });
};

//------------------------- DELETE APIs --------------------//

export const deleteReviewRequest = async () => {
    return apiClient(`/review/507f1f77bcf86cd799439012`, {
        method: "DELETE",
        requiresAuth: false,
        
    });
};

