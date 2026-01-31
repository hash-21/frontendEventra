import React, { useMemo } from "react";
import { Box, Card, Typography, Chip, Grid } from "@mui/material";
import { LocationOn, Person } from "@mui/icons-material";

const SessionSchedule = ({ sessions }) => {
  // Group sessions by track
  const tracks = useMemo(() => {
    const trackSet = new Set();
    sessions?.forEach((session) => {
      if (session.track) trackSet.add(session.track);
    });
    return Array.from(trackSet);
  }, [sessions]);

  if (!sessions || sessions.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="text.secondary">No sessions scheduled</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* List View */}
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          {sessions.map((session) => (
            <Grid item xs={12} sm={6} md={4} key={session.id}>
              <Card
                sx={{
                  p: 2,
                  background:
                    "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
                  borderLeft: "4px solid",
                  borderLeftColor: "primary.main",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: 3,
                    borderLeftColor: "primary.dark",
                  },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" noWrap>
                  {session.title}
                </Typography>

                <Typography variant="caption" color="text.secondary" noWrap>
                  {session.start_time} - {session.end_time}
                </Typography>

                {session.room && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="caption" noWrap>
                      {session.room}
                    </Typography>
                  </Box>
                )}

                {session.speaker_name && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    <Person fontSize="small" color="action" />
                    <Typography variant="caption" noWrap>
                      {session.speaker_name}
                    </Typography>
                  </Box>
                )}

                {session.track && (
                  <Box sx={{ mt: "auto", pt: 1 }}>
                    <Chip
                      label={session.track}
                      size="small"
                      variant="outlined"
                      sx={{ height: 20 }}
                    />
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Statistics */}
      <Box sx={{ mt: 4, p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                {sessions.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Sessions
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                {tracks.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tracks
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                {new Set(sessions.map((s) => s.room)).size}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Rooms
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                {sessions.filter((s) => s.speaker_name).length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Speakers
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SessionSchedule;
