import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Grid, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Card, CardContent, CardMedia, Stack, Container } from '@mui/material';
import DashboardNavigationBar from '../../components/DashboardNavigationBar';
import Tesseract from 'tesseract.js';
import { set } from 'date-fns';

export default function DashboardMovies() {
  const [movies, setMovies] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false); // Separate state for Add Movie dialog
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false); // Separate state for Update Movie dialog
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null); // To store the movie to update
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

  // Handle opening and closing of Add Movie dialog
  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    resetNewMovie(); // Reset form values
  };

  // Handle opening and closing of Update Movie dialog
  const handleOpenUpdateDialog = (movie) => {
    setSelectedMovie(movie);
    setNewMovie(movie); // Populate the form with the selected movie's data
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    resetNewMovie(); // Reset form values
  };

  const resetNewMovie = () => {
    setNewMovie({
      title: '',
      description: '',
      duration: '',
      language: '',
      release_date: '',
      genre: '',
      rating: '',
      image: null,
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

      // setTimeout(() => {
      //   Location.reload
      // }, 10000);  // 10000 milliseconds = 10 seconds
      if (!response.ok){
        throw new Error(response.status)
      }
      await fetchMovies(); // Refresh the movie list
      handleCloseAddDialog(); // Close the add dialog
    } catch (error) {
      await fetchMovies(); // Refresh the movie list
      handleCloseAddDialog(); // Close the add dialog
      console.error("Error adding movie:", error);
    }
  };

  const handleUpdateSubmit = async () => {
    if (!selectedMovie) 
      return;

    // const formData = new FormData();
    // formData.append('title', newMovie.title);
    // formData.append('description', newMovie.description);
    // formData.append('duration', newMovie.duration);
    // formData.append('language', newMovie.language);
    // formData.append('release_date', newMovie.release_date);
    // formData.append('genre', newMovie.genre);
    // formData.append('rating', newMovie.rating);

    // if (newMovie.image) {
    //   formData.append('image', newMovie.image); // Only append image if it's new
    // }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/movie/update?movie_id=${selectedMovie.movie_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title: newMovie.title,
          description: newMovie.description,
          duration: newMovie.duration,
          language: newMovie.language,
          release_date: newMovie.release_date,
          genre: newMovie.genre,
          rating: newMovie.rating,
        }),
      });

      await fetchMovies(); // Refresh the movie list
      handleCloseUpdateDialog(); // Close the update dialog
    } catch (error) {
      console.error("Error updating movie:", error);
    }
  };

  const handleDeleteAccount = async (movie) => {
    // setSelectedMovie(movie);
    if (confirm("Are you sure you want to delete your account?")) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/movie/delete?movie_id=${movie}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (response.ok) {
          await fetchMovies(); // Refresh the movie list
          handleCloseUpdateDialog(); // Close the update dialog
        } else {
          console.error("Failed to delete movie. Status:", response.status);
        }
      } catch (error) {
        console.error("Error deleting movie:", error);
      }
    }
  };
  
  return (
    <>
      <DashboardNavigationBar />
    
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #a82d2d, #000000)',
        color: '#fff',
        width: '100vw',
        overflowX: 'hidden',
        paddingTop: '5rem', // Adjust padding for spacing
        fontFamily: 'var(--font-family)', // Use global default font
      }}
      >
        <Stack alignItems="center">
          <Typography variant="h4" sx={{ color: '#ffffff', mb: 2 }}>Movies</Typography>
          <Button variant="contained" color="primary" style={{ zIndex: 10 }} onClick={handleOpenAddDialog}>
            Add Movie
          </Button>
        </Stack>
        <Container sx={{ marginBottom: '10' }} maxWidth="md">
          <Grid container spacing={4} sx={{ mt: 4 }} height={0}>
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
                    <Button variant="contained" color="primary" style={{ zIndex: 10 }} onClick={() => handleOpenUpdateDialog(movie)}>
                      Update Movie
                    </Button>
                    <Button variant="contained" color="error" style={{ zIndex: 10, marginLeft: 10 }} onClick={() => handleDeleteAccount(movie.movie_id)}>
                      DELETE
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Add Movie Dialog */}
        <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
          <DialogTitle>Add New Movie</DialogTitle>
          <DialogContent>
            <TextField margin="dense" label="Title" type="text" fullWidth name="title" value={newMovie.title} onChange={handleChange} />
            <TextField margin="dense" label="Description" type="text" fullWidth name="description" value={newMovie.description} onChange={handleChange} />
            <TextField margin="dense" label="Duration" type="number" fullWidth name="duration" value={newMovie.duration} onChange={handleChange} />
            <TextField margin="dense" label="Language" type="text" fullWidth name="language" value={newMovie.language} onChange={handleChange} />
            <TextField margin="dense" label="Release Date" type="date" fullWidth name="release_date" value={newMovie.release_date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            <TextField margin="dense" label="Genre" type="text" fullWidth name="genre" value={newMovie.genre} onChange={handleChange} />
            <TextField margin="dense" label="Rating" type="number" fullWidth name="rating" value={newMovie.rating} onChange={handleChange} inputProps={{ step: "0.1", min: "0", max: "10" }} />
            <TextField margin="dense" label="Image" type="file" fullWidth accept="image/*" onChange={handleFileChange} InputLabelProps={{ shrink: true }} />
            {loading && <p>Processing...</p>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog} color="secondary">Cancel</Button>
            <Button onClick={MoviehandleSubmit} color="primary">Add</Button>
          </DialogActions>
        </Dialog>

        {/* Update Movie Dialog */}
        <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
          <DialogTitle>Update Movie</DialogTitle>
          <DialogContent>
            <TextField margin="dense" label="Title" type="text" fullWidth name="title" value={newMovie.title} onChange={handleChange} />
            <TextField margin="dense" label="Description" type="text" fullWidth name="description" value={newMovie.description} onChange={handleChange} />
            <TextField margin="dense" label="Duration" type="number" fullWidth name="duration" value={newMovie.duration} onChange={handleChange} />
            <TextField margin="dense" label="Language" type="text" fullWidth name="language" value={newMovie.language} onChange={handleChange} />
            <TextField margin="dense" label="Release Date" type="date" fullWidth name="release_date" value={newMovie.release_date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            <TextField margin="dense" label="Genre" type="text" fullWidth name="genre" value={newMovie.genre} onChange={handleChange} />
            <TextField margin="dense" label="Rating" type="number" fullWidth name="rating" value={newMovie.rating} onChange={handleChange} inputProps={{ step: "0.1", min: "0", max: "10" }} />
            {/* <TextField margin="dense" label="Image" type="file" fullWidth accept="image/*" onChange={handleFileChange} InputLabelProps={{ shrink: true }} />
            {loading && <p>Processing...</p>} */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseUpdateDialog} color="secondary">Cancel</Button>
            <Button onClick={handleUpdateSubmit} color="primary">Update</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}