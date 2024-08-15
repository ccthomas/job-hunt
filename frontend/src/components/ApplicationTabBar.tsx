import React from 'react';
import { AppBar, Tabs, Tab, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const ApplicationTabBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the current tab based on the URL path
  const currentTab = location.pathname.includes('interactions') ? 'applications/interactions' : 'applications';

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    navigate(`/${newValue}`);
  };

  return (
    <AppBar position="static" color='transparent' >
      <Tabs value={currentTab} onChange={handleChange} aria-label="navigation tabs">
        <Tab value="applications" label="Application" />
        <Tab value="applications/interactions" label="Interaction" />
      </Tabs>
    </AppBar>
  );
};

export default ApplicationTabBar;
