import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Container, Grid, Typography, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useRouter } from 'next/router';

const MovieListPage = () => {
  const [allMovies, setMovies] = useState([]);
  const [Watchlist, setWatchlist] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchMovies(); // Fetch movies and then fetch watchlist after loading movies
  }, []);

  const fetchMovies = async () => {
    try {
      const movieResponse = await fetch('http://127.0.0.1:8000/api/movies', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!movieResponse.ok) {
        throw new Error("Error fetching movies");
      }

      const movieData = await movieResponse.json();
      setMovies(movieData.movies);

      // After fetching movies, fetch the user's watchlist
      fetchWatchlist(movieData.movies);
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

      // Update the React state and localStorage with the watchlist state
      const watchlistState = movies.map(movie => watchlistMovieIds.includes(movie.movie_id));
      setWatchlist(watchlistState);

      // Sync localStorage with the watchlist fetched from the backend
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
        newWatchlist[index] = true; // Set to true because the movie was added
        setWatchlist(newWatchlist);

        // Update localStorage to keep track of watchlist status
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
      newWatchlist[index] = false; // Set to false because the movie was removed
      setWatchlist(newWatchlist);

      // Update localStorage to reflect watchlist removal
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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: '4rem',
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
                      onClick={() => {
                        handleWatchlistSubmit(movie.movie_id, Watchlist[index], index);
                      }}
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
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer Section */}
      <Box sx={{ background: '#000000', color: '#fff', padding: 2, textAlign: 'center', width: '100%', fontFamily: 'Proelium', marginTop: '4rem' }}>
        <Typography variant="body2" sx={{ fontFamily: 'Proelium' }}>
          Â© 2024 Movie Ticket Booking. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default MovieListPage;
