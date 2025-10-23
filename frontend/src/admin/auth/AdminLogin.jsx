import { useState } from "react";
import { TextField, Button, Paper, Typography } from "@mui/material";
import axios from 'axios'
import { useNavigate } from "react-router-dom";


export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/admin/login`, formData, { withCredentials: true });
      console.log(response.data.message);
       navigate("/secret/admin/dashboard");
    } catch (error) {
      if (error.response) {
        console.log("Error :", error.response);
        console.log(error.response.data.message);
      } else {
        console.log('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#111",
        padding: "2rem",
      }}
    >

        <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              name="email"
              placeholder="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: "#f8f3e9" } }}
              inputProps={{ style: { color: "white" } }}
              sx={{
                fieldset: { borderColor: "#f8f3e9" },
                "&:hover fieldset": { borderColor: "#d4af37 !important" },
                "&.Mui-focused fieldset": { borderColor: "#d4af37 !important" },
              }}
            />

            <TextField
              label="Password"
              type="password"
              name="password"
              placeholder="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: "#f8f3e9" } }}
              inputProps={{ style: { color: "white" } }}
              sx={{
                fieldset: { borderColor: "#f8f3e9" },
                "&:hover fieldset": { borderColor: "#d4af37 !important" },
                "&.Mui-focused fieldset": { borderColor: "#d4af37 !important" },
              }}
            />
            <Button
            type="submit"
            fullWidth
            variant="contained"
            style={{
              marginTop: "1.5rem",
              backgroundColor: "#750202",
              color: "#f8f3e9",
              fontWeight: "600",
              padding: "12px",
              borderRadius: "10px",
              textTransform: "none",
            }}
          >
            Login
          </Button>
        </form>
    </div>
  );
}
