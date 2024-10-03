// nextjs/pages/dashboard/dashboard_index.js
import * as React from 'react';
import { Typography, Box } from '@mui/material';
import DashboardNavigationBar from '../../components/DashboardNavigationBar'; // Import the new dashboard navbar

export default function Dashboard() {
  return (
    <>
      <DashboardNavigationBar /> {/* Add the dashboard-specific navbar */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ color: '#ffffff' }}>Welcome to the Admin Dashboard</Typography>
        <Typography sx={{ color: '#ffffff' }}>
          Use the navigation links to access different sections of the dashboard.
        </Typography>
      </Box>
    </>
  );
}
