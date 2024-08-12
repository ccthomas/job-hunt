import React from 'react';
import { Container, Typography, Link, Box } from '@mui/material';
import logo from './logo.svg';

function App() {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{ width: 100, height: 100 }}
        />
        <Typography
          variant="h5"
          component="h1"
          sx={{ mt: 2, mb: 2 }}
        >
          Edit <code>src/App.tsx</code> and save to reload.
        </Typography>
        <Link
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          variant="body2"
          sx={{ mt: 1 }}
        >
          Learn React
        </Link>
      </Box>
    </Container>
  );
}

export default App;
