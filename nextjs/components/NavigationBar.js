// components/NavigationLayout.js

import * as React from "react";
import { AppBar, Toolbar, Typography, Button, Box, TextField, InputAdornment, IconButton, Avatar } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import useBearStore from "@/store/useBearStore";  // Import Zustand store

const NavigationLayout = ({ children }) => {
  const router = useRouter();
  const appName = useBearStore((state) => state.appName);
  const isLoggedIn = useBearStore((state) => state.isLoggedIn);
  const isAdmin = useBearStore((state) => state.isAdmin);

  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?query=${searchQuery}`);
    }
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const handleSignInClick = () => {
    router.push("/register");
  };

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "#000000", width: '100%' }}>
        <Toolbar>
          <Link href={"/"}>
            <img src="/Logo_1.png" alt="Logo" style={{ height: '60px', cursor: 'pointer' }} />
          </Link>

          <Typography
            variant="body1"
            sx={{
              fontSize: "30px",
              fontWeight: 500,
              color: "#ffffff",
              padding: "0 10px",
              fontFamily: "Play Chickens",
            }}>
            {appName}
          </Typography>

          <NavigationLink href="/movies" label="MOVIES" font='Proelium' />
          <NavigationLink href="/favorites" label="FAVORITES" font='Proelium' />
          <NavigationLink href="/wishlists" label="WISHLISTS" font='Proelium' />
          {isAdmin && <NavigationLink href="/dashboard/dashboard_index" label="DASHBOARD" font='Proelium' />}

          <Box sx={{ flexGrow: 1 }} />

          <TextField
            variant="outlined"
            placeholder="Search…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearch}
            size="small"
            sx={{
              marginRight: '20px',
              backgroundColor: '#ffffff',
              borderRadius: '50px',
              width: '180px',
              height: '30px',
              '& .MuiOutlinedInput-root': {
                fontFamily: 'Proelium',
                height: '30px',
                borderRadius: '50px',
              },
              '& input': {
                textTransform: 'none',
                fontSize: '12px',
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Conditionally render the Profile Icon or Sign In button */}
          {!isLoggedIn ? (
            <Button color="inherit" onClick={handleSignInClick}>
              Sign In
            </Button>
          ) : (
            <IconButton color="inherit" onClick={handleProfileClick}>
              {/* Profile icon will be shown when logged in */}
              <Avatar src="/default-profile.png" alt="Profile Icon" />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <main style={{ marginTop: '64px' }}>{children}</main>
    </>
  );
};

const NavigationLink = ({ href, label, font }) => {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <Typography
        variant="body1"
        sx={{
          fontSize: "16px",
          fontWeight: 500,
          color: "#fff",
          padding: "0 10px",
          margin: "0 35px",
          fontFamily: font,
        }}>
        {label}
      </Typography>
    </Link>
  );
};

export default NavigationLayout;