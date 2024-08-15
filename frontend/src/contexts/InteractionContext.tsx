import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { fetchInteractions } from '../utils/api'; // Ensure this function is implemented
import { Interaction } from '../types/interaction';

// Define the type for context values
interface InteractionContextType {
  interactions: Interaction[];
  loading: boolean;
  error: string | null;
  refetchInteractions: () => void; // Function to refetch interactions
}

// Create the context
const InteractionContext = createContext<InteractionContextType | undefined>(undefined);

// Define the provider component
export const InteractionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch interactions
  const fetchAndSetInteractions = async () => {
    setLoading(true);
    try {
      const data = await fetchInteractions();
      setInteractions(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch interactions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch interactions on initial load
  useEffect(() => {
    fetchAndSetInteractions();
  }, []);

  return (
    <InteractionContext.Provider value={{ interactions, loading, error, refetchInteractions: fetchAndSetInteractions }}>
      {children}
    </InteractionContext.Provider>
  );
};

// Custom hook to use the context
export const useInteractionContext = (): InteractionContextType => {
  const context = useContext(InteractionContext);
  if (context === undefined) {
    throw new Error('useInteractionContext must be used within an InteractionProvider');
  }
  return context;
};
