import React from 'react';
import { Box, TextField, IconButton, Menu, MenuItem, Button, Typography, Paper, Dialog, DialogActions, DialogContent, DialogTitle, Rating } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useInteractionContext } from '../contexts/InteractionContext';
import { deleteInteraction } from '../utils/api';
import { Interaction } from '../types/interaction';
import ApplicationTabBar from '../components/ApplicationTabBar';
import { formatType } from '../utils/formatters';

const InteractionPage: React.FC = () => {
  const navigate = useNavigate();
  const { interactions, loading, refetchInteractions } = useInteractionContext();

  const [search, setSearch] = React.useState<string>('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [errorMessage, setError] = React.useState<string | null>(null);
  
  // Search
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredInteractions = interactions.filter((interaction) =>
    interaction.company.toLowerCase().includes(search.toLowerCase())
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
    if (confirm && selectedId) {
      try {
        await deleteInteraction(selectedId);
        refetchInteractions();
        setError(null); // Clear previous error
      } catch (err) {
        setError('Failed to delete interaction');
      }
    }
    setOpenDialog(false);
  };

  const columns: GridColDef<Interaction>[] = [
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
    { field: 'job_title', headerName: 'Job Title', width: 300 },
    { field: 'type', headerName: 'Type', width: 200, renderCell: (params) => formatType(params.value as string) },
    { field: 'rating', headerName: 'Rating', width:  200, renderCell: (params) => <Rating name="read-only" value={params.row.rating} readOnly /> },
    {
      field: 'interaction_timestamp',
      headerName: 'Timestamp',
      width: 200,
      renderCell: (params) => new Date(params.row.interaction_timestamp).toLocaleString(),
    },
  ];

  return (
    <div>
        <ApplicationTabBar />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Paper elevation={3} sx={{ width: '80%', padding: 2 }}>
            <Box sx={{ mb: 2 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Interaction Management
            </Typography>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ flexGrow: 0 }}>
                <Button variant="contained" color="primary" onClick={() => navigate('edit')}>
                    New Interaction
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
                rows={filteredInteractions}
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
                <MenuItem onClick={handleMenuEdit}>Edit</MenuItem>
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
            {"Are you sure you want to delete this interaction?"}
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
    </div>
  );
};

export default InteractionPage;
