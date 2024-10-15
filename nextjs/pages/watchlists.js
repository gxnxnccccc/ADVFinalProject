import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Container, Grid, Typography, Card, CardContent, CardMedia } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios'; // Assuming axios is used to fetch data from the backend

const FavoritesPage = () => {
  const [allWatchlist, setWatchlists] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchWatchlists();
  }, []);

  const fetchWatchlists = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/watchlist', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching watchlists");
      }

      const data = await response.json();
      console.log(data.watchlist); // Log the movie data to check the structure
      setWatchlists(data.watchlist);

      // Set favorites after movies are fetched
      setFavorites(new Array(data.watchlist.length).fill(false));
      console.log(allWatchlist); // Check state after setting it
    } catch (error) {
      console.error("Error fetching watchlists:", error);
    }
  };

  const handleFavoriteClick = (index) => {
    const newFavorites = [...favorites];
    newFavorites[index] = !newFavorites[index];
    setFavorites(newFavorites);
  };

  return (
    <Box>
      {/* Favorite Movies Section */}
      <Container sx={{ marginTop: '3rem', marginBottom: '4rem' }} maxWidth="md">
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Proelium', marginBottom: '2rem', textAlign: 'center' }}>
          WATCHLIST MOVIES
        </Typography>
        <Grid container spacing={4}>
          {allWatchlist.length > 0 ? (
            allWatchlist.map((movie, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontFamily: 'Proelium' }}>{movie.movie_title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Proelium' }}>
                      Watchlisted At: {new Date(movie.created_at).toLocaleDateString()}
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
                      onClick={() => handleFavoriteClick(index)}
                    >
                      {favorites[index] ? 'Unfavorite' : 'Favorite'}
                    </Button>
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
