import React from "react";
import { Box, Typography, Button, Avatar } from "@mui/material";
import { useRouter } from "next/router";
import useBearStore from "@/store/useBearStore";

const UserProfile = () => {
  const router = useRouter();
  const username = useBearStore((state) => state.username);
  const email = useBearStore((state) => state.email);
  const gender = useBearStore((state) => state.gender);
  const phoneNumber = useBearStore((state) => state.phoneNumber);

  const handleSignOut = () => {
    router.push("/");
    // Add logic to remove the session here
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