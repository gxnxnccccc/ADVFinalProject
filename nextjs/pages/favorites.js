import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Container, Grid, Typography, Card, CardContent, CardMedia, Button, Box } from '@mui/material';
import axios from 'axios';

const FavoritesPage = () => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  useEffect(() => {
    axios.get('/api/favorites')
      .then((response) => {
        setFavoriteMovies(response.data);
      })
      .catch((error) => {
        console.error('Error fetching favorite movies:', error);
      });
  }, []);

  return (
    <Box sx={{ paddingTop: '64px', background: 'linear-gradient(180deg, #a82d2d, #000000)', minHeight: '100vh', color: '#fff' }}>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom align="center" sx={{ marginBottom: '2rem' }}>Favorite Movie List</Typography>
        <Grid container spacing={4}>
          {favoriteMovies.length > 0 ? (
            favoriteMovies.map((movie, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="350"
                    image={movie.image}
                    alt={movie.movie_title}
                  />
                  <CardContent>
                    <Typography variant="h6">{movie.movie_title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Favorited At: {new Date(movie.created_at).toLocaleDateString()}
                    </Typography>
                    <Button
                      fullWidth
                      sx={{
                        marginTop: 2,
                        backgroundColor: '#000',
                        color: '#fff',
                        '&:hover': { backgroundColor: '#333' },
                      }}
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="h6" align="center" sx={{ width: '100%' }}>
              No favorite movies yet.
            </Typography>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default FavoritesPage;