import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Button,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirm: "",
    role: "attendee",
    interests: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password != formData.password_confirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const result = await register(formData);

    if (result.success) {
      navigate("/login");
    } else setError(result.error || "Registration failed");

    setLoading(false);
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#F9DBBD",
        px: 2,
        py: 4,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 480,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background: "#DA627D",
            py: 3,
            px: 2,
            color: "white",
            textAlign: "center",
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            Eventra
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            Create your account and join the community
          </Typography>
        </Box>

        <Box sx={{ p: 4 }}>
  

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel
                    sx={{
                      "&.Mui-focused": {
                        color: "#ff939a",
                      },
                    }}
                  >
                    First Name
                  </InputLabel>
                  <OutlinedInput
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    sx={{
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: "#ff939a",
                      },

                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ff939a",
                      },

                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ff939a",
                        borderWidth: "2px",
                      },
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel
                    sx={{
                      "&.Mui-focused": {
                        color: "#ff939a",
                      },
                    }}
                  >
                    Last Name
                  </InputLabel>
                  <OutlinedInput
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    sx={{
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: "#ff939a",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ff939a",
                      },

                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ff939a",
                        borderWidth: "2px",
                      },
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth required>
                  <InputLabel
                    sx={{
                      "&.Mui-focused": {
                        color: "#ff939a",
                      },
                    }}
                  >
                    Email
                  </InputLabel>
                  <OutlinedInput
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    sx={{
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: "#ff939a", // default
                      },
                      // hover
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ff939a",
                      },

                      // focus
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ff939a",
                        borderWidth: "2px",
                      },
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel
                    sx={{
                      "&.Mui-focused": {
                        color: "#ff939a",
                      },
                    }}
                  >
                    Role
                  </InputLabel>
                  <Select
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    sx={{
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: "#ff939a",
                      },
                      // hover
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ff939a",
                      },

                      // focus
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ff939a",
                        borderWidth: "2px",
                      },
                    }}
                  >
                    <MenuItem value="attendee">Attendee</MenuItem>
                    <MenuItem value="organizer">Organizer</MenuItem>
                    <MenuItem value="speaker">Speaker</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Interests */}
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel
                    sx={{
                      "&.Mui-focused": {
                        color: "#ff939a",
                      },
                    }}
                  >
                    Interests
                  </InputLabel>
                  <OutlinedInput
                    label="Interests"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    sx={{
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: "#ff939a",
                      },
                      // hover
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ff939a",
                      },

                      // focus
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ff939a",
                        borderWidth: "2px",
                      },
                    }}
                  />
                  <FormHelperText>Comma separated</FormHelperText>
                </FormControl>
              </Grid>

              {/* Password */}
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth required>
                  <InputLabel sx={{    "&.Mui-focused": {
      color: "#ff939a",
    },
}}>Password</InputLabel>
                  <OutlinedInput
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    sx={{
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: "#ff939a",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ff939a",
                      },

                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ff939a",
                        borderWidth: "2px",
                      },
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControl
                  fullWidth
                  required
                  error={
                    formData.password_confirm &&
                    formData.password !== formData.password_confirm
                  }
                >
                  <InputLabel sx={{    "&.Mui-focused": {
      color: "#ff939a",
    },
}}>Confirm Password</InputLabel>
                  <OutlinedInput
                    label="Confirm Password"
                    type="password"
                    name="password_confirm"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    sx={{
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: "#ff939a",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ff939a",
                      },

                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ff939a",
                        borderWidth: "2px",
                      },
                    }}
                  />
                  {formData.password_confirm &&
                    formData.password !== formData.password_confirm && (
                      <FormHelperText>Passwords do not match</FormHelperText>
                    )}
                </FormControl>
              </Grid>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  mt: 3,
                  py: 1.2,
                  fontSize: "1rem",
                  fontWeight: 600,
                  background: "#A53860",
                  borderRadius: 2,
                }}
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Register"}
              </Button>

              <Typography align="center" sx={{ mt: 3, color: "#666" }}>
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{
                    textDecoration: "none",
                    color: "#DA627D",
                    fontWeight: 600,
                  }}
                >
                  Login here
                </Link>
              </Typography>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
