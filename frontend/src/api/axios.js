import axios from "axios";

const API = axios.create({
  baseURL: "https://job-portal-project-7tud.onrender.com/api"
});

// Attach JWT token to every request automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auto-logout on 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────
export const login = (data) => API.post("/users/login", data);
export const register = (data) => API.post("/users/register", data);
export const verifyOtp = (data) => API.post("/users/verify-otp", data);
export const forgotPassword = (data) => API.post("/users/forgot-password", data);
export const resetPassword = (data) => API.post("/users/reset-password", data);

// ── Jobs ──────────────────────────────────────────
export const getJobs = () => API.get("/jobs");
export const getJobById = (id) => API.get(`/jobs/${id}`);
export const getMyJobs = () => API.get("/jobs/my-jobs");
export const createJob = (data) => API.post("/jobs", data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);

// ── Applications ──────────────────────────────────
export const applyForJob = (jobId, formData) =>
  API.post(`/applications/apply/${jobId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const getMyApplications = () => API.get("/applications/my");
export const getApplicationsForJob = (jobId) => API.get(`/applications/job/${jobId}`);
export const updateApplicationStatus = (appId, status) =>
  API.put(`/applications/${appId}/status?status=${status}`);

// ── Interview ─────────────────────────────────────
export const scheduleInterview = (appId, interviewAt, details) =>
  API.post(`/applications/${appId}/schedule-interview`, null, {
    params: { interviewAt, details }
  });

// ── Contact ───────────────────────────────────────
export const contactCandidate = (appId, subject, message) =>
  API.post(`/applications/${appId}/contact`, null, {
    params: { subject, message }
  });

  // Withdraw application
  export const withdrawApplication = (appId) =>
    API.delete(`/applications/${appId}`);

  export const updateJob = (id, data) => API.put(`/jobs/${id}`, data);

export default API;