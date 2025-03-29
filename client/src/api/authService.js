import apiClient from '@/lib/apiClient.js';

// API service for auth

//------------------------- POST APIs --------------------//

export const signupRequest = async (body) => {
    return apiClient(`/auth/signin`, {
        method: "POST",
        requiresAuth: false,
        body,
    });
};

export const signupAdminRequest = async (body) => {
    return apiClient(`/auth/admin/signin`, {
        method: "POST",
        requiresAuth: false,
        body,
    });
};

export const verifyEmailRequest = async (body) => {
    return apiClient(`/auth/verify-email`, {
        method: "POST",
        requiresAuth: false,
        body,
    });
};

export const loginRequest = async (body) => {
    return apiClient(`/auth/login`, {
        method: "POST",
        requiresAuth: false,
        body,
    });
};

export const forgotPasswordRequest = async (body) => {
    return apiClient(`/auth/forgot-password`, {
        method: "POST",
        requiresAuth: false,
        body,
    });
};

export const verifyResetPasswordRequest = async (body) => {
    return apiClient(`/auth/verify-reset-password`, {
        method: "POST",
        requiresAuth: false,
        body,
    });
};

