import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { eventAPI } from "../services/api";
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

const UpdateEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    banner_image: null,
    date: "",
    start_time: "",
    end_time: "",
    location: "",
    venue_name: "",
    city: "",
    country: "",
    category: "technology",
    capacity: 100,
  });
  const [existingImage, setExistingImage] = useState(null);

  // Fetch event details on mount
  useEffect(() => {
    fetchEventDetail();
  }, [id]);

  const fetchEventDetail = async () => {
    try {
      setFetching(true);
      const response = await eventAPI.getEventDetail(id);
      const event = response.data;
      setFormData({
        title: event.title,
        description: event.description,
        banner_image: null,
        date: event.date,
        start_time: event.start_time,
        end_time: event.end_time,
        location: event.location,
        venue_name: event.venue_name,
        city: event.city,
        country: event.country,
        category: event.category,
        capacity: event.capacity,
      });
      setExistingImage(event.banner_image);
    } catch (error) {
      setError("Failed to load event details");
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, banner_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const submitData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "banner_image") {
          if (formData.banner_image) {
            submitData.append(key, formData.banner_image);
          }
        } else if (formData[key] !== "") {
          submitData.append(key, formData[key]);
        }
      });

      await eventAPI.updateEvent(id, submitData);
      navigate(`/events/${id}`);
    } catch (error) {
      setError(
        typeof error.response?.data === "object"
          ? JSON.stringify(error.response.data)
          : error.response?.data?.error || "Failed to update event"
      );
    }

    setLoading(false);
  };

  if (fetching) {
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

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="#DA627D">
          Update Event
        </Typography>
        <Typography variant="body2" color="#f22e59" sx={{ mb: 4 }}>
          Edit the event details below
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Title */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                label="Event Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>

            {/* Description */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            {/* Category */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
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
            </Grid>

            {/* Capacity */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                type="number"
                label="Capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
              />
            </Grid>

            {/* Date */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                required
                type="date"
                label="Date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Grid>

            {/* Start Time */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                required
                type="time"
                label="Start Time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Grid>

            {/* End Time */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                required
                type="time"
                label="End Time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Grid>

            {/* Venue Name */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                label="Venue Name"
                name="venue_name"
                value={formData.venue_name}
                onChange={handleChange}
                placeholder="e.g., Convention Center"
              />
            </Grid>

            {/* Location */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                label="Full Address"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="123 Main St"
              />
            </Grid>

            {/* City */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Grid>

            {/* Country */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </Grid>

            {/* Banner Image */}
            <Grid size={{ xs: 12 }}>
              {existingImage && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Current Image:
                  </Typography>
                  <Box
                    component="img"
                    src={
                      existingImage.startsWith("http")
                        ? existingImage
                        : `${
                            import.meta.env.VITE_DJANGO_BASE_URL ||
                            "http://localhost:8000"
                          }${existingImage}`
                    }
                    alt="Current banner"
                    sx={{
                      width: "100%",
                      maxHeight: 200,
                      objectFit: "cover",
                      borderRadius: 1,
                    }}
                  />
                </Box>
              )}
              <Button variant="outlined" component="label" fullWidth                   sx={{color:"#A53860", borderColor:"#A53860"}}
>
                {formData.banner_image
                  ? "Change Banner Image"
                  : "Upload New Banner Image"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              {formData.banner_image && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  New image selected: {formData.banner_image.name}
                </Typography>
              )}
            </Grid>

            {/* Submit Button */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  size="large"
                  disabled={loading}
                  sx={{
                    background:
                      "#A53860"
                  }}
                >
                  {loading ? "Updating..." : "Update Event"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/events/${id}`)}
                  disabled={loading}
                  sx={{color:"#A53860", borderColor:"#A53860"}}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default UpdateEvent;
