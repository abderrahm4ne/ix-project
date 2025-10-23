import { useState } from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import { 
  Email, 
  Phone, 
  LocationOn, 
  Schedule 
} from "@mui/icons-material";
import axios from 'axios'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [inValid, setInValid] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/send-message`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      setFormData({ name: "", email: "", subject: "", message: "" });
      setInValid({});
      showSnackbar("Message sent successfully!", "success");
    } catch (err) {
      console.error("error occured:", err.message);
      setInValid(err.response?.data?.errors || {});
      showSnackbar("Failed to send message. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#ffffff] to-[#949494] pb-20">

      {/* Hero Section */}
      <div className="container mx-auto px-6 mb-6 py-6">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-logo mb-2 brand-title" style={{ textShadow: '-2px 3px 6px rgba(0, 0, 0, 0.3)' }}>
            Get In Touch
          </h2>
          <p className="brand-title fonts-routes italic text-lg mb-8">
            "We'd love to hear from you. Reach out to us with any questions or inquiries."
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Contact Form */}
          <div className="lg:w-1/2">
            <div className="bg-[#dbdbdb] rounded-xl p-8 shadow-lg" style={{ boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}>
              <h3 className="text-3xl mb-6 brand-title tracking-tighter" style={{ textShadow: '-2px 3px 6px rgba(0, 0, 0, 0.3)' }}>
                Send Us a Message
              </h3>
              
              <form onSubmit={handleSubmit}>
                {["name", "email", "subject"].map((field) => (
                  <div className="mb-6" key={field}>
                    <TextField
                      fullWidth
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      name={field}
                      type={field === "email" ? "email" : "text"}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                      error={!!inValid[field]}
                      helperText={inValid[field] || ""}
                      InputLabelProps={{ style: { color: "#3B3B3B" } }}
                      InputProps={{ style: { color: "#3B3B3B" } }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#3B3B3B" },
                          "&:hover fieldset": { borderColor: "#3B3B3B" },
                          "&.Mui-focused fieldset": { borderColor: "#3B3B3B" },
                        },
                      }}
                    />
                  </div>
                ))}

                <div className="mb-6">
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Your Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    error={!!inValid.message}
                    helperText={inValid.message || ""}
                    InputLabelProps={{ style: { color: "#3B3B3B" } }}
                    InputProps={{ style: { color: "#3B3B3B" } }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#3B3B3B" },
                        "&:hover fieldset": { borderColor: "#3B3B3B" },
                        "&.Mui-focused fieldset": { borderColor: "#3B3B3B" },
                      },
                    }}
                  />
                </div>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  style={{
                    backgroundColor: "#3B3B3B",
                    textTransform: "none",
                    padding: "12px",
                    fontSize: "1.1rem",
                    color: "#f8f3e9",
                    border: "1px solid #3B3B3B",
                  }}
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
          
          {/* Contact Information */}   
          <div className="lg:w-1/2">
            <div className="bg-[#dbdbdb] rounded-xl p-8 shadow-lg h-full" style={{ boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}>
              <h3 className="text-4xl mb-6 brand-title tracking-tighter" style={{ textShadow: '-1px -3px 6px rgba(0, 0, 0, 0.3)' }}>Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <LocationOn className="brand-title mr-4 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold brand-title mb-1">Address</h4>
                    <p className="brand-title">Algiers, Alger</p>
                    <p className="brand-title">Bordj El Kiffan , Dergana</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="brand-title mr-4 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold brand-title mb-1">Phone</h4>
                    <p className="brand-title">+213 550968087</p>
                    <p className="brand-title">+213 XXXXXXXX</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Email className="brand-title mr-4 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold brand-title mb-1">Email</h4>
                    <p className="brand-title">nadzheeeSupport1@gmail.com</p>
                    <p className="brand-title">nadzheeeSupport2@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Schedule className="brand-title mr-4 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold brand-title mb-1">Business Hours</h4>
                    <p className="brand-title">Saturday - Wednesday: 9AM - 6PM</p>
                    <p className="brand-title">Thuesday: 10AM - 3PM</p>
                    <p className="brand-title">Friday: Closed</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <h4 className="text-lg font-semibold brand-title mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  {['Instagram','Facebook' ].map((social) => (
                    <div 
                      key={social}
                      className="border brand-title px-4 py-2 rounded-full cursor-pointer hover:text-[#3B3B3B] "
                    >
                      {social}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="container mx-auto px-6 mt-16">
        <div className="bg-gradient-to-r from-[#ffffff] to-[#949494] rounded-xl p-8 shadow-lg" style={{ boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}>
          <h3 className="text-3xl mb-6 brand-title tracking-tighter text-center" style={{ textShadow: '3px -3px 6px rgba(0, 0, 0, 0.3)' }}>Find Us</h3>
          <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1735.1554019381995!2d3.2428107153839907!3d36.77819809423424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128e4f294680e335%3A0x1292df2e4508a8be!2sELETROMENAGERS%20AUX%20MEILLEURS%20PRIX!5e1!3m2!1sen!2sdz!4v1758467413549!5m2!1sen!2sdz"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </div>
  );
}