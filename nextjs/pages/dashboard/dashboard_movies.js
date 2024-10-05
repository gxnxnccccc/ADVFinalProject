// nextjs/pages/dashboard/dashboard_movies.js
import * as React from 'react';
import { Typography, Box } from '@mui/material';
import DashboardNavigationBar from '../../components/DashboardNavigationBar'; // Import the new dashboard navbar

export default function Reports() {
  return (
    <>
      <DashboardNavigationBar /> {/* Add the dashboard-specific navbar */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ color: '#ffffff' }}>Movies</Typography>
        <Typography sx={{ color: '#ffffff' }}>
          This is the movie section. More data to come here.
        </Typography>
      </Box>
    </>
  );
}