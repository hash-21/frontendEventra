import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: " ",
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
        if (key == "banner_image" && formData.banner_image) {
          submitData.append(key, formData.banner_image);
        } else if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });

      const response = await eventAPI.createEvent(submitData);
      navigate(`/events/${response.data.id}`);
    } catch (error) {
      setError(
        typeof error.response?.data === "object"
          ? JSON.stringify(error.response.data)
          : error.response?.data?.error || "Failed to create event"
      );
    }

    setLoading(false);
  };
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Create New Event
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Fill in the details to create your event
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
                  inputLabel:{shrink:true}
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
                  inputLabel:{shrink:true}
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
                  inputLabel:{shrink:true}
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
              <Button variant="outlined" component="label" fullWidth>
                Upload Banner Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              {formData.banner_image && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Selected: {formData.banner_image.name}
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
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5568d3 0%, #6a3d91 100%)",
                    },
                  }}
                >
                  {loading ? "Creating..." : "Create Event"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/events")}
                  disabled={loading}
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

export default CreateEvent;
