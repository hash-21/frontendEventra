import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  CalendarMonth,
  People,
  Warning,
} from "@mui/icons-material";
import { eventAPI } from "../services/api";

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    eventId: null,
    eventName: "",
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getMyEvents();
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (event) => {
    setDeleteDialog({
      open: true,
      eventId: event.id,
      eventName: event.title,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      await eventAPI.deleteEvent(deleteDialog.eventId);
      setEvents(events.filter((e) => e.id !== deleteDialog.eventId));
      setDeleteDialog({ open: false, eventId: null, eventName: "" });
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Failed to delete event");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, eventId: null, eventName: "" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/400x200?text=Event";
    if (imagePath.startsWith("http")) return imagePath;

    let baseUrl =
      import.meta.env.VITE_DJANGO_BASE_URL || "http://localhost:8000/api";
    if (baseUrl.endsWith("/api")) {
      baseUrl = baseUrl.slice(0, -4);
    }

    return `${baseUrl}${imagePath}`;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#333",
              mb: 1,
            }}
          >
            Organizer Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: "#666" }}>
            Manage your events and registrations
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/events/create/")}
          sx={{
            backgroundColor: "#1976d2",
            "&:hover": { backgroundColor: "#1565c0" },
            px: 3,
            py: 1.5,
          }}
        >
          Create New Event
        </Button>
      </Box>

      {/* My Events Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#333",
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CalendarMonth />
          My Events
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : events.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              backgroundColor: "#f5f5f5",
              border: "2px dashed #ccc",
            }}
          >
            <Typography variant="h6" sx={{ color: "#666", mb: 2 }}>
              No events yet
            </Typography>
            <Typography variant="body2" sx={{ color: "#999", mb: 3 }}>
              Create your first event to get started managing registrations and
              attendees.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/events/create/")}
              sx={{
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
            >
              Create Event
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "box-shadow 0.3s ease, transform 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={getImageUrl(event.image)}
                    alt={event.title}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "#333",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {event.title}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <CalendarMonth
                        sx={{ fontSize: "18px", color: "#1976d2" }}
                      />
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        {formatDate(event.date)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <People sx={{ fontSize: "18px", color: "#1976d2" }} />
                      <Typography variant="body2" sx={{ color: "#666" }}>
                        {event.registration_count || 0} Registered
                      </Typography>
                    </Box>

                    {event.category && (
                      <Chip
                        label={event.category}
                        size="small"
                        sx={{
                        backgroundColor: "#b388ff",
                        color:"white" ,
                          fontWeight: "500",
                        }}
                      />
                    )}
                  </CardContent>

                  <CardActions
                    sx={{
                      display: "flex",
                      gap: 1,
                      padding: "16px",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => navigate(`/events/${event.id}`)}
                      sx={{ color: "#1976d2" }}
                    >
                      Details
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => navigate(`/events/${event.id}/edit`)}
                      sx={{ color: "#f57c00" }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Delete />}
                      onClick={() => handleDeleteClick(event)}
                      sx={{ color: "#d32f2f" }}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={handleDeleteCancel}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Warning sx={{ color: "#d32f2f" }} />
          Delete Event
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.eventName}"? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} sx={{ color: "#666" }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{ backgroundColor: "#d32f2f" }}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrganizerDashboard;
