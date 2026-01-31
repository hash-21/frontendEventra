import React, { useEffect, useState } from "react";
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
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  CalendarMonth,
  CheckCircle,
  Download,
  LocationOn,
  Schedule,
} from "@mui/icons-material";
import { registrationAPI } from "../services/api";

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unregistering, setUnregistering] = useState(null);
  const [checkInDialog, setCheckInDialog] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [registrationCode, setRegistrationCode] = useState("");

  useEffect(() => {
    fetchMyRegistrations();
  }, []);

  const fetchMyRegistrations = async () => {
    try {
      setLoading(true);
      const response = await registrationAPI.getMyRegistrations();
      setRegistrations(response.data);

    } catch (error) {
      console.error("Failed to fetch registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async (eventId) => {
    if (
      window.confirm("Are you sure you want to unregister from this event?")
    ) {
      try {
        setUnregistering(eventId);
        await registrationAPI.unregisterFromEvent(eventId);
        setRegistrations(
          registrations.filter((reg) => reg.event.id !== eventId),
        );
      } catch (error) {
        console.error("Failed to unregister:", error);
        alert("Failed to unregister from event");
      } finally {
        setUnregistering(null);
      }
    }
  };

  const handleDownloadQR = (registration) => {
    if (registration.qr_code) {
      const fullBaseUrl =
        import.meta.env.VITE_DJANGO_BASE_URL || "http://localhost:8000";
      const baseUrl = fullBaseUrl.replace("/api", "");
      const qrUrl = registration.qr_code.startsWith("http")
        ? registration.qr_code
        : `${baseUrl}${registration.qr_code}`;

      const link = document.createElement("a");
      link.href = qrUrl;
      link.download = `qr_${registration.registration_code}.png`;
      link.click();
    }
  };

  const handleOpenCheckIn = (registration) => {
    setQrCode(registration);
    setCheckInDialog(true);
  };

  const handleCloseCheckIn = () => {
    setCheckInDialog(false);
    setQrCode(null);
    setRegistrationCode("");
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;

    // Extract base URL without /api suffix for media files
    const fullBaseUrl =
      import.meta.env.VITE_DJANGO_BASE_URL || "http://localhost:8000";
    const baseUrl = fullBaseUrl.replace("/api", "");

    return `${baseUrl}${imagePath}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;

      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
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

  if (registrations.length === 0) {
    return (
      <Container sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" color="textSecondary" gutterBottom>
            You haven't registered for any events yet
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Browse events and register to attend exciting gatherings!
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4, color:"#DA627D" }}>
        My Registrations
      </Typography>

      <Grid container spacing={3}>
        {registrations.map((registration) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={registration.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 4,
                },
              }}
            >
              {/* Banner Image */}
              {registration.event.banner_image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={getImageUrl(registration.event.banner_image)}
                  alt={registration.event.title}
                />
              )}

              {/* Check-in Status Badge */}
              {registration.checked_in && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "rgba(76, 175, 80, 0.9)",
                    borderRadius: "50%",
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <CheckCircle sx={{ color: "white" }} />
                </Box>
              )}

              <CardContent sx={{ flex: 1 }}>
                <Chip
                  label={registration.event.category}
                  size="small"
                  color="primary"
                  sx={{ mb: 1, backgroundColor: "#F9DBBD", color: "#DA627D" }}
                />
                <Typography variant="h6" fontWeight="bold" noWrap sx={{color:"#450920"}}>
                  {registration.event.title}
                </Typography>

                {/* Date & Time */}
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}
                >
                  <CalendarMonth sx={{ fontSize: 18, color: "#450920" }} />
                  <Typography variant="body2">
                    {formatDate(registration.event.date)}
                  </Typography>
                </Box>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
                >
                  <Schedule sx={{ fontSize: 18, color: "primary.main" }} />
                  <Typography variant="body2" >
                    {formatTime(registration.event.start_time)} -{" "} {formatTime(registration.event.end_time)}
                  </Typography>
                </Box>

                {/* Location */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                    mt: 1,
                  }}
                >
                  <LocationOn
                    sx={{ fontSize: 18, color: "red", mt: 0.5 }}
                  />
                  <Typography variant="body2">
                    {registration.event.city}, {registration.event.country}
                  </Typography>
                </Box>

                {/* Registration Code */}
                <Box sx={{ mt: 2, p: 1, bgcolor: "#F9DBBD", borderRadius: 1 }}>
                  <Typography variant="caption" color="textSecondary">
                    Registration Code
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    sx={{ fontFamily: "monospace",color:"#450920" }}
                  >
                    {registration.registration_code}
                  </Typography>
                </Box>

                {/* Check-in Status */}
                {registration.checked_in && (
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      icon={<CheckCircle />}
                      label={`Checked in at ${new Date(
                        registration.checked_in_at,
                      ).toLocaleTimeString()}`}
                      color="success"
                      size="small"
                    />
                  </Box>
                )}
              </CardContent>

              <CardActions sx={{ flexDirection: "column", gap: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ color: "#A53860", borderColor: "#A53860" }}
                  size="small"
                  startIcon={<Download />}
                  onClick={() => handleDownloadQR(registration)}
                  disabled={!registration.qr_code}
                >
                  Download QR Code
                </Button>

                {!registration.checked_in && (
                  <Button
                    fullWidth
                    sx={{ color: "#A53860", borderColor: "#A53860" }}
                    variant="contained"
                    size="small"
                    onClick={() => handleOpenCheckIn(registration)}
                  >
                    Check In
                  </Button>
                )}

                {!registration.checked_in &&(<Button
                  fullWidth
                  variant="outlined"
                  sx={{ color: "#A53860", borderColor: "#A53860" }}
                  size="small"
                  onClick={() => handleUnregister(registration.event.id)}
                  disabled={unregistering === registration.event.id}
                >
                  {unregistering === registration.event.id
                    ? "Unregistering..."
                    : "Unregister"}
                </Button>)}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Check-in Dialog */}
      <Dialog
        open={checkInDialog}
        onClose={handleCloseCheckIn}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Check In</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {qrCode && (
            <Box>
              {/* QR Code Display */}
              {qrCode.qr_code && (
                <Box sx={{ mb: 3, textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    Your QR Code
                  </Typography>
                  <Box
                    component="img"
                    src={getImageUrl(qrCode.qr_code)}
                    alt="QR Code"
                    sx={{ maxWidth: "100%", height: "auto" }}
                  />
                </Box>
              )}

              {/* Registration Code Input */}
              <TextField
                fullWidth
                label="Registration Code"
                value={qrCode.registration_code}
                disabled
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
              />

              <Typography variant="body2" color="textSecondary">
                Event: {qrCode.event.title}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default MyRegistrations;
