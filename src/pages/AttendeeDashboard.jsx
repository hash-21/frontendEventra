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
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import {
  CalendarMonth,
  Download,
  LocationOn,
  QrCode,
  CheckCircle,
  History,
} from "@mui/icons-material";
import { registrationAPI, eventAPI } from "../services/api";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const AttendeeDashboard = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [qrDialog, setQrDialog] = useState({
    open: false,
    qrUrl: "",
    eventName: "",
  });

  useEffect(() => {
    fetchMyRegistrations();
  }, []);

  const fetchMyRegistrations = async () => {
    try {
      setLoading(true);
      const response = await registrationAPI.getMyRegistrations();
      const registrations = response.data;
      setRegistrations(registrations);
      console.log("Fetched registrations:", registrations);

      // Separate upcoming and past events
      const now = new Date();
      const upcoming = [];
      const past = [];

      registrations.forEach((registration) => {
        const eventDate = new Date(registration.event.date);
        if (eventDate >= now) {
          upcoming.push(registration);
        } else {
          past.push(registration);
        }
      });

      setUpcomingEvents(
        upcoming.sort((a, b) => {
          return new Date(a.event.date) - new Date(b.event.date);
        }),
      );
      setPastEvents(
        past.sort((a, b) => {
          return new Date(b.event.date) - new Date(a.event.date);
        }),
      );
    } catch (error) {
      console.error("Failed to fetch registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewQR = (registration) => {
    if (registration.qr_code) {
      const fullBaseUrl =
        import.meta.env.VITE_DJANGO_BASE_URL || "http://localhost:8000";
      const baseUrl = fullBaseUrl.replace("/api", "");
      const qrUrl = registration.qr_code.startsWith("http")
        ? registration.qr_code
        : `${baseUrl}${registration.qr_code}`;

      setQrDialog({
        open: true,
        qrUrl: qrUrl,
        eventName: registration.event.title,
      });
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

  const handleCloseQRDialog = () => {
    setQrDialog({ open: false, qrUrl: "", eventName: "" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // const formatTime = (timeString) => {
  //   if (!timeString) return "";
  //   const [hours, minutes] = timeString.split(":");
  //   const hour = parseInt(hours);
  //   const ampm = hour >= 12 ? "PM" : "AM";
  //   const displayHour = hour % 12 || 12;
  //   return `${displayHour}:${minutes} ${ampm}`;
  // };

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

  const EventCard = ({ registration, isPast = false }) => (
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
        opacity: isPast ? 0.85 : 1,
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={getImageUrl(registration.event.banner_image)}
        alt={registration.event.title}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 2 }}>
          <Typography
            gutterBottom
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#450920",
              flex: 1,
              mb: 0,
            }}
          >
            {registration.event.title}
          </Typography>
          {isPast && (
            <Chip
              label="Past"
              size="small"
              icon={<History/>}
              sx={{
                backgroundColor: "#F9DBBD",
                color: "#ff939a",
                fontWeight: "500",
              }}
            />
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
          }}
        >
          <CalendarMonth sx={{ fontSize: "18px", color: "#450920" }} />
          <Typography variant="body2" sx={{ color: "#735751" }}>
            {formatDate(registration.event.date)}
          </Typography>
        </Box>

        {registration.event.location && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <LocationOn sx={{ fontSize: "18px", color: "#d32f2f" }} />
            <Typography variant="body2" sx={{ color: "#735751" }}>
              {registration.event.location}
            </Typography>
          </Box>
        )}

        {registration.event.category && (
          <Chip
            label={registration.event.category}
            size="small"
            sx={{
              backgroundColor: "#F9DBBD",
              color: "#DA627D",
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
          flexWrap: "wrap",
        }}
      >
        <Button
          size="small"
          variant="outlined"
          onClick={() => navigate(`/events/${registration.event.id}`)}
          sx={{ color: "#FFA5AB",borderColor:"#FFA5AB" }}
        >
          View Details
        </Button>
        {registration.qr_code && (
          <>
            <Button
              size="small"
              variant="outlined"
              startIcon={<QrCode />}
              onClick={() => handleViewQR(registration)}
              sx={{ color: "#DA627D",borderColor:"#DA627D" }}
            >
              View QR
            </Button>
            <Button
              size="small"
                        variant="outlined"

              startIcon={<Download />}
              onClick={() => handleDownloadQR(registration)}
              sx={{  color: "#A53860",borderColor:"#A53860" }}
            >
              Download
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#450920",
            mb: 1,
          }}
        >
          Attendee Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: "#DA627D" }}>
          Manage your event registrations and QR codes
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "#DA627D", mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange}  sx={{
      "& .MuiTabs-indicator": {
        backgroundColor: "#A53860",
      },
        "& .MuiTab-root.Mui-selected": {
      color: "#A53860",
    },
    }}>
              <Tab
                label={`Upcoming Events (${upcomingEvents.length})`}
                id="tab-0"
                textColor="#DA627D"
                aria-controls="tabpanel-0"
                sx={{ fontWeight: "500",color:"#DA627D" }}
              />
              {pastEvents.length > 0 && (
                <Tab
                  label={`Past Events (${pastEvents.length})`}
                  id="tab-1"
                  aria-controls="tabpanel-1"
                  sx={{ fontWeight: "500",color:"#DA627D" }}
                />
              )}
              <Tab
                label={`My QR Codes (${registrations.filter((r) => r.qr_code).length})`}
                id="tab-2"
                aria-controls="tabpanel-2"
                sx={{ fontWeight: "500",color:"#DA627D" }}
              />
            </Tabs>
          </Box>

          {/* Upcoming Events Tab */}
          <TabPanel value={tabValue} index={0}>
            {upcomingEvents.length === 0 ? (
              <Paper
                sx={{
                  p: 4,
                  textAlign: "center",
                  backgroundColor: "#F9DBBD",
                  border: "2px dashed #ccc",
                }}
              >
                <Typography variant="h6" sx={{ color: "#DA627D", mb: 2 }}>
                  No upcoming events
                </Typography>
                <Typography variant="body2" sx={{ color: "#DA627D", mb: 3 }}>
                  Register for an event to see it here.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate("/events")}
                  sx={{
                    backgroundColor: "#A53860",
                    "&:hover": { backgroundColor: "#A53860" },
                  }}
                >
                  Browse Events
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {upcomingEvents.map((registration) => (
                  <Grid item xs={12} sm={6} md={4} key={registration.id}>
                    <EventCard registration={registration} isPast={false} />
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>

          {/* Past Events Tab */}
          {pastEvents.length > 0 && (
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                {pastEvents.map((registration) => (
                  <Grid item xs={12} sm={6} md={4} key={registration.id}>
                    <EventCard registration={registration} isPast={true} />
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
          )}

          {/* QR Codes Tab */}
          <TabPanel value={tabValue} index={pastEvents.length > 0 ? 2 : 1}>
            {registrations.filter((r) => r.qr_code).length === 0 ? (
              <Paper
                sx={{
                  p: 4,
                  textAlign: "center",
                  backgroundColor: "#F9DBBD",
                  border: "2px dashed #ccc",
                }}
              >
                <Typography variant="h6" sx={{ color: "#DA627D", mb: 2 }}>
                  No QR codes available
                </Typography>
                <Typography variant="body2" sx={{ color: "#DA627D" }}>
                  Your QR codes will appear here once they're generated.
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={4}>
                {registrations
                  .filter((r) => r.qr_code)
                  .map((registration) => (
                    <Grid sx={{ xs: 12, sm: 6, md: 3 }} key={registration.id}>
                      <Card
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          p: 3,
                          textAlign: "center",
                          border:"#F9DBBD"
                        
                        }}
                      >
                        <QrCode
                          sx={{
                            fontSize: "48px",
                            color: "#FFA5AB",
                            mb: 2,
                          }}
                        />
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: "bold",
                            color: "#450920",
                            mb: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {registration.event.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "#666", mb: 2 }}
                        >
                          {formatDate(registration.event.date)}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            width: "100%",
                            justifyContent: "center",
                          }}
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<QrCode />}
                            onClick={() => handleViewQR(registration)}
                            sx={{
                              borderColor: "#DA627D ",
                              color: "#DA627D",
                              flex: 0.8,
                            }}
                          >
                            View
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Download />}
                            onClick={() => handleDownloadQR(registration)}
                            sx={{
                              borderColor: "#A53860",
                              color: "#A53860",
                              flex: 1,
                            }}
                          >
                            Download
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            )}
          </TabPanel>
        </>
      )}

      {/* QR Code Dialog */}
      <Dialog
        open={qrDialog.open}
        onClose={handleCloseQRDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "#333" }}>
          QR Code - {qrDialog.eventName}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", justifyContent: "center", py: 3 }}
        >
          {qrDialog.qrUrl && (
            <Box
              component="img"
              src={qrDialog.qrUrl}
              alt="QR Code"
              sx={{
                maxWidth: "100%",
                height: "auto",
                border: "2px solid #1976d2",
                borderRadius: "8px",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default AttendeeDashboard;
