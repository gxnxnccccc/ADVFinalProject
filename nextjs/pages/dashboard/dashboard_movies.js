// nextjs/pages/dashboard/dashboard_movies.js
import * as React from 'react';
import { Typography, Box } from '@mui/material';
import DashboardNavigationBar from '../../components/DashboardNavigationBar'; // Import the new dashboard navbar

export default function Movies() {
  const movies = [
    { id: 1, title: 'Movie 1', genre: 'Action' },
    { id: 2, title: 'Movie 2', genre: 'Drama' },
    { id: 3, title: 'Movie 3', genre: 'Comedy' },
  ];

  return (
    <>
      <DashboardNavigationBar /> {/* Add the dashboard-specific navbar */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ color: '#ffffff' }}>Movies List</Typography>
        <ul>
          {movies.map((movie) => (
            <li key={movie.id} style={{ color: '#ffffff' }}>
              {movie.title} - {movie.genre}
            </li>
          ))}
        </ul>
      </Box>
    </>
  );
}
