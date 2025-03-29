// lib/apiClient.js
import { showToast } from './toast';

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

const handleErrorResponse = async (response, customErrorHandling) => {
  let errorData;
  try {
    errorData = await response.json();
  } catch {
    errorData = { message: 'Failed to parse error response' };
  }

  const errorMessage = errorData.message || 
                     errorData.error || 
                     `Request failed with status ${response.status}`;

  if (!customErrorHandling) {
    showToast.error(errorMessage);
  }

  throw new Error(errorMessage, {
    cause: {
      status: response.status,
      data: errorData
    }
  });
};

const handleSuccessResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  return contentType?.includes('application/json') ? response.json() : response.text();
};

const request = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    headers = {},
    formData = false,
    authRequired = true,
    customErrorHandling = false,
    baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
  } = options;

  // Prepare headers
  const requestHeaders = new Headers(headers);

  if (authRequired) {
    const token = getAuthToken();
    if (token) {
      requestHeaders.append('Authorization', `Bearer ${token}`);
    }
  }

  if (!formData && !requestHeaders.has('Content-Type')) {
    requestHeaders.append('Content-Type', 'application/json');
  }

  // Prepare request config
  const config = {
    method,
    headers: requestHeaders,
    credentials: 'include',
  };

  if (body) {
    config.body = formData ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(`${baseURL}${endpoint}`, config);

    if (!response.ok) {
      await handleErrorResponse(response, customErrorHandling);
      return null;
    }

    return handleSuccessResponse(response);
  } catch (error) {
    if (!customErrorHandling) {
      showToast.error(error.message || 'Network error occurred');
    }
    throw error;
  }
};

// Public API methods (maintaining same interface as class version)
export default {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options) => request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
};