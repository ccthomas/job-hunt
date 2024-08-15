import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, Snackbar, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Rating } from '@mui/material';
import { saveInteraction } from '../utils/api'; // Ensure this function is implemented
import { Interaction, InteractionType } from '../types/interaction'; // Adjust the path if needed
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useApplicationContext } from '../contexts/ApplicationContext'; // Adjust if needed
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { useInteractionContext } from '../contexts/InteractionContext';
import { formatType } from '../utils/formatters';

const InteractionEditPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { applications, refetchApplications } = useApplicationContext();
  const { interactions, refetchInteractions } = useInteractionContext();

  const [interaction, setInteraction] = useState<Interaction | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<InteractionType | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [interactionTimestamp, setInteractionTimestamp] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formErrors, setFormErrors] = useState({
    applicationId: false,
    name: false,
    type: false,
    rating: false,
    notes: false,
    interactionTimestamp: false,
  });

  // Predefined types
  const typeOptions = ['Call', 'Email', 'Meeting', 'Follow-up'];

  // Predefined names (Replace with actual values if needed)
  const nameOptions = ['Name 1', 'Name 2', 'Name 3'];

  // Query params for editing existing interactions
  const query = new URLSearchParams(location.search);
  const id = query.get('id') ?? ''; // Get the interaction ID from the query parameters

  useEffect(() => {
    if (id) {
      const int = interactions.find(i => i.id === id);
      if (int) {
        setInteraction(int);
        setApplicationId(int.application_id);
        setName(int.name || '');
        setType(int.type);
        setRating(int.rating);
        setNotes(int.notes);
        setInteractionTimestamp(dayjs(int.interaction_timestamp));
        setLoading(false);
      } else {
        setError('Interaction not found');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [id, interactions]);

  // Validate form
  const validateForm = () => {
    const application = applications.find(value => value.id === applicationId);

    let role = '';
    if (application !== undefined) {
        role = `${application.company} - ${application.job_title}`;
    }

    const errors = {
      applicationId: applicationId === null,
      name: name.trim() === '',
      type: type === null,
      rating: rating === null,
      notes: notes.trim() === '',
      interactionTimestamp: interactionTimestamp === null,
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

    const application = applications.find(value => value.id === applicationId);
    if (application === undefined) {
       return;
    }

    const int: Interaction = {
      ...interaction,
      application_id: applicationId as string,
      name,
      company: application?.company,
      job_title: application?.job_title,
      type: type || InteractionType.HiringManager,
      rating: rating || 0,
      notes,
      interaction_timestamp: interactionTimestamp?.toISOString() || '',
    };

    try {
      await saveInteraction(int);
      refetchInteractions();
      navigate('/applications/interactions');
    } catch (err) {
      setError('Failed to update interaction');
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
            <Button variant="outlined" color="secondary" onClick={() => navigate('/applications/interactions')}>
              Back to Interactions
            </Button>
          </Box>
          <Typography variant="h4" sx={{ mb: 2 }}>Edit Interaction</Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={applicationId}
                  onChange={(event) => { setApplicationId(event.target.value) }}
                  error={formErrors.applicationId}
                >
                  {applications.map(app => (
                    <MenuItem key={app.id} value={app.id}>
                      {`${app.company} - ${app.job_title}`}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.applicationId && <Typography color="red">Role is required</Typography>}
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                    name="name"
                    label="Name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    fullWidth
                    error={formErrors.name}
                    helperText={formErrors.name ? 'Name is required' : ''}
                    sx={{ mb: 2 }}
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={type}
                  onChange={(event) => setType(event.target.value as InteractionType)}
                  error={formErrors.type}
                >
                  {Object.values(InteractionType).map((option: InteractionType) => (
                    <MenuItem key={option} value={option}>
                      {formatType(option)}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.type && <Typography color="red">Type is required</Typography>}
              </FormControl>

              <Box sx={{ mb: 2 }}>
                <Typography>Rating</Typography>
                <Rating
                  value={rating || 0}
                  onChange={(_event, newValue) => setRating(newValue)}
                  precision={0.5}
                />
                {formErrors.rating && <Typography color="red">Rating is required</Typography>}
              </Box>

              <TextField
                name="notes"
                label="Notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                fullWidth
                multiline
                minRows={4}
                maxRows={6}
                variant="outlined"
                error={formErrors.notes}
                helperText={formErrors.notes ? 'Notes are required' : ''}
                sx={{ mb: 2 }}
              />

              <Box>
                <Typography>Interaction Date</Typography>
                <DateTimePicker
                  value={interactionTimestamp}
                  onChange={(value) => setInteractionTimestamp(value)}
                />
                {formErrors.interactionTimestamp && (
                  <Typography color={'red'}>
                      Interaction Date is required
                  </Typography>
                )}
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

export default InteractionEditPage;
