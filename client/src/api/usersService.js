import apiClient from '@/lib/apiClient.js';

// API service for users

//------------------------- POST APIs --------------------//

export const uploadImageRequest = async () => {
    return apiClient(`/user/upload-image`, {
        method: "POST",
        requiresAuth: false,
        
    });
};

export const newRequestRequest = async () => {
    return apiClient(`/user/upload-image`, {
        method: "POST",
        requiresAuth: false,
        
    });
};

//------------------------- PUT APIs --------------------//

export const updateUserRequest = async (body, id) => {
    return apiClient(`/infoid=${id}`, {
        method: "PUT",
        requiresAuth: false,
        body,
    });
};

