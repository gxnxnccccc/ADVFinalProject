import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Container, Grid, Typography, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import FavoriteIcon from '@mui/icons-material/Favorite';

const movies = [
  { title: 'Deadpool & Wolverine', releaseDate: '2024-10-10', image: '/images/Deadpool_Wolverine.jpg' },
  { title: 'Fly Me To The Moon', releaseDate: '2024-10-15', image: '/images/flymetothemoon.jpg' },
  { title: 'Transformer ONE', releaseDate: '2024-10-20', image: '/images/TransformerONE.jpg' },
];

const showtimes = [
  { title: 'Inside Out', time: '12:00 PM', location: 'Cinema 1', seats: 'Available' },
  { title: 'Bad Boys', time: '2:30 PM', location: 'Cinema 2', seats: 'Few Left' },
];

const IndexPage = () => {
  const [favorites, setFavorites] = useState(new Array(movies.length).fill(false));

  const handleFavoriteClick = (index) => {
    const newFavorites = [...favorites];
    newFavorites[index] = !newFavorites[index];
    setFavorites(newFavorites);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #a82d2d, #000000)',
        color: '#fff',
        width: '100vw',
        overflowX: 'hidden',
        fontFamily: 'var(--font-family)', // Use global default font
      }}
    >
      {/* Header Section */}
      <AppBar position="static" sx={{ background: 'transparent', width: '100%' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: 'Proelium' }}>
            Movie Ticket Booking
          </Typography>
          <Box>
            <Button color="inherit" sx={{ fontFamily: 'Proelium' }}>Home</Button>
            <Button color="inherit" sx={{ fontFamily: 'Proelium' }}>Movies</Button>
            <Button color="inherit" sx={{ fontFamily: 'Proelium' }}>Showtimes</Button>
            <Button color="inherit" sx={{ fontFamily: 'Proelium' }}>Contact</Button>
            <Button color="inherit" sx={{ fontFamily: 'Proelium' }}>Login</Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: `url('/images/hero.jpg')`,
          backgroundSize: 'cover',
          height: '400px',
          color: '#fff',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
          marginBottom: '4rem',
        }}
      >
        <Box>
          <Typography variant="h3" sx={{ fontFamily: 'Proelium' }}>Book Your Tickets Now!</Typography>
          <Button variant="contained" sx={{ margin: 2, background: '#a82d2d', fontFamily: 'Proelium' }}>
            View Movies
          </Button>
          <Button variant="contained" sx={{ margin: 2, background: '#000000', fontFamily: 'Proelium' }}>
            Check Showtimes
          </Button>
        </Box>
      </Box>

      {/* Featured Movies Section */}
      <Container sx={{ marginBottom: '4rem' }} maxWidth="md">
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Proelium', marginBottom: '2rem' }}>
          Now Showing
        </Typography>
        <Grid container spacing={4}>
          {movies.map((movie, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="350"
                  image={movie.image}
                  alt={movie.title}
                />
                <CardContent>
                  {/* Title and Heart Button in the Same Row */}
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ fontFamily: 'Proelium' }}>{movie.title}</Typography>
                    <IconButton
                      onClick={() => handleFavoriteClick(index)}
                      sx={{
                        color: favorites[index] ? 'pink' : 'gray',
                      }}
                    >
                      <FavoriteIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Proelium' }}>
                    Release Date: {movie.releaseDate}
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
          ))}
        </Grid>
      </Container>

      {/* Showtimes Section */}
      <Container sx={{ marginBottom: '4rem' }} maxWidth="md">
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Proelium', marginBottom: '2rem' }}>
          Upcoming Showtimes
        </Typography>
        <Grid container spacing={4}>
          {showtimes.map((showtime, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontFamily: 'Proelium' }}>{showtime.title}</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'Proelium' }}>Time: {showtime.time}</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'Proelium' }}>
                    Location: {showtime.location}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'Proelium' }}>Seats: {showtime.seats}</Typography>
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
          ))}
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

export default IndexPage;
