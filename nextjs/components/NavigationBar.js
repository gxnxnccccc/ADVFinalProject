import * as React from "react";
import { AppBar, Toolbar, Typography, Button, Box, TextField, InputAdornment, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import { create } from "zustand";

const useBearStore = create((set) => ({
  appName: "MOVIEPOP",
  setAppName: (name) => set(() => ({ appName: name })),
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn) => set(() => ({ isLoggedIn })),
  isAdmin: false,
  setIsAdmin: (isAdmin) => set(() => ({ isAdmin })),
}));

const NavigationLayout = ({ children }) => {
  const router = useRouter();
  const appName = useBearStore((state) => state.appName);
  const isLoggedIn = useBearStore((state) => state.isLoggedIn);
  const isAdmin = useBearStore((state) => state.isAdmin);

  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      router.push(`/search?query=${searchQuery}`);
    }
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      router.push("/user_profile");  // Go to profile page if logged in
    } else {
      router.push("/register");  // Go to register/login page if not logged in
    }
  };

  const handleSignInClick = () => {
    router.push("/register");  // Navigate to register/login page
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

          {!isLoggedIn ? (
            <Button color="inherit" onClick={handleSignInClick}>
              Sign In
            </Button>
          ) : (
            <IconButton color="inherit" onClick={handleProfileClick}>
              <PersonIcon />
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