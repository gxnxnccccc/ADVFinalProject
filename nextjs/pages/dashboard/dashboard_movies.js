// nextjs/pages/dashboard/dashboard_movies.js
import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Grid, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Card, CardContent, CardMedia } from '@mui/material';
import DashboardNavigationBar from '../../components/DashboardNavigationBar';

export default function DashboardMovies() {
  const [movies, setMovies] = useState([]);
  const [open, setOpen] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    duration: '',
    language: '',
    release_date: '',
    genre: '',
    rating: '',
    image: ''
  });

  // Fetch movies from the API when the component loads
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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMovie((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const MoviehandleSubmit = async () => {
    // Validate the rating
    if (newMovie.rating < 0 || newMovie.rating > 10) {
      alert("Rating must be between 0 and 10.");
      return;
    }
  
    // Validate the image URL
    if (!newMovie.image.match(/\.(jpeg|jpg|gif|png)$/)) {
      alert("Please enter a valid image URL (ending in .jpg, .jpeg, .png, etc.).");
      return;
    }
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/movies/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMovie),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.detail || "Error adding movie");
      }
  
      await fetchMovies(); // Refresh the movie list
      handleClose(); // Close the dialog
      setNewMovie({
        title: '',
        description: '',
        duration: '',
        language: '',
        release_date: '',
        genre: '',
        rating: '',
        image: ''
      });
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  return (
    <>
      <DashboardNavigationBar />
      <Box sx={{ mt: 4, px: 2 }}>
        <Typography variant="h4" sx={{ color: '#ffffff', mb: 2 }}>Movies</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Movie
        </Button>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} key={movie.movie_id}>
              <Card sx={{ backgroundColor: '#333', color: '#ffffff' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={movie.image}
                  alt={movie.title}
                />
                <CardContent>
                  <Typography variant="h6">{movie.title}</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>{movie.genre}</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>{movie.language}</Typography>
                  <Typography variant="body2">{`Duration: ${movie.duration} mins`}</Typography>
                  <Typography variant="body2">{`Rating: ${movie.rating}`}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Add Movie Dialog */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add New Movie</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              name="title"
              value={newMovie.title}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              name="description"
              value={newMovie.description}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Duration"
              type="number"
              fullWidth
              name="duration"
              value={newMovie.duration}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Language"
              type="text"
              fullWidth
              name="language"
              value={newMovie.language}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Release Date"
              type="date"
              fullWidth
              name="release_date"
              value={newMovie.release_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              label="Genre"
              type="text"
              fullWidth
              name="genre"
              value={newMovie.genre}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Rating"
              type="number"
              fullWidth
              name="rating"
              value={newMovie.rating}
              onChange={handleChange}
              inputProps={{ step: "0.1", min: "0", max: "10" }}
            />
            <TextField
              margin="dense"
              label="Image URL"
              type="text"
              fullWidth
              name="image"
              value={newMovie.image}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">Cancel</Button>
            <Button onClick={MoviehandleSubmit} color="primary">Add</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}