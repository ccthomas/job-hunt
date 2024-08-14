import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, Snackbar } from '@mui/material';
import { saveApplication } from '../utils/api'; // Ensure this function is implemented
import { Application } from '../types/application';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useApplicationContext } from '../contexts/ApplicationContexts';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

const EditApplication: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { applications, refetchApplications } = useApplicationContext();

  const [application, setApplication] = useState<Application | null>(null);
  const [company, setCompany] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [appliedTimestamp, setAppliedTimestamp] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formErrors, setFormErrors] = useState({
    company: false,
    jobTitle: false,
    link: false,
    appliedTimestamp: false,
  });

  // Query params for editing existing applications

  const query = new URLSearchParams(location.search);
  const id = query.get('id') ?? ''; // Get the application ID from the query parameters

  useEffect(() => {
    if (id) {
      const app = applications.find(a => a.id === id);
      if (app) {
        setApplication(app);
        setCompany(app.company);
        setLink(app.link);
        setJobTitle(app.job_title);
        setAppliedTimestamp(dayjs(app.applied_timestamp));
        setLoading(false);
      } else {
        setError('Application not found');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [id, applications]);

  // Validate form

  const validateForm = () => {
    const errors = {
      company: company.trim() === '',
      jobTitle: jobTitle.trim() === '',
      link: link.trim() === '',
      appliedTimestamp: appliedTimestamp === null,
    };
    setFormErrors(errors);
    return !Object.values(errors).includes(true);
  };

  // Handle Submit

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      setOpenSnackbar(true);
      return;
    }

    const app: Application = {
      ...application,
      company,
      job_title: jobTitle,
      applied_timestamp: appliedTimestamp?.toISOString() || '',
      link: link,
    };

    try {
      await saveApplication(app);
      refetchApplications();
      navigate('/applications');
    } catch (err) {
      setError('Failed to update application');
    }
  };

  // Handle Snackbar

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Paper elevation={3} sx={{ width: '60%', padding: 2 }}>
           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Button variant="outlined" color="secondary" onClick={() => navigate('/applications')}>
              Back to Applications
            </Button>
          </Box>
          <Typography variant="h4" sx={{ mb: 2 }}>Edit Application</Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
              <TextField
                name="company"
                label="Company"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                fullWidth
                error={formErrors.company}
                helperText={formErrors.company ? 'Company is required' : ''}
                sx={{ mb: 2 }}
              />
              <TextField
                name="jobTitle"
                label="Job Title"
                value={jobTitle}
                onChange={(event) => setJobTitle(event.target.value)}
                fullWidth
                error={formErrors.jobTitle}
                helperText={formErrors.jobTitle ? 'Job Title is required' : ''}
                sx={{ mb: 2 }}
              />
              <TextField
                name="link"
                label="Link"
                value={link}
                onChange={(event) => setLink(event.target.value)}
                fullWidth
                error={formErrors.link}
                helperText={formErrors.link ? 'Link is required' : ''}
                sx={{ mb: 2 }}
              />
              <Box>
                <Typography>Applied Date</Typography>
                <DateTimePicker
                  value={appliedTimestamp}
                  onChange={(value) => setAppliedTimestamp(value)}
                />
                {formErrors.appliedTimestamp === true && (
                  <Typography color={'red'}>
                      Applied Date is required
                  </Typography>)} 
              </Box>
            </Box>
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
          </form>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            message="Please fill in all required fields."
            onClick={handleSnackbarClose}
          />
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default EditApplication;
