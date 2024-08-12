// src/App.tsx
import React from 'react';
import ApplicationList from './components/ApplicationList';
import { Container, Typography } from '@mui/material';

const App: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Application List
      </Typography>
      <ApplicationList />
    </Container>
  );
};

export default App;
