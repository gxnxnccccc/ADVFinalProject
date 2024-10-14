import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Container, Grid, Typography, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import FavoriteIcon from '@mui/icons-material/Favorite';

// // Movie data array
// const allMovies = [
//   { title: 'Deadpool & Wolverine', releaseDate: '2024-10-10', image: '/images/Deadpool_Wolverine.jpg' },
//   { title: 'Fly Me To The Moon', releaseDate: '2024-10-15', image: '/images/flymetothemoon.jpg' },
//   { title: 'Transformer ONE', releaseDate: '2024-10-20', image: '/images/TransformerONE.jpg' },
//   { title: 'The Batman', releaseDate: '2024-11-05', image: '/images/thebatman.jpg' },
//   { title: 'Spider-Man: No Way Home', releaseDate: '2024-11-12', image: '/images/spiderman.jpg' },
//   { title: 'Avatar: The Way of Water', releaseDate: '2024-12-15', image: '/images/avatar.jpg' },
// ];

const MovieListPage = () => {
  const [allMovies, setMovies] = useState([]);
  const [Watchlist, setWatchlist] = useState(new Array(allMovies.length).fill(false));

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
        console.log(data.movies); // Log the movie data to check the structure
        setMovies(data.movies);

        // Set Watchlist after movies are fetched
        setWatchlist(new Array(data.movies.length).fill(false));
        console.log(allMovies); // Check state after setting it
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }; 
  
    const handleWatchlistClick = (index) => { // FIX
      const newWatchlist = [...Watchlist];
      newWatchlist[index] = !newWatchlist[index];
      setWatchlist(newWatchlist);
    };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #a82d2d, #000000)',
        color: '#fff',
        width: '100vw',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column', // Stack elements vertically
        justifyContent: 'flex-start', // Align to top
        alignItems: 'center', // Center horizontally
        paddingTop: '4rem', // Adjust padding for spacing
        fontFamily: 'var(--font-family)',
      }}
    >
      {/* Movie List Section */}
      <Container sx={{ marginTop: '0rem', marginBottom: '4rem' }} maxWidth="md">
        <Typography variant="h4" sx={{ paddingTop: '2rem', fontFamily: 'Proelium', marginBottom: '2rem', textAlign: 'center' }}>
          Movie List
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {allMovies.map((movie, index) => (
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
                      onClick={() => handleWatchlistClick(index)}
                      sx={{
                        color: Watchlist[index] ? 'pink' : 'gray', // Toggle color based on state
                      }}
                    >
                      <FavoriteIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Proelium' }}>
                    Release Date: {movie.release_date}
                  </Typography>
                  {/* Book Now button styled as requested */}
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

      {/* Footer Section */}
      <Box sx={{ background: '#000000', color: '#fff', padding: 2, textAlign: 'center', width: '100%', fontFamily: 'Proelium', marginTop: '4rem' }}>
        <Typography variant="body2" sx={{ fontFamily: 'Proelium' }}>
          © 2024 Movie Ticket Booking. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default MovieListPage;