import { toast } from 'react-toastify';

const handleRequest = async (
  requestFn,
  showSuccess = true,
  showError = true,
  ...params
) => {
  try {
    const response = await requestFn(...params);

    if (showSuccess && response.message) {
      toast.success(response.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: {
          background: "#4BB543", // Green for success
          color: "#fff",
          fontWeight: "bold",
        },
      });
    }

    return response;
  } catch (error) {
    if (showError) {
      const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000, // Longer display for errors
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: {
          background: "#FF3333", // Red for errors
          color: "#fff",
          fontWeight: "bold",
        },
      });
    }

    // Return error response if available, or re-throw
    if (error.response) {
      return error.response;
    }
    throw error;
  }
};

export default handleRequest;