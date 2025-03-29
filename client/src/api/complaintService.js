import apiClient from '@/lib/apiClient.js';

// API service for complaint

//------------------------- GET APIs --------------------//

export const getAllComplaintsRequest = async () => {
    return apiClient(`/user/complaint`, {
        method: "GET",
        requiresAuth: false,
        
    });
};

export const getComplaintRequest = async () => {
    return apiClient(`/user/complaint/507f1f77bcf86cd799439013`, {
        method: "GET",
        requiresAuth: false,
        
    });
};

//------------------------- POST APIs --------------------//

export const createNewComplaintRequest = async (body) => {
    return apiClient(`/user/complaint`, {
        method: "POST",
        requiresAuth: false,
        body,
    });
};

//------------------------- PUT APIs --------------------//

export const updateComplaintRequest = async (body) => {
    return apiClient(`/user/complaint/507f1f77bcf86cd799439013`, {
        method: "PUT",
        requiresAuth: false,
        body,
    });
};

//------------------------- DELETE APIs --------------------//

export const deleteComplaintRequest = async () => {
    return apiClient(`/user/complaint/507f1f77bcf86cd799439013`, {
        method: "DELETE",
        requiresAuth: false,
        
    });
};

