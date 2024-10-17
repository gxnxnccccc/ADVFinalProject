import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Grid, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Card, CardContent, CardMedia, Stack, Container } from '@mui/material';
import DashboardNavigationBar from '../../components/DashboardNavigationBar';
import Tesseract from 'tesseract.js';
import { set } from 'date-fns';

export default function DashboardUsers() {
  const [users, setUsers] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

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
  
      // Sort users by user_id before setting the state
      const sortedUsers = data.users.sort((a, b) => a.user_id - b.user_id);
  
      setUsers(sortedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
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
          <Typography variant="h4" sx={{ fontFamily: 'Proelium', color: '#ffffff', mb: 2 }}>User Datas</Typography>
        </Stack>
        <Container sx={{ marginBottom: '10' }} maxWidth="md">
          <Grid container spacing={4} sx={{ fontFamily: 'Proelium', mt: 4 }} height={0}>
            {users.map((user) => (
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
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}