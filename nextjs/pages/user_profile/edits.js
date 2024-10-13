import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, Paper, MenuItem } from "@mui/material";
import { useRouter } from "next/router";
import useBearStore from "@/store/useBearStore";

const EditProfile = () => {
  const router = useRouter();

  // Zustand store to store and update user details
  const email = useBearStore((state) => state.email);
  const gender = useBearStore((state) => state.gender);
  const phoneNumber = useBearStore((state) => state.phoneNumber);

  const setEmail = useBearStore((state) => state.setEmail);
  const setGender = useBearStore((state) => state.setGender);
  const setPhoneNumber = useBearStore((state) => state.setPhoneNumber);

  // Form states
  const [newEmail, setNewEmail] = useState(email || "");
  const [newGender, setNewGender] = useState(gender || "");
  const [newPhoneNumber, setNewPhoneNumber] = useState(phoneNumber || "");

  useEffect(() => {
    // Initialize form values from Zustand state
    setNewEmail(email);
    setNewGender(gender);
    setNewPhoneNumber(phoneNumber);
  }, [email, gender, phoneNumber]);

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/user/update?user_id=${localStorage.getItem('user_id')}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          email: newEmail,
          gender: newGender,
          phone_number: newPhoneNumber,
        }),
      });
      console.log(response);
      if (response.ok) {
        const updatedData = await response.json();
        console.log("User data updated successfully:", updatedData);

        // Update Zustand store with new data
        setEmail(newEmail);
        setGender(newGender);
        setPhoneNumber(newPhoneNumber);

        // Redirect back to the profile page
        router.push("/profile");
      } else {
        console.error('Failed to update user data');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundImage: 'url(/your-background-image.jpg)', // Optional: Set a custom background image or gradient if needed
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          padding: '30px', 
          width: '100%', 
          maxWidth: '500px', 
          textAlign: 'center', 
          borderRadius: '12px',
          fontFamily: 'Proelium, sans-serif',
          backgroundColor: '#fff',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px', fontFamily: 'Proelium, sans-serif' }}>
          Edit Profile
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            sx={{ fontFamily: 'Proelium, sans-serif' }}
          />
          <TextField
            fullWidth
            select
            label="Gender"
            variant="outlined"
            margin="normal"
            value={newGender}
            onChange={(e) => setNewGender(e.target.value)}
            sx={{ fontFamily: 'Proelium, sans-serif' }}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Phone Number"
            variant="outlined"
            margin="normal"
            value={newPhoneNumber}
            onChange={(e) => setNewPhoneNumber(e.target.value)}
            sx={{ fontFamily: 'Proelium, sans-serif' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
            sx={{ 
              marginTop: '20px', 
              width: '100%', 
              fontFamily: 'Proelium, sans-serif', 
              backgroundColor: '#007BFF', 
              '&:hover': { backgroundColor: '#0056b3' },
            }}
          >
            Save Changes
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => router.push("/profile")}
            sx={{ 
              marginTop: '10px', 
              width: '100%', 
              fontFamily: 'Proelium, sans-serif', 
            }}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditProfile;