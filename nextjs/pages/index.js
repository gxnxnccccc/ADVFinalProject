import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Container, Grid, Typography, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useRouter } from 'next/router';

const showtimes = [
  { title: 'Inside Out', time: '12:00 PM', location: 'Cinema 1', seats: 'Available' },
  { title: 'Bad Boys', time: '2:30 PM', location: 'Cinema 2', seats: 'Few Left' },
];

const IndexPage = () => {
  const [movies, setMovies] = useState([]);
  const [Watchlist, setWatchlist] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchMovies();  // Fetch movies
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
      fetchWatchlist(data.movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };
  
  const fetchWatchlist = async (movies) => {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
      console.error("User ID not found. Make sure the user is logged in.");
      return;
    }

    try {
      const watchlistResponse = await fetch(`http://127.0.0.1:8000/api/watchlist?user_id=${user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!watchlistResponse.ok) {
        throw new Error("Error fetching watchlist");
      }

      const watchlistData = await watchlistResponse.json();
      const watchlistMovieIds = watchlistData.watchlist.map(item => item.movie_id);

      const watchlistState = movies.map(movie => watchlistMovieIds.includes(movie.movie_id));
      setWatchlist(watchlistState);

      localStorage.setItem('watchlist', JSON.stringify(watchlistState));
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    }
  };

  const handleWatchlistSubmit = async (movie_id, isInWatchlist, index) => {
    const user_id = localStorage.getItem('user_id');

    if (!user_id) {
      console.error("User ID not found. Make sure the user is logged in.");
      return false;
    }

    if (isInWatchlist) {
      return await handleWatchlistDelete(movie_id, user_id, index);
    } else {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/watchlist/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            movie_id: movie_id,
            user_id: parseInt(user_id),
          }),
        });

        if (!response.ok) {
          throw new Error(response.status);
        }

        const newWatchlist = [...Watchlist];
        newWatchlist[index] = true;
        setWatchlist(newWatchlist);

        localStorage.setItem('watchlist', JSON.stringify(newWatchlist));

        return true;
      } catch (error) {
        console.error("Error adding movie to watchlist:", error);
        return false;
      }
    }
  };

  const handleWatchlistDelete = async (movie_id, user_id, index) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/watchlist/delete?user_id=${user_id}&movie_id=${movie_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove movie from watchlist");
      }

      const newWatchlist = [...Watchlist];
      newWatchlist[index] = false;
      setWatchlist(newWatchlist);

      localStorage.setItem('watchlist', JSON.stringify(newWatchlist));

      return true;
    } catch (error) {
      console.error("Error removing movie from watchlist:", error);
      return false;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #a82d2d, #000000)',
        color: '#fff',
        width: '100vw',
        overflowX: 'hidden',
        fontFamily: 'var(--font-family)',
      }}
    >
      {/* Now Showing Section */}
      <Container sx={{ marginTop: '20rem', marginBottom: '4rem', width: '100%' }} maxWidth="lg">
        <Typography variant="h4" sx={{ fontFamily: 'Proelium', marginBottom: '2rem' }}>
          Now Showing
        </Typography>

        {/* Horizontal Scroll Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            overflowX: 'auto',  // Enables horizontal scrolling
            scrollBehavior: 'smooth',
            justifyContent: 'flex-start',  // Keeps the movie cards aligned to the start
            paddingBottom: '2rem',
            width: '100%',
            maxWidth: '100%',  // Constrain the visible area to fit 3 movie cards
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#555',
            },
          }}
        >
          {movies.map((movie, index) => (
            <Box key={index} sx={{ flex: '0 0 auto', paddingRight: '1rem', width: '300px' }}>
              <Card>
                <CardMedia
                  component="img"
                  height="350"
                  image={`data:image/jpg;base64,${movie.image_base64}`}
                  alt={movie.title}
                />
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ fontFamily: 'Proelium' }}>{movie.title}</Typography>
                    <IconButton
                      onClick={() => handleWatchlistSubmit(movie.movie_id, Watchlist[index], index)}
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
                    onClick={() => router.push(`/booking?movie_id=${encodeURIComponent(movie.movie_id)}`)}
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
            </Box>
          ))}
        </Box>
      </Container>

      {/* Showtimes Section */}
      <Container sx={{ marginBottom: '4rem' }} maxWidth="md">
        <Typography variant="h4" sx={{ fontFamily: 'Proelium', marginBottom: '2rem' }}>
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
      <Box sx={{ background: '#000000', color: '#fff', padding: 2, textAlign: 'center', width: '100%' }}>
        <Typography variant="body2" sx={{ fontFamily: 'Proelium' }}>
          © 2024 Movie Ticket Booking. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default IndexPage;
