import { useState } from 'react';
import { toast } from 'react-toastify';

/**
 * Custom hook for API calls with loading, error, and success handling
 */
export const useAPI = (apiFunction, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunction(...args);
      setData(response.data);
      
      if (options.successMessage) {
        toast.success(options.successMessage, {
          position: 'top-right',
          autoClose: 2000,
        });
      }

      if (options.onSuccess) {
        options.onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      setError(err.message || 'An error occurred');
      
      if (options.errorMessage) {
        toast.error(options.errorMessage, {
          position: 'top-right',
          autoClose: 3000,
        });
      }

      if (options.onError) {
        options.onError(err);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, execute };
};

export default useAPI;
