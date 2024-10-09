import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Grid, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Card, CardContent, CardMedia, Stack, Container } from '@mui/material';
import DashboardNavigationBar from '../../components/DashboardNavigationBar';
import Tesseract from 'tesseract.js';
// import { StackOrder } from '@mui/x-charts/internals/stackSeries';
// import { CenterFocusStrong } from '@mui/icons-material';

export default function DashboardMovies() {
  const [movies, setMovies] = useState([]);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    duration: '',
    language: '',
    release_date: '',
    genre: '',
    rating: '',
    image: null, // Set initial image to null
  });

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      setNewMovie(prevState => ({ ...prevState, image: file })); // Store the file in state
      Tesseract.recognize(
        file,
        'eng',
        {
          logger: (info) => console.log(info)
        }
      ).then(({ data: { text } }) => {
        setText(text);
        setLoading(false);
      }).catch((error) => {
        console.error("Error during OCR processing:", error);
        setLoading(false);
      });
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewMovie({
      title: '',
      description: '',
      duration: '',
      language: '',
      release_date: '',
      genre: '',
      rating: '',
      image: null, // Reset image to null
    });
    setText(''); // Reset extracted text
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

    if (!newMovie.image) {
      alert("Please upload an image.");
      return;
    }

    // Create a FormData object
    const formData = new FormData();
    formData.append('title', newMovie.title);
    formData.append('description', newMovie.description);
    formData.append('duration', newMovie.duration);
    formData.append('language', newMovie.language);
    formData.append('release_date', newMovie.release_date);
    formData.append('genre', newMovie.genre);
    formData.append('rating', newMovie.rating);
    formData.append('image', newMovie.image);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/movies/add', {
        method: 'POST',
        body: formData,
      });

      // if (!response.ok) {
      //   const errorResponse = await response.json();
      //   console.error("Error adding movie:", errorResponse);
      //   alert(`Error: ${errorResponse.detail}`);
      //   return;
      // }

      await fetchMovies(); // Refresh the movie list
      handleClose(); // Close the dialog
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  return (
    <>
      <DashboardNavigationBar />
      
      <Box container spacing={4} sx={{ mt: 4 }}>...</Box>
      <Box sx={{ mt: 160, px: 2, alignItems: "center" }}>
        <Stack alignItems="center">
        <Typography variant="h4" sx={{ color: '#ffffff', mb: 2 }}>Movies</Typography>
          <Button variant="contained" color="primary" style={{ position: 'center', zIndex: 10 }} onClick={handleOpen}>
            Add Movie
          </Button>
        </Stack>
        <Container sx={{ marginBottom: '4rem' }} maxWidth="md">
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} key={movie.movie_id}>
              <Card sx={{ backgroundColor: '#333', color: '#ffffff' }}>
                <CardMedia
                  component="img"
                  style={{ width: '100%', height: 'auto' }}
                  
                  image={`data:image/jpg;base64,${movie.image_base64}`}
                  alt={movie.title}
                />
                <CardContent>
                  <Typography variant="h6">{movie.title}</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>{movie.genre}</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>{movie.language}</Typography>
                  <Typography variant="body2">{`Duration: ${movie.duration} mins`}</Typography>
                  <Typography variant="body2">{`Rating: ${movie.rating}`}</Typography>
                  <Button variant="contained" color="primary" style={{ position: 'center', zIndex: 10 }} onClick={handleOpen}>
                  update movie
                  </Button>
                  
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        </Container>
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
            <div>
              <TextField
                margin="dense"
                label="Image"
                type="file"
                fullWidth
                accept="image/*"
                onChange={handleFileChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {loading && <p>Processing...</p>}
              {/* {text && (
                <div>
                  <h2>Extracted Text:</h2>
                  <p>{text}</p>
                </div>
              )} */}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">Cancel</Button>
            <Button onClick={MoviehandleSubmit} color="primary">Add</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Update Movie</DialogTitle>
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
            <div>
              <TextField
                margin="dense"
                label="Image"
                type="file"
                fullWidth
                accept="image/*"
                onChange={handleFileChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {loading && <p>Processing...</p>}
              {/* {text && (
                <div>
                  <h2>Extracted Text:</h2>
                  <p>{text}</p>
                </div>
              )} */}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">Cancel</Button>
            <Button onClick={MoviehandleSubmit} color="primary">Update</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}