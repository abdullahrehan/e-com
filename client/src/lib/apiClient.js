// lib/apiClient.js
import { toast } from 'react-toastify';

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Toast configuration
const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

const showSuccessToast = (message) => {
  toast.success(message, {
    ...toastConfig,
    style: { background: '#4BB543', color: 'white' }
  });
};

const showErrorToast = (message) => {
  toast.error(message, {
    ...toastConfig,
    autoClose: 7000,
    style: { background: '#FF3333', color: 'white' }
  });
};

const apiClient = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    headers = {},
    requiresAuth = false,
    baseURL = "http://localhost:80/api"
  } = options;

  // Prepare headers
  const requestHeaders = new Headers(headers);

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      requestHeaders.append('Authorization', `Bearer ${token}`);
    }
  }

  if (body && !requestHeaders.has('Content-Type')) {
    requestHeaders.append('Content-Type', 'application/json');
  }

  // Prepare request config
  const config = {
    method,
    headers: requestHeaders,
    credentials: 'include',
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const url=`${baseURL}${endpoint}`
    console.log(url)
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: 'Failed to parse error response' };
      }

      const errorMessage = errorData.message || 
                         errorData.error || 
                         `Request failed with status ${response.status}`;

      showErrorToast(errorMessage);
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    return contentType?.includes('application/json') ? response.json() : response.text();

  } catch (error) {
    if (error.message !== 'Failed to parse error response') {
      showErrorToast(error.message || 'Network error occurred');
    }
    throw error;
  }
};

export default apiClient;