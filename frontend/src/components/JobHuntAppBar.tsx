// src/AppBarComponent.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const JobHuntAppBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" >
          Job Hunt
        </Typography>
        <Box>
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
          >
            Resources
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/applications"
          >
            Applications
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default JobHuntAppBar;
