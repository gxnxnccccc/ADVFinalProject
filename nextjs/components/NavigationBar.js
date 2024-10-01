import * as React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import PersonIcon from "@mui/icons-material/Person";
import { create } from "zustand";

const useBearStore = create((set) => ({
  appName: "MOVIEPOP",
  setAppName: (name) => set(() => ({ appName: name })),
  isAdmin: false,
  setIsAdmin: (isAdmin) => set(() => ({ isAdmin })),
}));

const NavigationLayout = ({ children }) => {
  const router = useRouter();
  const appName = useBearStore((state) => state.appName);
  const isAdmin = useBearStore((state) => state.isAdmin);

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

          <NavigationLink href="/main" label="MAIN" font='Proelium' />
          <NavigationLink href="/movies" label="MOVIES" font='Proelium' />
          <NavigationLink href="/showtimes" label="SHOWTIMES" font='Proelium' />
          {isAdmin && <NavigationLink href="/dashboard" label="DASHBOARD" font='Proelium' />}
          
          <Box sx={{ flexGrow: 1 }} />

          <Button
            color="#ffffff"
            onClick={() => {
              router.push("/page2");
            }}>
            <PersonIcon />
          </Button>
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
