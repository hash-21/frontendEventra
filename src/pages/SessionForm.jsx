import React, { useEffect, useState } from "react";
import { sessionAPI } from "../services/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Alert,
} from "@mui/material";
const SessionForm = ({
  open,
  onClose,
  onSuccess,
  eventId,
  editSession = null,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    speaker_name: "",
    speaker_bio: "",
    room: "",
    track: "",
    topics: "",
    max_attendees: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
      if (editSession) {
        setFormData({
          title: editSession.title || "",
          description: editSession.description || "",
          speaker_name: editSession.speaker_name || "",
          speaker_bio: editSession.speaker_bio || "",
          start_time: editSession.start_time || "",
          end_time: editSession.end_time || "",
          room: editSession.room || "",
          track: editSession.track || "",
          topics: editSession.topics || "",
          max_attendees: editSession.max_attendees || "",
        });
     
      
    }
  }, [editSession, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const submitData = {
        event: eventId,
        ...formData,
        max_attendees: formData.max_attendees
          ? parseInt(formData.max_attendees)
          : null,
      };
      if (editSession) {
        await sessionAPI.updateSession(editSession.id, submitData);
      } else {
        await sessionAPI.createSession(submitData);
      }

      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Session form error:", error);
      setError(error.response?.data?.message || "Failed to save session.");
    }

    setLoading(false);
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      start_time: "",
      end_time: "",
      speaker_name: "",
      speaker_bio: "",
      room: "",
      track: "",
      topics: "",
      max_attendees: "",
    });

    setError("");
    onClose();
  };
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {editSession ? "Edit Session" : "Add New Session"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            {/* Title */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Session Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Description */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                required
              />
            </Grid>

            {/* Time */}
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Start Time"
                name="start_time"
                type="time"
                value={formData.start_time}
                onChange={handleChange}
                slotProps={{ inputLabel: { shrink: true } }}
                required
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="End Time"
                name="end_time"
                type="time"
                value={formData.end_time}
                onChange={handleChange}
                slotProps={{ inputLabel: { shrink: true } }}
                required
              />
            </Grid>

            {/* Speaker */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Speaker Name"
                name="speaker_name"
                value={formData.speaker_name}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Speaker Bio"
                name="speaker_bio"
                value={formData.speaker_bio}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>

            {/* Room & Track */}
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Room/Location"
                name="room"
                value={formData.room}
                onChange={handleChange}
                placeholder="e.g., Main Hall, Room A"
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Track"
                name="track"
                value={formData.track}
                onChange={handleChange}
                placeholder="e.g., Technical, Business"
              />
            </Grid>

            {/* Topics */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Topics"
                name="topics"
                value={formData.topics}
                onChange={handleChange}
                placeholder="Comma-separated (e.g., AI, Machine Learning, Python)"
                helperText="Separate multiple topics with commas"
              />
            </Grid>

            {/* Capacity */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Max Attendees (Optional)"
                name="max_attendees"
                type="number"
                value={formData.max_attendees}
                onChange={handleChange}
                placeholder="Leave empty for unlimited"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Saving..." : editSession ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SessionForm;
