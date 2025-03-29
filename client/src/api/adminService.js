import apiClient from '@/lib/apiClient.js';

// API service for admin

//------------------------- GET APIs --------------------//

export const getAllUsersRequest = async () => {
    return apiClient(`/admin/users`, {
        method: "GET",
        requiresAuth: false,
        
    });
};

//------------------------- POST APIs --------------------//

export const addCategoryRequest = async (body) => {
    return apiClient(`/admin/categories`, {
        method: "POST",
        requiresAuth: false,
        body,
    });
};

//------------------------- DELETE APIs --------------------//

export const deleteAllUsersRequest = async () => {
    return apiClient(`/admin/delete-all`, {
        method: "DELETE",
        requiresAuth: false,
        
    });
};

export const deleteUserRequest = async () => {
    return apiClient(`/admin/delete/67dea3dd28824eca56a138ba`, {
        method: "DELETE",
        requiresAuth: false,
        
    });
};

