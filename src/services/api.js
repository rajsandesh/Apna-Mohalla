export const API_BASE = import.meta.env.VITE_API_BASE || "https://apna-mohalla-production.up.railway.app";

async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message || `Server Error (${response.status})`
    );
  }

  return data;
}

// Auth
// Auth
export function register(fullName, email, password) {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ fullName, email, password }),
  });
}

export async function login(email, password) {
  console.log("Calling login API...");

  const data = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  console.log("Login response:", data);

  return data;
}

export function forgotPassword(email) {
  return apiFetch("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(email, otp, newPassword) {
  return apiFetch("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, otp, newPassword }),
  });
}
// Announcements
export function getAnnouncements() {
  return apiFetch("/api/announcements");
}

export function createAnnouncement(title, content, category) {
  return apiFetch("/api/announcements", {
    method: "POST",
    body: JSON.stringify({ title, content, category }),
  });
}

export function updateAnnouncement(id, title, content, category) {
  return apiFetch(`/api/announcements/${id}`, {
    method: "PUT",
    body: JSON.stringify({ title, content, category }),
  });
}

export function deleteAnnouncement(id) {
  return apiFetch(`/api/announcements/${id}`, { method: "DELETE" });
}

// Complaints
export function submitComplaint(title, description, category) {
  return apiFetch("/api/complaints", {
    method: "POST",
    body: JSON.stringify({ title, description, category }),
  });
}

export function getMyComplaints() {
  return apiFetch("/api/complaints/my");
}

export function getAllComplaints() {
  return apiFetch("/api/complaints");
}

export function resolveComplaint(id) {
  return apiFetch(`/api/complaints/${id}/resolve`, { method: "PUT" });
}

// Events
export function getEvents() {
  return apiFetch("/api/events");
}

export function createEvent(title, description, location, eventDate) {
  return apiFetch("/api/events", {
    method: "POST",
    body: JSON.stringify({ title, description, location, eventDate }),
  });
}

export function updateEvent(id, title, description, location, eventDate) {
  return apiFetch(`/api/events/${id}`, {
    method: "PUT",
    body: JSON.stringify({ title, description, location, eventDate }),
  });
}

export function deleteEvent(id) {
  return apiFetch(`/api/events/${id}`, { method: "DELETE" });
}

// Users (admin)
export function getAllUsers() {
  return apiFetch("/api/users");
}

// Bookings
export function createBooking(facility, bookingDate, timeSlot) {
  return apiFetch("/api/bookings", {
    method: "POST",
    body: JSON.stringify({ facility, bookingDate, timeSlot }),
  });
}

export function getMyBookings() {
  return apiFetch("/api/bookings/my");
}

export function getAllBookings() {
  return apiFetch("/api/bookings");
}

export function updateBooking(id, status) {
  return apiFetch(`/api/bookings/${id}`, {
    method: "PUT",
    body: JSON.stringify({ Status: status }),
  });
}

export function deleteBooking(id) {
  return apiFetch(`/api/bookings/${id}`, { method: "DELETE" });
}
