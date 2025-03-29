import apiClient from '@/lib/apiClient.js';

// API service for address

//------------------------- GET APIs --------------------//

export const getAllAddressesRequest = async () => {
    return apiClient(`/user/address`, {
        method: "GET",
        requiresAuth: false,
        
    });
};

export const getAddressesByIdRequest = async (id) => {
    return apiClient(`/user/addressid=${id}`, {
        method: "GET",
        requiresAuth: false,
        
    });
};

//------------------------- POST APIs --------------------//

export const createNewAddressRequest = async (body) => {
    return apiClient(`/user/address`, {
        method: "POST",
        requiresAuth: false,
        body,
    });
};

//------------------------- PUT APIs --------------------//

export const updateAddressRequest = async (body, id) => {
    return apiClient(`/user/addressid=${id}`, {
        method: "PUT",
        requiresAuth: false,
        body,
    });
};

//------------------------- DELETE APIs --------------------//

export const deleteAddressRequest = async (id) => {
    return apiClient(`/user/addressid=${id}`, {
        method: "DELETE",
        requiresAuth: false,
        
    });
};

