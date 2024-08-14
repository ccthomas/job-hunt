import React from 'react';
import { Box, TextField, IconButton, Menu, MenuItem, Button, Link, Typography, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useApplicationContext } from '../contexts/ApplicationContexts';
import { deleteApplication } from '../utils/api';
import { Application } from '../types/application';

const ApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const { applications, loading, refetchApplications } = useApplicationContext();

  const [search, setSearch] = React.useState<string>('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [errorMessage, setError] = React.useState<string | null>(null);
  
  // Search

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredApplications = applications.filter((app) =>
    app.company.toLowerCase().includes(search.toLowerCase())
  );

  // Menu

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuEdit = () => {
    if (selectedId) {
      navigate(`edit?id=${selectedId}`);
      handleMenuClose();
    }
  };

  // Delete Dialog

  const handleOpenDialog = () => {
    if (selectedId) {
      setOpenDialog(true);
    }
    handleMenuClose(); // Ensure the menu is closed
  };

  const handleCloseDialog = async (confirm: boolean) => {
    console.log(confirm, selectedId);
    if (confirm && selectedId) {
      try {
        await deleteApplication(selectedId);
        refetchApplications();
        setError(null); // Clear previous error
      } catch (err) {
        setError('Failed to delete application');
      }
    }
    setOpenDialog(false);
  };

  const columns: GridColDef<Application>[] = [
    {
      field: 'id',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <IconButton
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleMenuClick(event, params.row.id as string)}
          aria-controls="simple-menu"
          aria-haspopup="true"
        >
          <MoreVertIcon />
        </IconButton>
      ),
    },
    { field: 'company', headerName: 'Company', width: 100 },
    { field: 'link', headerName: 'Link', width: 150, renderCell: (params) => <Link href={params.row.link}>Link to Application</Link> },
    { field: 'job_title', headerName: 'Job Title', width: 300 },
    { field: 'applied_timestamp', headerName: 'Applied Timestamp', width: 200, renderCell: (params) => new Date(params.row.applied_timestamp).toLocaleString() },
  ];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Paper elevation={3} sx={{ width: '80%', padding: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Application Management
          </Typography>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flexGrow: 0 }}>
              <Button variant="contained" color="primary" onClick={() => navigate('edit')}>
                New Application
              </Button>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
              <TextField
                variant="outlined"
                label="Search by Company"
                value={search}
                onChange={handleSearchChange}
                sx={{ width: 300 }}
              />
            </Box>
          </Box>
          <DataGrid
            rows={filteredApplications}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            loading={loading}
          />
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleMenuEdit()}>Edit</MenuItem>
            <MenuItem onClick={handleOpenDialog}>Delete</MenuItem>
          </Menu>
        </Box>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => handleCloseDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this application?"}
        </DialogTitle>
        <DialogContent>
          {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseDialog(false)} color="primary">
            No
          </Button>
          <Button onClick={() => handleCloseDialog(true)} color="secondary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApplicationPage;
