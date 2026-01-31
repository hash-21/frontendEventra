import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Register from "./pages/Register";
import EventList from "./pages/EventList";
import EventDetail from "./pages/EventDetail";
import CreateEvent from "./pages/CreateEvent";
import UpdateEvent from "./pages/UpdateEvent";
import EventRecommendationSystem from "./pages/EventRecommendationSystem";
import ProtectedRoute from "./components/ProtectedRoute";
import SessionDetails from "./pages/SessionDetails";
import MyRegistrations from "./pages/MyRegistrations";
import CheckIn from "./pages/CheckIn";
import Navigation from "./components/Navigation";
const App = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/recommendations" element={<EventRecommendationSystem />} />
          <Route path="/my-registrations" element={<MyRegistrations />} />
          <Route path="/check-in" element={<CheckIn />} />
          <Route
            path="/events/:eventId/sessions/:sessionId"
            element={<SessionDetails />}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
