import React from "react";
import { useAuth } from "../context/AuthContext";
import OrganizerDashboard from "./OrganizerDashboard";
import AttendeeDashboard from "./AttendeeDashboard";
import { CircularProgress, Box } from "@mui/material";

const Home = () => {
  const { user, loading } = useAuth();

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

  if (user?.role === "organizer") {
    return <OrganizerDashboard />;
  } else if (user?.role === "attendee") {
    return <AttendeeDashboard />;
  }

  return (
    <Box sx={{ textAlign: "center", py: 8 }}>
      <CircularProgress />
    </Box>
  );
};

export default Home;
