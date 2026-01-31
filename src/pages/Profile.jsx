import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  CircularProgress,
  Avatar,
  Grid,
  Chip,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import {
  Email,
  Person,
  Edit,
  Event,
  AppRegistration,
  Dashboard,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getProfile();
      setProfile(response.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("Failed to load profile information");
    } finally {
      setLoading(false);
    }
  };

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

  if (error || !profile) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="error" variant="h6" sx={{ mb: 2 }}>
            {error || "Failed to load profile"}
          </Typography>
          <Button
            variant="contained"
            onClick={fetchProfile}
            sx={{
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Profile Header */}
      <Box sx={{ mb: 4 }}>
        <Paper
          sx={{
            p: 4,
            background: "#A53860",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                fontSize: "2.5rem",
                backgroundColor: "rgba(255, 255, 255, 0.3)",
              }}
            >
              {profile?.full_name?.[0] || profile?.email?.[0]}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                {profile?.full_name || "User Profile"}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {profile?.email}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => navigate("/profile/edit")}
              sx={{
                backgroundColor: "#FFA5AB",
                color:"#450920",

                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
              }}
            >
              Edit Profile
            </Button>
          </Box>
        </Paper>
      </Box>

      <Grid container spacing={3} >
        <Grid size={{ xs: 12 }} >
          <Card sx={{p:5}}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                <Person sx={{ mr: 1, verticalAlign: "middle" }} />
                Personal Information
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                    Full Name
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "500" }}>
                    {profile?.full_name || "N/A"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                    Email
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "500", wordBreak: "break-all" }}
                  >
                    {profile?.email || "N/A"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                    Role
                  </Typography>
                  <Chip
                    label={
                      profile?.role?.charAt(0).toUpperCase() +
                      profile?.role?.slice(1)
                    }
                    sx={{
                      backgroundColor:
                        profile?.role === "organizer" ? "#F9DBBD" : "#F9DBBD",
                      color:
                        profile?.role === "organizer" ? "#450920" : "#DA627D",
                      fontWeight: "bold",
                    }}
                  />
                </Box>

                {profile?.interests && (
                  <Box>
                    <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                      Interests
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "500" }}>
                      {profile.interests}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

      
      </Grid>
    </Container>
  );
};

export default Profile;
