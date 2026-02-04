import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { eventAPI, registrationAPI, sessionAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import SessionCard from "../components/SessionCard";
import SessionForm from "./SessionForm";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
  Alert,
} from "@mui/material";
import {
  CalendarMonth,
  Delete,
  Edit,
  LocationOn,
  Person,
  Schedule,
  AddCircle,
} from "@mui/icons-material";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [sessionFormOpen, setSessionFormOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  useEffect(() => {
    fetchEventDetail();
  }, [id]);

  const fetchEventDetail = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getEventDetail(id);
      setEvent(response.data);
      setIsRegistered(response.data.is_registered || false);

      await fetchSessions();
    } catch (error) {
      console.error("Failed to fetch event:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      setSessionsLoading(true);
      const response = await sessionAPI.getEventSessions(id);
      setSessions(response.data);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Do you want to delete this event?")) {
      try {
        await eventAPI.deleteEvent(id);
        navigate("/events");
      } catch (error) {
        console.error("Failed to delete the event:", error);
        alert("Failed to delete event");
      }
    }
  };

  const handleRegister = async () => {
    try {
      setRegistering(true);
      await registrationAPI.registerForEvent(id);
      setIsRegistered(true);

      alert("Successfully registered for the event!");
      fetchEventDetail();
    } catch (error) {
      console.error("Failed to register:", error);
      const errorMsg =
        error.response?.data?.error || "Failed to register for the event";
      alert(errorMsg);
    } finally {
      setRegistering(false);
    }
  };

  const handleUnregister = async () => {
    if (
      window.confirm("Are you sure you want to unregister from this event?")
    ) {
      try {
        setRegistering(true);
        await registrationAPI.unregisterFromEvent(id);
        setIsRegistered(false);
        alert("Successfully unregistered from the event!");
        fetchEventDetail();
      } catch (error) {
        console.error("Failed to unregister:", error);
        alert("Failed to unregister from the event");
      } finally {
        setRegistering(false);
      }
    }
  };

  const handleSessionFormClose = () => {
    setSessionFormOpen(false);
    setEditingSession(null);
  };

  const handleSessionFormSuccess = async () => {
    await fetchSessions();
    handleSessionFormClose();
  };

  const handleEditSession = (session) => {
    setEditingSession(session);
    setSessionFormOpen(true);
  };

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        await sessionAPI.deleteSession(sessionId);
        alert("Session deleted successfully!");
        await fetchSessions();
      } catch (error) {
        console.error("Failed to delete session:", error);
        alert("Failed to delete session");
      }
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl =
      import.meta.env.VITE_DJANGO_BASE_URL || "http://localhost:8000";
    return `${baseUrl}${imagePath}`;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!event) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5">Event not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ overflow: "hidden" }}>
        {/* Banner Image */}
        {event.banner_image && (
          <Box
            component="img"
            src={getImageUrl(event.banner_image)}
            alt={event.title}
            sx={{
              width: "100%",
              height: 400,
              objectFit: "cover",
            }}
          />
        )}

        <Box sx={{ p: 4 }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              mb: 3,
            }}
          >
            <Box>
              <Chip label={event.category} color="primary" sx={{ mb: 2,backgroundColor:"#F9DBBD",color:"#DA627D" }} />
              <Typography variant="h3" fontWeight="bold" gutterBottom sx={{color:"#450920"}}>
                {event.title}
              </Typography>
            </Box>

            {user?.id === event.organizer?.id  && isAuthenticated && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  sx={{color:"#A53860",borderColor:"#A53860"}}
                  startIcon={<Edit />}
                  onClick={() => navigate(`/events/${id}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </Box>
            )}
          </Box>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <CalendarMonth color="primary"  />
                <Typography variant="h6" color="#621708">{formatDate(event.date)}</Typography>
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Schedule color="#14213d" />
                <Typography variant="body1" color="#621708">
                  {event.start_time} - {event.end_time}
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
              >
                <LocationOn color="error" />
                <Typography variant="body1" color="#621708">
                  {event.venue_name}, {event.location}
                  <br />
                  {event.city}, {event.country}
                </Typography>
              </Box>

              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{ mt: 4,color:"#450920" }}
              >
                About This Event
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-line",color:"#621708" }}>
                {event.description}
              </Typography>

              {event.tags && event.tags.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Tags
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {event.tags.map((tag, index) => (
                      <Chip key={index} label={tag} variant="outlined"  />
                    ))}
                  </Box>
                </Box>
              )}

              <Box sx={{ mt: 6 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h5" fontWeight="bold" color="#450920">
                    📋 Event Schedule ({sessions.length} sessions)
                  </Typography>

                  {event.organizer &&
                    isAuthenticated &&
                    user?.id === event.organizer.id && (
                      <Button
                        variant="contained"
                        startIcon={<AddCircle />}
                        onClick={() => {
                          setEditingSession(null);
                          setSessionFormOpen(true);
                        }}
                        sx={{
                          backgroundColor:"#A53860"
                        }}
                      >
                        Add Session
                      </Button>
                    )}
                </Box>

                {sessionsLoading ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", py: 4 }}
                  >
                    <CircularProgress />
                  </Box>
                ) : sessions.length === 0 ? (
                  <Alert severity="info">No sessions scheduled yet</Alert>
                ) : (
                  <Box>
                    {sessions.map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        onEdit={
                          event.organizer &&
                          isAuthenticated &&
                          user?.id === event.organizer.id
                            ? handleEditSession
                            : null
                        }
                        onDelete={
                          event.organizer &&
                          isAuthenticated &&
                          user?.id === event.organizer.id
                            ? handleDeleteSession
                            : null
                        }
                        showActions={
                          event.organizer &&
                          isAuthenticated &&
                          user?.id === event.organizer.id
                        }
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper elevation={2} sx={{ p: 3, position: "sticky", top: 20 }}>
                {event.organizer && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom color="#DA627D">
                      Organized by
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "#ff4d6d" }}>
                        {event.organizer.first_name?.[0]}
                      </Avatar>
                      <Typography variant="body1" color="#14213d">
                        {event.organizer.full_name}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Capacity */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom color="#DA627D">
                    Attendance
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Person color="#1a3d14" />
                    <Typography variant="body1" color="#14213d">
                      {event.total_registrations} / {event.capacity} registered

                    </Typography>
                  </Box>
                  {event.is_full && (
                    <Chip
                      label="Event Full"
                      color="error"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}
                </Box>

                {isAuthenticated && !event.is_full && (
                  <>
                    {!isRegistered ? (
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={handleRegister}
                        disabled={registering}
                        sx={{
                          backgroundColor:"#A53860",

                        }}
                      >
                        {registering ? "Registering..." : "Register Now"}
                      </Button>

                    ) : (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          fullWidth
                          sx={{backgroundColor:"#DA627D"}}
                          variant="contained"
                          disabled
                        >
                          ✓ Registered
                        </Button>
                        <Button
                          variant="outlined"
                          sx={{minWidth: 120,color:"#A53860",borderColor:"#A53860"}}
                          onClick={handleUnregister}
                          disabled={registering}
                        >
                          {registering ? "..." : "Unregister"}
                        </Button>
                      </Box>
                    )}
                  </>
                )}

                {!isAuthenticated && (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate("/login")}
                  >
                    Login to Register
                  </Button>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Session Form Dialog */}
      <SessionForm
        open={sessionFormOpen}
        onClose={handleSessionFormClose}
        onSuccess={handleSessionFormSuccess}
        eventId={id}
        editSession={editingSession}
      />
    </Container>
  );
};

export default EventDetail;
