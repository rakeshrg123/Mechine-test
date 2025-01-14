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
import "../style/Login.scss";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService"; // Import login function from authService
import NavBar from "./Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted

    login({ email, password })
      .then((res) => {
        setLoading(false); // Reset loading after successful login
        setError(""); // Reset error on success
        console.log(res.user.role);
        if (res.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/products");
        }
      })
      .catch((err) => {
        setLoading(false); // Reset loading on error
        setError(err.response.data.error); // Set error message
        console.log(err.response.data.error);
      });
  };

  return (
    <>
        <NavBar></NavBar>
    <Container maxWidth="sm" className="login-container">
      <Paper elevation={3} className="login-paper">
        <Typography variant="h5" align="center" className="login-title">
          Login
        </Typography>
        <form onSubmit={handleSubmit} className="login-form">
          <Grid2 container spacing={2}>
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
                disabled={loading} // Disable the button when loading
              >
                {loading ? (
                  <CircularProgress size={24} color="secondary" /> // Show loading spinner when loading
                ) : (
                  "Login"
                )}
              </Button>
            </Grid2>
            <Grid2 item size={12} className="login-footer">
              <Typography variant="body2" align="center">
                Don’t have an account? <Link to={"/register"}>Register</Link>
              </Typography>
            </Grid2>
          </Grid2>
        </form>
      </Paper>
    </Container>
    </>
  );
};

export default Login;
