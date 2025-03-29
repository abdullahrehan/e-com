import apiClient from '@/lib/apiClient.js';

// API service for category

//------------------------- GET APIs --------------------//

export const getAllCategoryRequest = async () => {
    return apiClient(`/product/category`, {
        method: "GET",
        requiresAuth: false,
        
    });
};

//------------------------- POST APIs --------------------//

export const createNewCategoryRequest = async (body) => {
    return apiClient(`/product/category`, {
        method: "POST",
        requiresAuth: false,
        body,
    });
};

//------------------------- PUT APIs --------------------//

export const updateCategoryRequest = async (body) => {
    return apiClient(`/product/category/67deb14b88229a96ff189f1b`, {
        method: "PUT",
        requiresAuth: false,
        body,
    });
};

//------------------------- DELETE APIs --------------------//

export const deleteCategoryRequest = async () => {
    return apiClient(`/product/category/67dcc17e9a6320f99e86c0e2`, {
        method: "DELETE",
        requiresAuth: false,
        
    });
};

