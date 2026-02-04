import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(formData.email, formData.password);
    console.log(result);

    if (result.success) {
      navigate("/");
    } else {
      let errorMsg = result.error;
      if (typeof errorMsg === "object") {
        errorMsg =
          errorMsg.error ||
          errorMsg.email?.[0] ||
          errorMsg.password?.[0] ||
          JSON.stringify(errorMsg) ||
          "Login failed";
      }
      setError(errorMsg);
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#DA627D",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          maxWidth: 350,
          padding: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor:"#F9DBBD"
        }}
      >
        <Typography variant="h5" align="center" >
          Sign In
        </Typography>

        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, backgroundColor: "#A53860" }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </form>

        <Typography align="center" sx={{ mt: 1 }}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color:"#DA627D" }}>
            Sign up
          </Link>
        </Typography>
      </Card>
    </Box>
  );
};

export default Login;
