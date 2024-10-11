import React, { useEffect } from "react";
import { Box, Typography, Button, Avatar, Paper, Divider } from "@mui/material";
import { useRouter } from "next/router";
import useBearStore from "@/store/useBearStore";

const UserProfile = () => {
  const router = useRouter();

  // Zustand store to store user details
  const setUsername = useBearStore((state) => state.setUsername);
  const setEmail = useBearStore((state) => state.setEmail);
  const setGender = useBearStore((state) => state.setGender);
  const setPhoneNumber = useBearStore((state) => state.setPhoneNumber);

  const username = useBearStore((state) => state.username);
  const email = useBearStore((state) => state.email);
  const gender = useBearStore((state) => state.gender);
  const phoneNumber = useBearStore((state) => state.phoneNumber);

  // Fetch user data from API on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/user/${localStorage.getItem("username")}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("User data fetched successfully:", data);

          // Store user data in Zustand
          setUsername(data.username);
          setEmail(data.email);
          setGender(data.gender);
          setPhoneNumber(data.phone_number);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [setUsername, setEmail, setGender, setPhoneNumber]);

  const handleSignOut = async () => {
    const cookieName = `access_token_${localStorage.getItem("username")}`;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cookie_name: cookieName }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
      } else {
        const errorData = await response.json();
        console.error("Failed to logout:", errorData);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("username");
    useBearStore.getState().setIsLoggedIn(false);

    router.push("/");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account?")) {
      // Call API to delete account
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
          maxWidth: '600px', 
          textAlign: 'center', 
          borderRadius: '12px',
          fontFamily: 'Proelium, sans-serif',
          backgroundColor: '#fff',  // Keep the white background for the info box
        }}
      >
        <Avatar
          src="/default-profile.png"
          alt="Profile Picture"
          sx={{
            width: 150,
            height: 150,
            margin: "auto",
            marginBottom: '20px',
            boxShadow: 3,
          }}
        />
        <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '10px', color: '#333', fontFamily: 'Proelium, sans-serif' }}>
          {username}
        </Typography>
        <Divider sx={{ margin: '10px 0' }} />
        <Typography variant="body1" sx={{ marginBottom: '8px', fontFamily: 'Proelium, sans-serif' }}>Email: {email}</Typography>
        <Typography variant="body1" sx={{ marginBottom: '8px', fontFamily: 'Proelium, sans-serif' }}>Gender: {gender}</Typography>
        <Typography variant="body1" sx={{ marginBottom: '8px', fontFamily: 'Proelium, sans-serif' }}>Phone Number: {phoneNumber}</Typography>
        <Divider sx={{ margin: '20px 0' }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/user_profile/edits")}
            sx={{ 
              fontFamily: 'Proelium, sans-serif', 
              backgroundColor: '#007BFF', 
              '&:hover': { backgroundColor: '#0056b3' },
              width: '100%', 
              maxWidth: '180px',
            }}
          >
            EDIT PROFILE
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteAccount}
            sx={{ 
              fontFamily: 'Proelium, sans-serif', 
              width: '100%', 
              maxWidth: '180px',
            }}
          >
            DELETE ACCOUNT
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSignOut}
            sx={{ 
              fontFamily: 'Proelium, sans-serif', 
              backgroundColor: '#DC3545', 
              '&:hover': { backgroundColor: '#b02a37' },
              width: '100%', 
              maxWidth: '180px',
            }}
          >
            SIGN OUT
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default UserProfile;