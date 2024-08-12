// src/components/ApplicationList.tsx
import React, { useEffect, useState, MouseEvent } from 'react';
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarFilterButton, GridToolbarExport, GridToolbar } from '@mui/x-data-grid';
import { Box, TextField, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { fetchApplications } from '../utils/api'; // Ensure the path is correct

interface Application {
  id: string;
  company: string;
  link: string;
  job_title: string;
  applied_timestamp: string;
}

const ApplicationList: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await fetchApplications();
        setApplications(data);
      } catch (err) {
        setError('Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleMenuClick = (event: MouseEvent<HTMLButtonElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleAction = (action: string) => {
    if (selectedId) {
      console.log(`Action: ${action} on ID: ${selectedId}`);
      // Perform actions based on the selectedId and action
      handleMenuClose();
    }
  };

  const filteredApplications = applications.filter((app) =>
    app.company.toLowerCase().includes(search.toLowerCase())
  );

  const columns: GridColDef<Application>[] = [
    {
      field: 'id',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <IconButton
          onClick={(event: MouseEvent<HTMLButtonElement>) => handleMenuClick(event, params.value)}
          aria-controls="simple-menu"
          aria-haspopup="true"
        >
          <MoreVertIcon />
        </IconButton>
      ),
    },
    { field: 'company', headerName: 'Company', width: 200 },
    { field: 'link', headerName: 'Link', width: 250 },
    { field: 'job_title', headerName: 'Job Title', width: 200 },
    { field: 'applied_timestamp', headerName: 'Applied Timestamp', width: 200 },
  ];

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <TextField
          variant="outlined"
          fullWidth
          label="Search by Company"
          value={search}
          onChange={handleSearchChange}
        />
      </Box>
      <DataGrid
        rows={filteredApplications}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
      />
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction('Edit')}>Edit</MenuItem>
        <MenuItem onClick={() => handleAction('Delete')}>Delete</MenuItem>
        <MenuItem onClick={() => handleAction('View Details')}>View Details</MenuItem>
      </Menu>
    </Box>
  );
};

export default ApplicationList;
