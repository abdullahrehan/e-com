import apiClient from '@/lib/apiClient.js';

// API service for products

//------------------------- GET APIs --------------------//

export const getAllProductsRequest = async () => {
    return apiClient(`/product`, {
        method: "GET",
        requiresAuth: false,
        
    });
};

export const getProductByIdRequest = async () => {
    return apiClient(`/product/67decc8e46487da3f6bccb9e`, {
        method: "GET",
        requiresAuth: false,
        
    });
};

//------------------------- POST APIs --------------------//

export const createProductRequest = async () => {
    return apiClient(`/product`, {
        method: "POST",
        requiresAuth: false,
        
    });
};

//------------------------- PUT APIs --------------------//

export const updateProductRequest = async () => {
    return apiClient(`/product/67deddd4f4273134d1a74f19`, {
        method: "PUT",
        requiresAuth: false,
        
    });
};

//------------------------- DELETE APIs --------------------//

export const deleteProductRequest = async () => {
    return apiClient(`/product/67decfa29657d6e1d45ea4ba`, {
        method: "DELETE",
        requiresAuth: false,
        
    });
};

export const deleteProductImageRequest = async () => {
    return apiClient(`/product/67def22f7dcf30d9f899ecaf/images/0`, {
        method: "DELETE",
        requiresAuth: false,
        
    });
};

