import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
  Alert,
  Divider,
  Grid,
} from "@mui/material";
import { CheckCircle, Error, QrCode, Search } from "@mui/icons-material";
import { registrationAPI } from "../services/api";

const CheckIn = () => {
  const [registrationCode, setRegistrationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkInResult, setCheckInResult] = useState(null);
  const [checkInHistory, setCheckInHistory] = useState([]);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    if (!registrationCode.trim()) {
      setError("Please enter a registration code");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await registrationAPI.checkIn(registrationCode);
      setCheckInResult({
        success: true,
        message: response.data.message,
        event: response.data.event,
        user: response.data.user,
        timestamp: new Date(),
      });
      setCheckInHistory([
        {
          success: true,
          ...response.data,
          timestamp: new Date(),
        },
        ...checkInHistory,
      ]);
      setShowResultDialog(true);
      setRegistrationCode("");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Invalid registration code";
      setError(errorMsg);
      setCheckInResult({
        success: false,
        message: errorMsg,
        timestamp: new Date(),
      });
      setCheckInHistory([
        {
          success: false,
          message: errorMsg,
          timestamp: new Date(),
        },
        ...checkInHistory,
      ]);
      setShowResultDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setShowResultDialog(false);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 2, color:"#DA627D" }}>
        Event Check-In
      </Typography>

      <Grid container spacing={3}>
        {/* Check-in Form */}
        <Grid size={{ xs: 12 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <form onSubmit={handleCheckIn}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3,color:"#450920" }}>
                Scan or Enter Registration Code
              </Typography>

              {error && (
                <Alert
                  severity="error"
                  sx={{ mb: 2 }}
                  onClose={() => setError(null)}
                >
                  {error}
                </Alert>
              )}

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  label="Registration Code"
                  placeholder="Enter or scan QR code"
                  value={registrationCode}
                  onChange={(e) =>
                    setRegistrationCode(e.target.value.toUpperCase())
                  }
                  disabled={loading}
                  autoFocus
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "1.2rem",
                      fontFamily: "monospace",
                    },
                  }}
                />
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading || !registrationCode.trim()}
                  sx={{ minWidth: 160,backgroundColor:"#A53860"
 }}
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <Search />
                  }
                >
                  {loading ? "Checking..." : "Check In"}
                </Button>
              </Box>

              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ mt: 2, display: "block" }}
              >
                💡 Tip: You can scan QR codes directly or paste the registration
                code
              </Typography>
            </form>
          </Paper>
        </Grid>

        {/* Check-in History */}
        {checkInHistory.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Check-in History
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                {checkInHistory.map((entry, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      mb: 1,
                      border: "1px solid",
                      borderColor: entry.success
                        ? "success.light"
                        : "error.light",
                      borderRadius: 1,
                      bgcolor: entry.success
                        ? "success.lighter"
                        : "error.lighter",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ mt: 0.5 }}>
                      {entry.success ? (
                        <CheckCircle sx={{ color: "success.main" }} />
                      ) : (
                        <Error sx={{ color: "error.main" }} />
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {entry.success ? (
                          <>
                            {entry.user} - {entry.event}
                          </>
                        ) : (
                          entry.message
                        )}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {formatTime(entry.timestamp)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Instructions */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent sx={{color:"#450920"}}>
              <Typography variant="h6" gutterBottom>
                How to Check In
              </Typography>
              <Box component="ol" sx={{ pl: 2 }}>
                <li>
                  <Typography variant="body2">
                    Ask the participant to show their QR code
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Scan the QR code with a mobile device or enter the
                    registration code manually
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Click "Check In" or press Enter to confirm
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    You'll see a confirmation with the participant's name and
                    event
                  </Typography>
                </li>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Result Dialog */}
      <Dialog open={showResultDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {checkInResult?.success ? "Check-in Successful!" : "Check-in Failed"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ textAlign: "center" }}>
            {checkInResult?.success ? (
              <>
                <CheckCircle
                  sx={{
                    fontSize: 60,
                    color: "success.main",
                    mb: 2,
                  }}
                />
                <Typography variant="h6" gutterBottom>
                  {checkInResult.user}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  {checkInResult.event}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Checked in at {formatTime(checkInResult.timestamp)}
                </Typography>
              </>
            ) : (
              <>
                <Error
                  sx={{
                    fontSize: 60,
                    color: "error.main",
                    mb: 2,
                  }}
                />
                <Typography variant="body1" color="error">
                  {checkInResult?.message}
                </Typography>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CheckIn;
