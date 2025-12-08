import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "./utils/api";

const Logout = () => {
  const navigate = useNavigate();

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const sendLogoutRequest = async () => {
    try {
      const res = await apiFetch('/api/v1/logout');

      const data = await res.json();
      
      if (data.error) {
        setSnackbarMessage(data.error);
        setShowToast(true);
      }

      if (data.ok) {
        // Clear session storage
        // sessionStorage.removeItem("token");
        // sessionStorage.removeItem("baseUrl");

        // Or clear ALL session storage:
        // sessionStorage.clear();
        // setSnackbarMessage(data.ok);
        // setShowToast(true);

        // Redirect to login page
        // navigate("/login");
      }
    } catch (err) {
      setSnackbarMessage(err.messaage);
      setShowToast(true);
    }

  };

  useEffect(() => {
    sendLogoutRequest();

    sessionStorage.clear();

    // Redirect to login page
    navigate("/login");
  }, []);

  return null; // No UI needed
};

export default Logout;
