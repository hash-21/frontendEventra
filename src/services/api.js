import axios from "axios";

const API_URL =
  import.meta.env.VITE_DJANGO_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest.url;

    // Don't retry refresh on auth endpoints
    const isAuthEndpoint =
      url.includes("/auth/login/") ||
      url.includes("/auth/register/") ||
      url.includes("/auth/logout/");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await axios.post(`${API_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem("access_token", access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "./login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  register: (userData) => api.post("/auth/register/", userData),
  login: (credentials) => api.post("/auth/login/", credentials),
  getProfile: () => api.get("/auth/profile/"),
  refreshAccessToken: (refreshToken) =>
    api.post("/auth/refresh/", { refresh: refreshToken }),
  updateProfile: (data) =>
    api.put("/auth/profile/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  logout: (refreshToken) =>
    api.post("/auth/logout/", { refresh: refreshToken }),
};

export const eventAPI = {
  getAllEvents: (params) => api.get("/events/", { params }),

  getEventDetail: (id) => api.get(`/events/${id}/`),

  createEvent: (eventData) =>
    api.post("/events/create/", eventData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateEvent: (id, eventData) =>
    api.put(`/events/${id}/update/`, eventData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getEventRecommendations:(userInterests,availableEvents)=>api.post('/events/recommendations/',{userInterests,availableEvents}),

  deleteEvent: (id) => api.delete(`events/${id}/delete/`),

  getMyEvents: () => api.get("events/my-events/"),
};

export const sessionAPI = {
  getEventSessions: (eventId) => api.get(`sessions/events/${eventId}/sessions/`),
  getSessionDetail: (sessionId) => api.get(`sessions/${sessionId}/`),
  createSession: (sessionData) => api.post("sessions/create/", sessionData),
  updateSession: (sessionId, sessionData) =>
    api.put(`sessions/${sessionId}/update/`, sessionData),
  deleteSession: (sessionId) => api.delete(`sessions/${sessionId}/delete/`),
};
export const registrationAPI = {
  getMyRegistrations: () => api.get("/registrations/my-registrations/"),
  registerForEvent: (eventId) => api.post(`/events/${eventId}/register/`),
  unregisterFromEvent: (eventId) =>
    api.delete(`/events/${eventId}/unregister/`),
  checkIn: (registrationCode) =>
    api.post("/registrations/check-in/", {
      registration_code: registrationCode,
    }),
};

export default api;
