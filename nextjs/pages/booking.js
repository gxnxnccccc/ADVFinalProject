import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';

const BookingPage = () => {
  const router = useRouter();
  const [Booking, setBooking] = useState([]);

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    const user_id = localStorage.getItem('user_id');
    const movie_id = localStorage.getItem('movie_id');

    if (!user_id) {
      console.error("User ID not found. Make sure the user is logged in.");
      return;
    }

    if (!movie_id) {
      console.error("Movie ID not found.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/booking?user_id=${user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching booking");
      }

      const data = await response.json();
      setBooking(data.booking);
      setBooking(data.booking.map(() => true)); 
    } catch (error) {
      console.error("Error fetching booking:", error);
    }
  };

  const handleBookingSubmit = async (movie_id, seat_amount, index) => {
   const user_id = localStorage.getItem('user_id');

    if (!user_id) {
      console.error("User ID not found. Make sure the user is logged in.");
      return false;
    }

    if (!movie_id) {
      console.error("Movie ID not found");
      return false;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/booking/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: parseInt(user_id), // Ensure user_id is sent as an integer
          movie_id: movie_id, // Use the fetched movie_id
          seat_amount: parseInt(seat_amount)
        }),
      });

      if (!response.ok){
        throw new Error(response.status)
      }
      await fetchBooking(); // Refresh the movie list
      router.push('/');

    } catch (error) {
      console.error("Error booking movie:", error);
      return false;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(180deg, #a82d2d, #000000)',
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        fontFamily: 'Proelium',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            padding: '3rem',
            borderRadius: '1.5rem',
            backgroundColor: '#fff',
            width: '100%',
          }}
        >
          <Typography variant="h4" sx={{ fontFamily: 'Proelium', marginBottom: '1.5rem', textAlign: 'center' }}>
            Book Tickets for {movie_id.title}
          </Typography>
          <Box
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              textAlign: 'center',
              marginBottom: '2rem',
            }}
          >
            <TextField
              label="Number of Seats"
              type="number"
              variant="outlined"
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              InputProps={{ inputProps: { min: 1 } }}
              sx={{ width: '100%', backgroundColor: '#fff', borderRadius: '5px' }}
            />

            <Button
              variant="contained"
              sx={{
                backgroundColor: '#000000',
                color: '#ffffff',
                padding: '1rem 2rem',
                borderRadius: '2rem',
                fontFamily: 'Proelium',
                '&:hover': {
                  backgroundColor: '#333333',
                },
              }}
              onClick={() => handleBookingSubmit(movieId, seats)}
              fullWidth
            >
              Confirm Booking
            </Button>
          </Box>

          <Typography variant="body2" sx={{ color: '#000000', textAlign: 'center', fontFamily: 'Proelium' }}>
            We hope you enjoy your movie experience!
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default BookingPage;
