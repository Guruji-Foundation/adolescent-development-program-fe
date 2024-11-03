import { useState } from "react";

const useError = () => {
  const [errors, setErrors] = useState([]); // Store errors in an array

  const setError = (newError) => {
    setErrors((prevErrors) => [...prevErrors, newError]); // Add new error to the list
  };

  const clearError = () => {
    setErrors([]); // Clear all errors
  };

  return { errors, setError, clearError };
};

export default useError;
