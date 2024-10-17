import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, Card, CardContent, CardMedia, Stack, Container } from '@mui/material';

export default function DashboardUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from the database
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching users");
      }

      const data = await response.json();
      const userList = data.users;

      // Fetch booking data for each user
      const usersWithBookings = await Promise.all(userList.map(async (user) => {
        const bookings = await fetchUserBookings(user.user_id);
        return { ...user, bookings };
      }));

      setUsers(usersWithBookings); // Set users with their associated bookings
    } catch (error) {
      console.error("Error fetching users or bookings:", error);
      setError("Unable to fetch users or bookings");
    }
  };

  // Fetch booking data for a specific user
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
      return data.bookings;
    } catch (error) {
      console.error(`Error fetching bookings for user ${user_id}:`, error);
      return [];
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
            Booking History
          </Typography>
        </Stack>
        <Container sx={{ marginBottom: '10' }} maxWidth="md">
          {error ? (
            <Typography variant="h6" sx={{ color: '#ff0000', textAlign: 'center', mb: 2 }}>
              {error}
            </Typography>
          ) : (
            <Grid container spacing={4} sx={{ fontFamily: 'Proelium', mt: 4 }}>
              {users.length > 0 ? (
                users.map((user) => (
                  <Grid item xs={12} sm={6} md={4} key={user.user_id}>
                    <Card sx={{ fontFamily: 'Proelium', backgroundColor: '#333', color: '#ffffff' }}>
                      <CardMedia
                        component="img"
                        style={{ width: '100%', height: 'auto' }}
                        image="/images/user-profile-icon.jpg" // Use the relative path
                        alt={user.username}
                      />
                      <CardContent>
                        <Typography variant="h6" sx={{ fontFamily: 'Proelium', mb: 1 }}>{user.username}</Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>ID: {user.user_id}</Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>E-Mail: {user.email}</Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>Gender: {user.gender}</Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>Age: {user.age}</Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>Phone Number: {user.phone_number}</Typography>

                        {/* Display booking information */}
                        <Typography variant="h6" sx={{ fontFamily: 'Proelium', mt: 2, mb: 1 }}>
                          Bookings:
                        </Typography>
                        {user.bookings.length > 0 ? (
                          user.bookings.map((booking) => (
                            <Typography key={booking.booking_id} variant="body2" sx={{ mb: 1 }}>
                              Movie ID: {booking.movie_id}, Seats: {booking.seat_amount}
                            </Typography>
                          ))
                        ) : (
                          <Typography variant="body2" sx={{ mb: 1 }}>No bookings found for this user.</Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: '#ffffff', textAlign: 'center', mt: 2 }}>
                  No users found.
                </Typography>
              )}
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
}
