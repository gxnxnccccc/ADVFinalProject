import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';

const BookingPage = () => {
  const router = useRouter();
  const { title } = router.query;
  const [seats, setSeats] = useState(1);

  const handleBooking = () => {
    alert(`You have successfully booked ${seats} seat(s) for ${title}!`);
    router.push('/');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw', // Full viewport width
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
      {/* Add decorative circles using CSS animation */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '300px',
          height: '300px',
          backgroundColor: '#ffffff1a',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-15%',
          left: '-15%',
          width: '350px',
          height: '350px',
          backgroundColor: '#ffffff1a',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite reverse',
        }}
      />

      <Container
        maxWidth="sm" // Keep the box size small and readable
        sx={{
          display: 'flex',
          justifyContent: 'center',
          zIndex: 1,
          padding: '0 2rem',
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: '3rem',
            borderRadius: '1.5rem',
            backgroundColor: '#fff',
            width: '100%',
          }}
        >
          {/* Typography for Title with simple fade-in animation */}
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'Proelium',
              marginBottom: '1.5rem',
              textAlign: 'center',
              opacity: 0,
              animation: 'fadeIn 1s forwards',
            }}
          >
            Book Tickets for {title}
          </Typography>

          {/* Form for selecting number of seats */}
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
              sx={{
                width: '100%',
                backgroundColor: '#fff',
                borderRadius: '5px',
                animation: 'slideIn 1s ease-out',
              }}
            />

            <Button
              variant="contained"
              sx={{
                backgroundColor: '#000000',
                color: '#ffffff',
                padding: '1rem 2rem',
                borderRadius: '2rem',
                fontFamily: 'Proelium',
                textTransform: 'uppercase',
                letterSpacing: '0.1rem',
                '&:hover': {
                  backgroundColor: '#333333',
                },
                animation: 'slideIn 1s ease-out 0.5s',
                animationFillMode: 'forwards',
              }}
              onClick={handleBooking}
              fullWidth
            >
              Confirm Booking
            </Button>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: '#000000',
              textAlign: 'center',
              fontFamily: 'Proelium',
              opacity: 0,
              animation: 'fadeIn 1.5s forwards 1s',
            }}
          >
            We hope you enjoy your movie experience!
          </Typography>
        </Paper>
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
          marginTop: '4rem',
          position: 'absolute',
          bottom: 0, // Fix the footer to the bottom
        }}
      >
        <Typography variant="body2" sx={{ fontFamily: 'Proelium' }}>
          © 2024 Movie Ticket Booking. All rights reserved.
        </Typography>
      </Box>

      {/* CSS Keyframes for animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(-100px);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </Box>
  );
};

export default BookingPage;
