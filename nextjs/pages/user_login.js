import React, { useEffect } from "react";
import { Box, Typography, Button, Avatar } from "@mui/material";
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
        const response = await fetch('http://127.0.0.1:8000/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,  // JWT token from localStorage
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("User data fetched successfully:", data);  // Debugging log

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
  }, [setUsername, setEmail, setGender, setPhoneNumber]);  // Run only once when the component mounts

  // Logging Zustand values for debugging
  useEffect(() => {
    console.log("Username in Zustand:", username);
    console.log("Email in Zustand:", email);
    console.log("Gender in Zustand:", gender);
    console.log("Phone number in Zustand:", phoneNumber);
  }, [username, email, gender, phoneNumber]);

  const handleSignOut = () => {
    localStorage.removeItem('token');  // Remove the JWT token or any session information
    useBearStore.setState({
      isLoggedIn: false,
      username: null,
      email: null,
      gender: null,
      phoneNumber: null,
    });  // Reset Zustand state for user details
    router.push("/");  // Redirect to the home page after logging out
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account?")) {
      // Call API to delete account
    }
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h3" align="center">
        PROFILE
      </Typography>
      <Avatar src="/default-profile.png" alt="Profile Picture" sx={{ width: 100, height: 100, margin: "auto" }} />
      <Typography variant="h6">Username: {username}</Typography>
      <Typography>Email: {email}</Typography>
      <Typography>Gender: {gender}</Typography>
      <Typography>Phone Number: {phoneNumber}</Typography>
      <Box sx={{ marginTop: '20px' }}>
        <Button onClick={() => router.push("/user_profile/edit")}>EDIT PROFILE</Button>
        <Button onClick={handleDeleteAccount}>DELETE ACCOUNT</Button>
        <Button onClick={handleSignOut}>SIGN OUT</Button>
      </Box>
    </Box>
  );
};

export default UserProfile;