import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Container, Grid, Typography, Card, CardContent, CardMedia } from '@mui/material';
import { Box } from '@mui/system';

const FavoritesPage = () => {
  const [allWatchlist, setWatchlists] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchWatchlists();
  }, []);

  const fetchWatchlists = async () => {
    const user_id = localStorage.getItem('user_id'); // Assuming user_id is stored in localStorage
    if (!user_id) {
      console.error("User ID not found. Make sure the user is logged in.");
      return;
    }

    try {
      // Log the API call
      console.log(`Fetching watchlist for user_id: ${user_id}`);

      const response = await fetch(`http://127.0.0.1:8000/api/watchlist/user_id=${user_id}`, {  // Pass the user_id to get the specific user's watchlist
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if the response is OK
      if (!response.ok) {
        throw new Error("Error fetching watchlists");
      }

      const data = await response.json();

      // Log the entire API response for debugging
      console.log("Watchlist data:", data);

      // Check if the watchlist exists in the response and it's an array
      if (Array.isArray(data.watchlist) && data.watchlist.length > 0) {
        setWatchlists(data.watchlist);
        setFavorites(new Array(data.watchlist.length).fill(false));  // Initialize favorites based on fetched watchlist length
      } else {
        console.log("No watchlist found for this user.");
        setWatchlists([]);  // Reset in case of empty response
      }
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
        
        {/* Log allWatchlist state to check if it's being set correctly */}
        {console.log("Current watchlist state:", allWatchlist)}

        <Grid container spacing={4}>
          {allWatchlist.length > 0 ? (
            allWatchlist.map((movie, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="350"
                    image={`data:image/jpg;base64,${movie.image_base64}`}  // Assuming image_base64 is available
                    alt={movie.movie_title}
                  />
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
