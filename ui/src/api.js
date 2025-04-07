import axios from 'axios';

// Get the API URL from environment variables or use a default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Patients API
export const patientsApi = {
  getAll: () => apiClient.get('/patients'),
  getById: (id) => apiClient.get(`/patients/${id}`),
  create: (patientData) => apiClient.post('/patients', patientData),
  update: (id, patientData) => apiClient.put(`/patients/${id}`, patientData),
  delete: (id) => apiClient.delete(`/patients/${id}`),
};

// Prescriptions API
export const prescriptionsApi = {
  getAll: () => apiClient.get('/prescriptions'),
  getById: (id) => apiClient.get(`/prescriptions/${id}`),
  getByPatientId: (patientId) => apiClient.get(`/patients/${patientId}/prescriptions`),
  create: (prescriptionData) => apiClient.post('/prescriptions', prescriptionData),
  update: (id, prescriptionData) => apiClient.put(`/prescriptions/${id}`, prescriptionData),
  delete: (id) => apiClient.delete(`/prescriptions/${id}`),
};

export default {
  patients: patientsApi,
  prescriptions: prescriptionsApi,
};