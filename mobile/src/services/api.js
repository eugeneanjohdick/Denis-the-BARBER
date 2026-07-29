const API_URL = process.env.EXPO_PUBLIC_API_URL;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(data?.error ?? "Erreur reseau", response.status);
  }

  return data;
}

export function getHealth() {
  return apiFetch("/health");
}

export function getServices() {
  return apiFetch("/services");
}

export function getCoiffeurs() {
  return apiFetch("/coiffeurs");
}

export function getAvailability({ staffId, serviceId, date, token }) {
  const query = `staff=${encodeURIComponent(staffId)}&service=${encodeURIComponent(serviceId)}&date=${encodeURIComponent(date)}`;
  return apiFetch(`/availability?${query}`, { token });
}

export function getAppointments({ token }) {
  return apiFetch("/appointments", { token });
}

export function cancelAppointment({ appointmentId, token }) {
  return apiFetch(`/appointments/${appointmentId}/cancel`, { method: "POST", token });
}
