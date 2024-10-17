import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, Card, CardContent, Stack, Container } from '@mui/material';

export default function DashboardUserBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user_id = localStorage.getItem('user_id');
    console.log('user_id from localStorage:', user_id);
    if (user_id) {
      fetchUserBookings(user_id);
    } else {
      setError("User not found.");
    }
  }, []);

  // Fetch booking data for the authenticated user
  const fetchUserBookings = async (user_id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/user/${user_id}/bookings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching bookings");
      }

      const data = await response.json();
      setBookings(data.bookings); // Set bookings
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Unable to fetch booking data");
    }
  };

  return (
    <>
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #a82d2d, #000000)',
        color: '#fff',
        width: '100vw',
        overflowX: 'hidden',
        paddingTop: '5rem',
        fontFamily: 'var(--font-family)',
      }}>
        <Stack alignItems="center">
          <Typography variant="h4" sx={{ fontFamily: 'Proelium', color: '#ffffff', mb: 2 }}>
            Your Booking History
          </Typography>
        </Stack>
        <Container sx={{ marginBottom: '10' }} maxWidth="md">
          {error ? (
            <Typography variant="h6" sx={{ color: '#ff0000', textAlign: 'center', mb: 2 }}>
              {error}
            </Typography>
          ) : (
            <Grid container spacing={4} sx={{ fontFamily: 'Proelium', mt: 4 }}>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <Grid item xs={12} sm={6} md={4} key={booking.booking_id}>
                    <Card sx={{ fontFamily: 'Proelium', backgroundColor: '#333', color: '#ffffff' }}>
                      <CardContent>
                        {/* Display booking information */}
                        <Typography variant="h6" sx={{ fontFamily: 'Proelium', mb: 1 }}>
                          Movie ID: {booking.movie_id}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>Booking ID: {booking.booking_id}</Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>Seats: {booking.seat_amount}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: '#ffffff', textAlign: 'center', mt: 2 }}>
                  No bookings found.
                </Typography>
              )}
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
}
