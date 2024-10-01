import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

const NAVIGATION = [
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'movies',
    title: 'Movies',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
  },
];

// Custom theme with your color scheme
const demoTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#a82d2d',
    },
    background: {
      default: '#000000',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Anton, Oswald, sans-serif',
  },
});

const drawerWidth = 240;

// Dashboard content for different sections (Dashboard, Movies, Reports)
function DashboardContent({ currentSection }) {
  const [movies, setMovies] = useState([
    { id: 1, title: 'Movie 1', genre: 'Action' },
    { id: 2, title: 'Movie 2', genre: 'Drama' },
    { id: 3, title: 'Movie 3', genre: 'Comedy' },
  ]);

  if (currentSection === 'movies') {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ color: '#ffffff' }}>Movies List</Typography>
        <ul>
          {movies.map((movie) => (
            <li key={movie.id} style={{ color: '#ffffff' }}>
              {movie.title} - {movie.genre}
            </li>
          ))}
        </ul>
      </Box>
    );
  }

  if (currentSection === 'reports') {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ color: '#ffffff' }}>Reports</Typography>
        <Typography sx={{ color: '#ffffff' }}>
          This is the reports section. More data to come here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ color: '#ffffff' }}>Welcome to the Admin Dashboard</Typography>
      <Typography sx={{ color: '#ffffff' }}>
        Use the navigation on the left to explore different sections of the dashboard.
      </Typography>
    </Box>
  );
}

DashboardContent.propTypes = {
  currentSection: PropTypes.string.isRequired,
};

export default function DashboardLayoutNoMiniSidebar() {
  const [currentSection, setCurrentSection] = useState('dashboard'); // Default to dashboard
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {NAVIGATION.map((navItem) => (
          <ListItem
            button
            key={navItem.title}
            onClick={() => setCurrentSection(navItem.segment)}
          >
            <ListItemIcon>{navItem.icon}</ListItemIcon>
            <ListItemText primary={navItem.title} sx={{ color: '#ffffff' }} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={demoTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: '#a82d2d',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Admin Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: '#1e1e1e',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
        >
          <Toolbar />
          <DashboardContent currentSection={currentSection} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
