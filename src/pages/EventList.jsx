import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { eventAPI } from "../services/api";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { CalendarMonth, LocationOn, Person } from "@mui/icons-material";

const EventList = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    city: "",
    search: "",
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventAPI.getAllEvents(filters);
        setEvents(response.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
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
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Discover Events
        </Typography>
        {isAuthenticated && (
          <Button
            variant="contained"
            onClick={() => navigate("/events/create/")}
            sx={{
              background: "#A53860",
             
            }}
          >
            Create Event
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          label="Search"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          size="small"
          sx={{ minWidth: 200 }}
        />

        <TextField
          select
          label="Category"
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All Categories</MenuItem>
          <MenuItem value="technology">Technology</MenuItem>
          <MenuItem value="business">Business</MenuItem>
          <MenuItem value="health">Health & Wellness</MenuItem>
          <MenuItem value="education">Education</MenuItem>
          <MenuItem value="arts">Arts & Culture</MenuItem>
          <MenuItem value="sports">Sports & Fitness</MenuItem>
          <MenuItem value="food">Food & Drink</MenuItem>
          <MenuItem value="music">Music</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </TextField>

        <TextField
          label="City"
          name="city"
          value={filters.city}
          onChange={handleFilterChange}
          size="small"
          sx={{ minWidth: 150 }}
        />
      </Box>

      {/* Events Grid */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : events.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No events found
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={event.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={getImageUrl(event.banner_image)}
                  alt={event.title}
                  sx={{ objectFit: "cover" }}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  <Chip
                    label={event.category}
                    size="small"
                    sx={{ mb: 1, backgroundColor: "#F9DBBD",color:"#DA627D" }}
                  />

                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {event.title}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mb: 1,
                    }}
                  >
                    <CalendarMonth fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(event.date)} at {event.start_time}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mb: 1,
                    }}
                  >
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {event.city}, {event.country}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {event.total_registrations} / {event.capacity} attending
                    </Typography>
                  </Box>

                  {event.is_full && (
                    <Chip
                      label="FULL"
                      size="small"
                      color="error"
                      sx={{ mt: 1 }}
                    />
                  )}
                </CardContent>

                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate(`/events/${event.id}`)}
                    sx={{backgroundColor:"#A53860"}}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default EventList;
