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
          const response = await fetch(`http://127.0.0.1:8000/api/user/${localStorage.getItem("username")}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Use the JWT token
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

  const handleSignOut = async () => {
    const cookieName = `access_token_${localStorage.getItem("username")}`;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cookie_name: cookieName }),  // ส่งชื่อคุกกี้
        credentials: 'include',  // ส่งคุกกี้ไปยังเซิร์ฟเวอร์
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);  // แสดงข้อความการล็อกเอาต์
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

    router.push("/");  // Redirect to the home page after logging out
    setTimeout(() => {
      window.location.reload();
    }, 500);  // 1000 ms = 1 second

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