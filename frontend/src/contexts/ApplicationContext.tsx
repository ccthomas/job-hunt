import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { fetchApplications } from '../utils/api'; // Ensure this function is implemented
import { Application } from '../types/application';

// Define the type for context values
interface ApplicationContextType {
  applications: Application[];
  loading: boolean;
  error: string | null;
  refetchApplications: () => void; // Function to refetch applications
}

// Create the context
const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

// Define the provider component
export const ApplicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch applications
  const fetchAndSetApplications = async () => {
    setLoading(true);
    try {
      const data = await fetchApplications();
      setApplications(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  // Fetch applications on initial load
  useEffect(() => {
    fetchAndSetApplications();
  }, []);

  return (
    <ApplicationContext.Provider value={{ applications, loading, error, refetchApplications: fetchAndSetApplications }}>
      {children}
    </ApplicationContext.Provider>
  );
};

// Custom hook to use the context
export const useApplicationContext = (): ApplicationContextType => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplicationContext must be used within an ApplicationProvider');
  }
  return context;
};
