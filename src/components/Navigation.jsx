import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Person,
  Event,
  Logout,
  AppRegistration,
  QrCode,
  Settings,
  Close,
  Dashboard,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    handleMenuClose();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { label: "Dashboard", path: "/", icon: <Dashboard /> },
    { label: "Profile", path: "/profile", icon: <Person /> },
    { label: "Events", path: "/events", icon: <Event /> },
    {
      label: "My Registrations",
      path: "/my-registrations",
      icon: <AppRegistration />,
    },
    { label: "Recommendations", path: "/recommendations", icon: <Settings /> },
    { label: "Check-In", path: "/check-in", icon: <QrCode /> },
  ];

  const drawer = (
    <Box sx={{ width: 250}}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Eventra
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <Close />
        </IconButton>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <AppBar
        position="static"
        sx={{ background: "#450920" }}
      >
            {/* Logo */}
<Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",px:2}}>
         <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              Eventra
            </Typography>
        <Container maxWidth="lg" >
          <Toolbar sx={{ display: "flex", justifyContent: "space-around", alignItems:"center"}}>
               
          

            {/* Desktop Menu */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                  sx={{
                    textTransform: "none",
                    fontSize: "1rem",
                    borderBottom:
                      location.pathname === item.path
                        ? "2px solid white"
                        : "none",
                    pb: location.pathname === item.path ? 0.5 : 0,
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

           
          </Toolbar>
        </Container>
         {/* User Menu */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="body2"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                {user?.full_name || user?.email}
              </Typography>
              <Button
                onClick={handleMenuOpen}
                sx={{ textTransform: "none", color: "white" }}
                startIcon={
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "rgba(255,255,255,0.3)",
                      fontSize: "0.875rem",
                    }}
                  >
                    {user?.full_name?.[0] || user?.email?.[0]}
                  </Avatar>
                }
              >
                <Box sx={{ display: { xs: "none", sm: "block" } }}>▼</Box>
              </Button>

              <IconButton
                color="inherit"
                onClick={handleDrawerToggle}
                sx={{ display: { xs: "flex", md: "none" } }}
              >
                <MenuIcon />
              </IconButton>
            </Box>

            {/* User Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                onClick={() => {
                  navigate("/");
                  handleMenuClose();
                }}
              >
                <Dashboard sx={{ mr: 1, color: "#DA627D"}}/> Dashboard
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/profile");
                  handleMenuClose();
                }}
              >
                <Person sx={{ mr: 1 ,color: "#DA627D"}} /> Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/events");
                  handleMenuClose();
                }}
              >
                <Event sx={{ mr: 1,color: "#DA627D" }} /> Events
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/my-registrations");
                  handleMenuClose();
                }}
              >
                <AppRegistration sx={{ mr: 1,color: "#DA627D" }} /> My Registrations
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/check-in");
                  handleMenuClose();
                }}
              >
                <QrCode sx={{ mr: 1,color: "#DA627D" }} /> Check-In
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 ,color: "#DA627D"}} /> Logout
              </MenuItem>
            </Menu>
            </Box>
      </AppBar>

      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation;
