import { useNavigate } from 'react-router-dom';
import dayjs from "dayjs";

// Create a wrapper for fetch that handles 401 responses
export const apiFetch = async (url, options = {}) => {
  // Add base URL if not present
  const baseUrl = sessionStorage.getItem("baseUrl") || "";
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

  // Add default headers including authorization
  const token = sessionStorage.getItem("token");
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers: defaultHeaders
    });

    // Handle 401 Unauthorized
    if (response.status === 401) {
      console.log('401 Unauthorized - redirecting to login');
      // Clear invalid token
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("baseUrl");

      // Redirect to login - using window.location for immediate redirect
      window.location.href = '/login';
      return;
    }

    return response;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Export the base URL getter for convenience
export const getBaseUrl = () => sessionStorage.getItem("baseUrl") || "";
export const getToken = () => sessionStorage.getItem("token");

// Convert Unix timestamp to RFC3339 format
export const convertUnixtoRFC3339 = (unixTimestamp) => {
    if (!unixTimestamp) return '';

    try {
    //   return dayjs.unix(unixTimestamp).format("YYYY-MM-DD HH:mm:ss");
      return dayjs.unix(unixTimestamp).format("YYYY-MM-DD");
    } catch (error) {
      return unixTimestamp; // Fallback to original value if conversion fails
    }
};
