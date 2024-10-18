import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, CardMedia, Box } from '@mui/material';
import { useRouter } from 'next/router';

const BookingHistoryPage = () => {
  const [allBookingHistory, setBookingHistorys] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchBookingHistory(); // Fetch booking
  }, []);

  const fetchBookingHistory = async () => {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
      console.error("User ID not found. Make sure the user is logged in.");
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
        throw new Error("Error fetching Booking History");
      }

      const data = await response.json();
      setBookingHistorys(data.booking);
    } catch (error) {
      console.error("Error fetching booking history:", error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',  // Ensure the content takes up the full height
        background: 'linear-gradient(180deg, #a82d2d, #000000)',
        color: '#fff',
        width: '100vw',
        overflowX: 'hidden',
        fontFamily: 'var(--font-family)',
      }}
    >
      {/* Main Content Section */}
      <Container sx={{ flex: '1', marginTop: '5rem', marginBottom: '4rem', width: '100%' }} maxWidth="lg">
        <Typography variant="h4" sx={{ paddingTop: '2rem', fontFamily: 'Proelium', marginBottom: '2rem', textAlign: 'center' }}>
          Booking History
        </Typography>

        {/* Horizontal Scroll Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            paddingBottom: '2rem',
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
          {allBookingHistory.map((movie, index) => (
            <Box key={index} sx={{ flex: '0 0 auto', paddingRight: '1rem', width: '300px' }}>
              <Card>
                <CardMedia
                  component="img"
                  height="350"
                  image={`data:image/jpg;base64,${movie.image_base64}`}
                  alt={movie.title}
                />
                <CardContent>
                  {/* Title and Booking Info */}
                  <Typography variant="h6" sx={{ fontFamily: 'Proelium' }}>{movie.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Proelium' }}>
                    Release Date: {movie.release_date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Proelium' }}>
                    Booking Seat Amount: {movie.seat_amount}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Footer Section */}
      <Box
        sx={{
          background: '#000000',
          color: '#fff',
          padding: 2,
          textAlign: 'center',
          width: '100%',
          fontFamily: 'Proelium',
          marginTop: 'auto',  // Push the footer to the bottom if content is smaller than the viewport
        }}
      >
        <Typography variant="body2" sx={{ fontFamily: 'Proelium' }}>
          © 2024 Movie Ticket Booking. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default BookingHistoryPage;
