import { useState, useEffect } from "react";
import { School } from "../types/School";
import { fetchSchools } from "../services/SchoolService";
import useError from "./useError"; // Import the error hook

export default function useFetchSchools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { errors, setError, clearError } = useError(); // Use the error hook

  useEffect(() => {
    clearError(); // Clear any previous error before making a new request

    fetchSchools()
      .then((data) => {
        if (data && data.length > 0) {
          setSchools(data);
        } else {
          setSchools([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching school data.");
        console.error("Error fetching school data:", error);
        setLoading(false);
      });
  }, []);

  return { schools, setSchools, loading };
}
