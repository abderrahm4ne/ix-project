import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute({ children }) {
  const [isVerified, setIsVerified] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/users/admin/verify`, { withCredentials: true })
      .then(res => {
        if (res.data.valid && res.data.role === "admin") {
          setIsVerified(true);
        } else {
          setIsVerified(false);
        }
      })
      .catch(() => setIsVerified(false));
  }, []);

  if (isVerified === null) {
    return <p>Checking authentication...</p>;
  }

  if (!isVerified) {
    alert("You must be logged in as an admin to access this page.");
    return <Navigate to="/secret/admin" replace />;
  }

  return children;
}
