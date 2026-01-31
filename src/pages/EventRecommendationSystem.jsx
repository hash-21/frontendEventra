import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AutoAwesome,
  TrendingUp,
  Event,
  LocationOn,
  People,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  CircularProgress,
  TextField,
  Typography,
  Alert,
  Chip,
  Stack,
  Paper,
} from "@mui/material";
import { eventAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const EventRecommendationSystem = () => {
  const { user } = useAuth();
  const [userInterests, setUserInterests] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [lastRequestTime, setLastRequestTime] = useState(0);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";
  // Fetch user interests and available events on component mount
  useEffect(() => {
    // Set user interests from profile if available
    if (user?.interests) {
      setUserInterests(user.interests);
    }

    // Fetch available events
    const fetchEvents = async () => {
      try {
        const response = await eventAPI.getAllEvents();
        setAvailableEvents(response.data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Failed to load events. Please try again later.");
      }
    };
    fetchEvents();
  }, [user]);

  const getRecommendations = async () => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    if (timeSinceLastRequest < 5000) {
      const waitTime = Math.ceil((5000 - timeSinceLastRequest) / 1000);
      setError(`Please wait ${waitTime} seconds before trying again.`);
      return;
    }

    if (!userInterests.trim()) {
      setError("Please enter your interests.");
      return;
    }

    if (availableEvents.length === 0) {
      setError("No events available. Please try again later.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const prompt = `You are an intelligent event recommendation system. Based on the user's interests, recommend the most relevant events from the list and explain why they match.
        
User Interests: "${userInterests}"

Available Events:
${availableEvents
  .map(
    (event, index) =>
      `${index + 1}. ${event.title}
Category: ${event.category || "General"}
Description: ${event.description}
Date: ${event.date}
Location: ${event.location}
`,
  )
  .join("\n")}

Please respond in JSON format with an array of recommendations. For each recommendation include:
- eventId (the index number from the list, starting from 1)
- matchScore (1-100, how well it matches user interests)
- reason (a brief explanation of why this event matches)

Return top 3 recommendations sorted by matchScore in descending order.

Example format:
{
  "recommendations": [
    {
      "eventId": 1,
      "matchScore": 95,
      "reason": "This event directly aligns with your interest in..."
    }
  ]
}

Return ONLY the JSON response without any additional text.`;

      const payload = {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      };

      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Gemini API response:", response);

      const responseText = response.data.candidates[0].content.parts[0].text;
      console.log("Gemini API response text:", responseText);

      // Parse JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        setError("Failed to parse recommendations. Please try again.");
        setLoading(false);
        return;
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);

      // Map recommendations to include full event details
      const enrichedRecommendations = parsedResponse.recommendations.map(
        (rec) => {
          const eventIndex = rec.eventId - 1;
          const event = availableEvents[eventIndex];

          return {
            id: rec.eventId,
            title: event?.title || rec.title,
            category: event?.category || "General",
            description: event?.description,
            date: event?.date,
            location: event?.location,
            attendees: event?.attendees || 0,
            matchScore: rec.matchScore,
            reason: rec.reason,
          };
        },
      );

      setRecommendations(enrichedRecommendations);
      setLastRequestTime(Date.now());
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      if (err.response?.status === 400) {
        setError("Invalid API request. Please check your API key.");
      } else if (err.response?.status === 429) {
        setError("Rate limit exceeded. Please try again later.");
      } else {
        setError("Failed to get recommendations. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 6, px: 2 }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <AutoAwesome sx={{ fontSize: 40, color: "#F9DBBD" }} />
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{ color: "#DA627D" }}
            >
              Find the events that you'll love
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: "#666" }}>
            Tell us your interests and we'll find the perfect events for you
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 3 }}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ mb: 2, color: "#450920" }}
          >
            What are your interests?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={userInterests}
            onChange={(e) => setUserInterests(e.target.value)}
            placeholder="e.g., artificial intelligence, machine learning, startup culture, networking..."
            variant="outlined"
            sx={{ mb: 3 }}
          />

          <Button
            onClick={getRecommendations}
            disabled={loading || availableEvents.length === 0}
            fullWidth
            variant="contained"
            sx={{
              background: "#A53860",
              color: "white",
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              "&:disabled": {
                opacity: 0.5,
              },
            }}
            startIcon={
              loading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                <AutoAwesome />
              )
            }
          >
            {loading ? "Discovering..." : "Discover Events"}
          </Button>

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}
        </Paper>

        {recommendations.length > 0 && (
          <Box>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                mb: 4,
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#1a1a1a",
              }}
            >
              <TrendingUp sx={{ fontSize: 28, color: "#A53860" }} />
              Recommended Events for You
            </Typography>

            <Stack spacing={3}>
              {recommendations.map((event, idx) => (
                <Card
                  key={event.id}
                  elevation={3}
                  sx={{ borderRadius: 3, "&:hover": { boxShadow: 6 } }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 3,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Typography
                          sx={{
                            fontSize: "2.5rem",
                            fontWeight: "bold",
                            color: "#d1d5db",
                          }}
                        >
                          #{idx + 1}
                        </Typography>
                        <Typography
                          variant="h5"
                          fontWeight="bold"
                          sx={{ color: "#1a1a1a" }}
                        >
                          {event.title}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Box
                          sx={{
                            background:
                              "#DA627D",
                            color: "white",
                            px: 2,
                            py: 1,
                            borderRadius: 3,
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                            mb: 1,
                          }}
                        >
                          {event.matchScore}% Match
                        </Box>
                        <Chip
                          label={event.category}
                          size="small"
                          sx={{backgroundColor:"#F9DBBD",color:"#450920"}}
                        />
                      </Box>
                    </Box>

                    {/* AI Reason */}
                    <Paper
                      sx={{
                        bgcolor: "#F9DBBD",
                        borderLeft: "4px solid #A53860",
                        p: 2,
                        mb: 3,
                        borderRadius: "0 8px 8px 0",
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{
                          color: "#A53860",
                          mb: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <AutoAwesome sx={{ fontSize: 16 }} />
                        Why this matches your interests:
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#1a1a1a" }}>
                        {event.reason}
                      </Typography>
                    </Paper>

                    {/* Event Description */}
                    <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
                      {event.description}
                    </Typography>

                    {/* Event Details */}
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 3 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: "#666",
                        }}
                      >
                        <Event sx={{ fontSize: 18, color: "#A53860" }} />
                        <Typography variant="body2">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: "#666",
                        }}
                      >
                        <LocationOn sx={{ fontSize: 18, color: "#A53860" }} />
                        <Typography variant="body2">
                          {event.location}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: "#666",
                        }}
                      >
                        <People sx={{ fontSize: 18, color: "#A53860" }} />
                        <Typography variant="body2">
                          {event.attendees} attendees
                        </Typography>
                      </Box>
                    </Box>

                    {/* Register Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        backgroundColor: "#A53860",
                        color: "white",
                        py: 1,
                        fontWeight: "bold",

                      }}
                    >
                      Register for Event
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default EventRecommendationSystem;
