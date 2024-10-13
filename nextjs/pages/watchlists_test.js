import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Container, Grid, Typography, Card, CardContent, CardMedia } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios'; // Assuming axios is used to fetch data from the backend

const FavoritesPage = () => {
  const [watchlistMovies, setWatchlistMovies] = useState([]);

  // Fetch watchlist movies from the database
  useEffect(() => {
    axios.get('/api/watchlists') // Replace with your backend API endpoint
      .then((response) => {
        setFavoriteMovies(response.data);
      })
      .catch((error) => {
        console.error('Error fetching watchlist movies:', error);
      });
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #a82d2d, #000000)',
        color: '#fff',
        width: '100vw',
        overflowX: 'hidden',
        paddingTop: '6rem',
        fontFamily: 'var(--font-family)',
      }}
    >
      {/* Favorite Movies Section */}
      <Container sx={{ marginTop: '3rem', marginBottom: '4rem' }} maxWidth="md">
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Proelium', marginBottom: '2rem', textAlign: 'center' }}>
          WATCHLIST MOVIES
        </Typography>
        <Grid container spacing={4}>
          {watchlistMovies.length > 0 ? (
            watchlistMovies.map((movie, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontFamily: 'Proelium' }}>{movie.movie_title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Proelium' }}>
                      Watchlist At: {new Date(movie.created_at).toLocaleDateString()}
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        marginTop: 2,
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        fontFamily: 'Proelium',
                        '&:hover': {
                          backgroundColor: '#333333',
                        },
                      }}
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="h6" sx={{ textAlign: 'center', width: '100%', fontFamily: 'Proelium' }}>
              No watchlist movies yet.
            </Typography>
          )}
        </Grid>
      </Container>

      {/* Footer Section */}
      <Box sx={{ background: '#000000', color: '#fff', padding: 2, textAlign: 'center', width: '100%', fontFamily: 'Proelium', marginTop: '4rem' }}>
        <Typography variant="body2" sx={{ fontFamily: 'Proelium' }}>
          © 2024 Movie Ticket Booking. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default FavoritesPage;
