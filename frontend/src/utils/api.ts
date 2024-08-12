// src/api.ts
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5001/application'; // Update with your actual endpoint

export const fetchApplications = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};
