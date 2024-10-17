import * as React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';
import PersonIcon from '@mui/icons-material/Person';
import Link from 'next/link';

const DashboardNavigationBar = () => {
  const router = useRouter();  // Hook from Next.js to programmatically navigate

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "#000000", width: '100%' }}> {/* Changed background to #000000 */}
        <Toolbar>
          {/* Admin Dashboard Title */}
          <Link href="/dashboard/dashboard_index" passHref>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                color: "#ffffff",     // White color 
                padding: "0 15px",
                fontFamily: "Proelium", // Apply Proelium font
                cursor: "pointer",
                textDecoration: "none",  // No underline
                '&:hover': {
                  color: "#f1c40f",   // Yellow text on hover
                },
              }}
            >
              Admin Dashboard
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1 }} />

          {/* Links to Movies */}
          <Link href="/dashboard/dashboard_movies" passHref>
            <Typography
              variant="body1"
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#ffffff",    // White color
                padding: "8px 16px",
                fontFamily: "Proelium", // Apply Proelium font
                cursor: "pointer",
                textDecoration: "none", // No underline
                marginRight: "20px",
                '&:hover': {
                  color: "#f1c40f",   // Yellow text on hover
                },
              }}
            >
              Movies
            </Typography>
          </Link>

          {/* Links to Users */}
          <Link href="/dashboard/dashboard_users" passHref>
            <Typography
              variant="body1"
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#ffffff",    // White color
                padding: "8px 16px",
                fontFamily: "Proelium", // Apply Proelium font
                cursor: "pointer",
                textDecoration: "none", // No underline
                marginRight: "20px",
                '&:hover': {
                  color: "#f1c40f",   // Yellow text on hover
                },
              }}
            >
              Users
            </Typography>
          </Link>

          {/* 'Back to Main' Navigation Link */}
          <Link href="/" passHref>
            <Typography
              variant="body1"
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#ffffff",    // White color
                padding: "8px 16px",
                border: "2px solid #ffffff",  // Border color changed to white
                borderRadius: "5px",           // Rounded corners
                fontFamily: "Proelium", // Apply Proelium font
                cursor: "pointer",
                textDecoration: "none",        // No underline
                marginRight: "20px",
                '&:hover': {
                  color: "#f1c40f",   // Yellow text on hover, border remains white
                },
              }}
            >
              Back to Main
            </Typography>
          </Link>

          {/* Logout Button */}
          <PersonIcon
            sx={{ cursor: "pointer", color: "#ffffff" }}
            onClick={() => router.push("/login")}
          />
        </Toolbar>
      </AppBar>

      {/* Space to prevent content overlap */}
      <Box sx={{ marginTop: '64px' }} />
    </>
  );
};

export default DashboardNavigationBar;
