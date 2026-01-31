import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Avatar,
  Grid,
  Button,
} from "@mui/material";
import { AccessTime, LocationOn, Person, Delete, Edit } from "@mui/icons-material";

const SessionCard = ({
  session,
  onEdit = null,
  onDelete = null,
  showActions = false,
}) => {
  return (
    <Card
      sx={{
        mb: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-2px)",
        },
        borderLeft: "4px solid",
        borderLeftColor: "primary.main",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            mb: 2,
          }}
        >
          <Box flex={1}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{color:"#DA627D"}}>
              {session.title}
            </Typography>

            {/* Time & Room */}
            <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <AccessTime fontSize="small" color="#023e8a" />
                <Typography variant="body2" color="#d4a373">
                  {session.start_time} - {session.end_time}
                </Typography>
              </Box>

              {session.room && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LocationOn fontSize="small" color="error" />
                  <Typography variant="body2" color="#003049">
                    {session.room}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Track & Topics */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
              {session.track && (
                <Chip
                  label={session.track}
                  sx={{backgroundColor:"#F9DBBD",color:"#DA627D"}}
                  size="small"
                  color="primary"
                />
              )}
              {session.topics && (
                <Box sx={{ display: "flex", gap: 1 }}>
                  {session.topics.split(",").map((topic, idx) => (
                    <Chip
                      key={idx}
                      label={topic.trim()}
                      sx={{backgroundColor:"#FFA5AB",color:"#450920"}}
                      size="small"
                      variant="filled"
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>

          {/* Actions */}
          {showActions && (onEdit || onDelete) && (
            <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
              {onEdit && (
                <Button
                  size="small"
                  sx={{color:"#A53860",borderColor:"#A53860"}}
                  startIcon={<Edit />}
                  onClick={() => onEdit(session)}
                  variant="outlined"
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  size="small"
                  startIcon={<Delete />}
                  color="error"
                  variant="outlined"
                  onClick={() => onDelete(session.id)}
                >
                  Delete
                </Button>
              )}
            </Box>
          )}
        </Box>

        {/* Description */}
        {session.description && (
          <Typography variant="body2" sx={{ mb: 2, color: "#a4133c" }}>
            {session.description}
          </Typography>
        )}

        {/* Speaker */}
        {(session.speaker_name || session.speaker) && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.5,
              bgcolor: "#ffcad4",
              borderRadius: 1,
              mt: 2,
            }}
          >
            <Avatar sx={{ bgcolor: "#ff4d6d", width: 32, height: 32 }}>
              {session.speaker_name?.[0] ||
                session.speaker?.first_name?.[0] ||
                "S"}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" color="#880d1e">
                {session.speaker_name || session.speaker?.full_name}
              </Typography>
              {session.speaker_bio && (
                <Typography variant="caption" color="#a4133c">
                  {session.speaker_bio}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Capacity Info */}
        {session.max_attendees && (
          <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <Person fontSize="small" color="#14213d" />
            <Typography variant="body2" color="#a4133c">
              Max {session.max_attendees} attendees
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionCard;
