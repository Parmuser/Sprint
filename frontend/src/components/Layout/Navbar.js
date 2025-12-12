import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Restaurant,
  Person,
  ShoppingCart,
  Notifications,
  Home,
  TrackChanges,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'Users', path: '/users', icon: <Person /> },
    { label: 'Restaurants', path: '/restaurants', icon: <Restaurant /> },
    { label: 'Orders', path: '/orders', icon: <ShoppingCart /> },
    { label: 'Live Tracking', path: '/live-tracking', icon: <TrackChanges /> },
  ];

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#e23744' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ 
            flexGrow: 0, 
            mr: 4, 
            fontWeight: 700,
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          🍽️ Zomato Clone
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              startIcon={item.icon}
              onClick={() => navigate(item.path)}
              sx={{
                fontWeight: isActive(item.path) ? 600 : 400,
                backgroundColor: isActive(item.path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
                borderRadius: 2,
                px: 2,
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Notifications">
            <IconButton
              color="inherit"
              onClick={handleNotificationClick}
            >
              <Badge badgeContent={3} color="secondary">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
            onClose={handleNotificationClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleNotificationClose}>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  Order #123 Delivered
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Your order from Spice Paradise has been delivered
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleNotificationClose}>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  Order #124 Out for Delivery
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Your order from Pasta Corner is on the way
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleNotificationClose}>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  New Restaurant Added
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Sushi Master is now available in your area
                </Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
