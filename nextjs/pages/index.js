import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Container, Grid, Typography, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import FavoriteIcon from '@mui/icons-material/Favorite';

// const movies = [
//   { title: 'Deadpool & Wolverine', releaseDate: '2024-10-10', image: '/images/Deadpool_Wolverine.jpg' },
//   { title: 'Fly Me To The Moon', releaseDate: '2024-10-15', image: '/images/flymetothemoon.jpg' },
//   { title: 'Transformer ONE', releaseDate: '2024-10-20', image: '/images/TransformerONE.jpg' },
// ];

const showtimes = [
  { title: 'Inside Out', time: '12:00 PM', location: 'Cinema 1', seats: 'Available' },
  { title: 'Bad Boys', time: '2:30 PM', location: 'Cinema 2', seats: 'Few Left' },
];



const IndexPage = () => {
  const [movies, setMovies] = useState([]);
  const [Watchlist, setWatchlist] = useState(new Array(movies.length).fill(false));

useEffect(() => {
  fetchMovies();
}, []); 

  const fetchMovies = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/movies', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error("Error fetching movies");
      }
  
      const data = await response.json();
      setMovies(data.movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }; 

  const handleWatchlistClick = (index) => { // Renamed function
    const newWatchlist = [...Watchlist];
    newWatchlist[index] = !newWatchlist[index];
    setWatchlist(newWatchlist);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh', // or 'auto'
        height: '100%',
        background: 'linear-gradient(180deg, #a82d2d, #000000)',
        color: '#fff',
        width: '100vw',
        overflowX: 'hidden',
        fontFamily: 'var(--font-family)', // Use global default font
      }}
    >
      {/* Featured Movies Section */}
      <Container sx={{ marginTop: '20rem', marginBottom: '4rem' }} maxWidth="md">
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
                  image={`data:image/jpg;base64,${movie.image_base64}`}
                  alt={movie.title}
                />
                <CardContent>
                  {/* Title and Heart Button in the Same Row */}
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ fontFamily: 'Proelium' }}>{movie.title}</Typography>
                    <IconButton
                      onClick={() => handleWatchlistClick(index)} // continue
                      sx={{
                        color: Watchlist[index] ? 'pink' : 'gray',
                      }}
                    >
                      <FavoriteIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Proelium' }}>
                    Release Date: {movie.release_date}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => router.push(`/booking?title=${encodeURIComponent(movie.title)}`)} // Navigate to booking page with movie title
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