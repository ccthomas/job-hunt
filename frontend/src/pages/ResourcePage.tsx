// src/ResourcePage.js
import React from 'react';
import { Container, Typography, Button, Grid, Paper } from '@mui/material';

const resources = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com' },
  { name: 'Indeed', url: 'https://www.indeed.com' },
  { name: 'Glassdoor', url: 'https://www.glassdoor.com' },
  { name: 'Underdog', url: 'https://candidate.underdog.io' },
  { name: 'ResumeGenius', url: 'https://resumegenius.com' },
  { name: 'CoverLetterNow', url: 'https://www.coverletternow.com' },
];

const ResourcePage = () => {
  return (
    <Container maxWidth="md" style={{ marginTop: 20 }}>
      <Typography variant="h4" gutterBottom>
        Job Hunting Resources
      </Typography>
      <Grid container spacing={2}>
        {resources.map((resource) => (
          <Grid item xs={12} sm={6} md={4} key={resource.name}>
            <Paper style={{ padding: 20, textAlign: 'center' }}>
              <Typography variant="h6">{resource.name}</Typography>
              <Button 
                variant="contained" 
                color="primary" 
                href={resource.url} 
                target="_blank"
                style={{ marginTop: 10 }}
              >
                Visit {resource.name}
              </Button>
            </Paper>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Paper style={{ padding: 20, textAlign: 'center' }}>
            <Typography variant="h6">ChatGPT</Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              href="https://chat.openai.com" 
              target="_blank"
              style={{ marginTop: 10 }}
            >
              Visit ChatGPT
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ResourcePage;
