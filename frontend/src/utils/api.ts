// src/api.ts
import axios from 'axios';
import { Application } from '../types/application';
import { Interaction } from '../types/interaction';

const API = process.env.BACKEND_API || 'http://127.0.0.1:5001';

export const fetchApplications = async () => {
  try {
    const response = await axios.get(`${API}/application`);
    return response.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

export const saveApplication = async (application: Application) => {
  try {
    const response = await axios.post(`${API}/application`, application);
    return response.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

export const deleteApplication = async (id: string) => {
  try {
    const response = await axios.delete(`${API}/application/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
}


export const fetchInteractions = async () => {
  try {
    const response = await axios.get(`${API}/application/interaction`);
    return response.data;
  } catch (error) {
    console.error('Error fetching interactions:', error);
    throw error;
  }
};

export const saveInteraction = async (interaction: Interaction) => {
  try {
    const response = await axios.post(`${API}/application/interaction`, interaction);
    return response.data;
  } catch (error) {
    console.error('Error saving Interaction:', error);
    throw error;
  }
};

export const deleteInteraction = async (id: string) => {
  try {
    const response = await axios.delete(`${API}/application/interaction/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching interactions:', error);
    throw error;
  }
}
