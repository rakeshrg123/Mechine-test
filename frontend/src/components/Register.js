import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Grid2,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService"; // Import the register function from authService
import "../style/Login.scss";
import NavBar from "./Navbar";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true when form is submitted

    // Call the register function from the authService and handle promise resolution/rejection
    register({ name, email, password, confirmPassword })
      .then((user) => {
        setLoading(false); // Reset loading state after successful registration
        navigate("/"); // Redirect to home or login page after registration
        console.log("Registered user successfully");
      })
      .catch((err) => {
        setLoading(false); // Reset loading state after failure
        // Handle errors returned from the register API call
        setError(err.response.data.message);
        console.log(err.response.data.message);
      });
  };

  return (
    <>
    <NavBar></NavBar>
    <Container maxWidth="sm" className="login-container">
      <Paper elevation={3} className="login-paper">
        <Typography variant="h5" align="center" className="login-title">
          Register
        </Typography>
        <form onSubmit={handleSubmit} className="login-form">
          <Grid2 container spacing={2}>
            <Grid2 item size={12}>
              <TextField
                label="Full Name"
                type="text"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
              />
            </Grid2>
            <Grid2 item size={12}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
              />
            </Grid2>
            <Grid2 item size={12}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
              />
            </Grid2>
            <Grid2 item size={12}>
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                variant="outlined"
              />
            </Grid2>
            {error && (
              <Grid2 item size={12}>
                <Typography color="error" className="error-message">
                  {error}
                </Typography>
              </Grid2>
            )}
            <Grid2 item size={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading} // Disable button while loading
              >
                {loading ? (
                  <CircularProgress size={24} color="secondary" /> // Show loader when loading
                ) : (
                  "Register"
                )}
              </Button>
            </Grid2>
            <Grid2 item size={12} className="login-footer">
              <Typography variant="body2" align="center">
                Already have an account? <Link to={"/"}>Login</Link>
              </Typography>
            </Grid2>
          </Grid2>
        </form>
      </Paper>
    </Container>
    </>
  );
};

export default Register;
