import React from "react";
import { useAuth } from "../context/AuthContext";
import {
  CircularProgress,
  Box,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import { Navigate, useNavigate, Outlet } from "react-router-dom";

const RoleBasedRoute = ({ requiredRole }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role
  const userRole = user?.role;
  if (userRole !== requiredRole) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          px: 2,
        }}
      >
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            maxWidth: 500,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", mb: 2, color: "#d32f2f" }}
          >
            Access Denied
          </Typography>
          <Typography variant="body1" sx={{ color: "#666", mb: 3 }}>
            You don't have permission to access this page. This dashboard is
            only available for{" "}
            {requiredRole === "organizer" ? "event organizers" : "attendees"}.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={() => navigate("/")}
              sx={{
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
            >
              Go to Home
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{
                borderColor: "#1976d2",
                color: "#1976d2",
                "&:hover": {
                  borderColor: "#1565c0",
                  backgroundColor: "rgba(25, 118, 210, 0.04)",
                },
              }}
            >
              Go Back
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return <Outlet />;
};

export default RoleBasedRoute;
