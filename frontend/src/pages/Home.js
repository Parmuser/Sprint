import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Restaurant,
  Person,
  ShoppingCart,
  TrendingUp,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiService from '../services/apiService';
import userService from '../services/userService';
import restaurantService from '../services/restaurantService';
import orderService from '../services/orderService';

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    restaurants: 0,
    orders: 0,
    activeOrders: 0
  });
  const [serviceStatus, setServiceStatus] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    checkServiceHealth();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load statistics
      const [users, restaurants, orders] = await Promise.all([
        userService.getAllUsers().catch(() => []),
        restaurantService.getAllRestaurants().catch(() => []),
        orderService.getAllOrders().catch(() => [])
      ]);

      const activeOrders = orders.filter(order => 
        !['DELIVERED', 'CANCELLED'].includes(order.status)
      );

      setStats({
        users: users.length,
        restaurants: restaurants.length,
        orders: orders.length,
        activeOrders: activeOrders.length
      });

      // Get recent orders (last 5)
      const sortedOrders = orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentOrders(sortedOrders);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const checkServiceHealth = async () => {
    try {
      const healthChecks = await apiService.healthCheck();
      setServiceStatus(healthChecks);
    } catch (error) {
      console.error('Error checking service health:', error);
      // Set mock service status if health check fails
      setServiceStatus([
        { name: 'User Service', status: 'UP' },
        { name: 'Restaurant Service', status: 'DOWN' },
        { name: 'Order Service', status: 'DOWN' },
        { name: 'Notification Service', status: 'DOWN' },
      ]);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'UP':
        return <CheckCircle color="success" />;
      case 'DOWN':
        return <ErrorIcon color="error" />;
      default:
        return <Warning color="warning" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'UP':
        return 'success';
      case 'DOWN':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      case 'OUT_FOR_DELIVERY':
        return 'warning';
      case 'PREPARING':
        return 'info';
      default:
        return 'default';
    }
  };

  const quickActions = [
    {
      title: 'Add New User',
      description: 'Create a new user account',
      icon: <Person />,
      color: '#1976d2',
      action: () => navigate('/users/new')
    },
    {
      title: 'Add Restaurant',
      description: 'Register a new restaurant',
      icon: <Restaurant />,
      color: '#ed6c02',
      action: () => navigate('/restaurants/new')
    },
    {
      title: 'Create Order',
      description: 'Place a new food order',
      icon: <ShoppingCart />,
      color: '#2e7d32',
      action: () => navigate('/orders/new')
    },
    {
      title: 'View Analytics',
      description: 'Check system metrics',
      icon: <TrendingUp />,
      color: '#9c27b0',
      action: () => toast.info('Analytics feature coming soon!')
    }
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome to your Zomato Clone Admin Panel
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#e3f2fd' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {stats.users}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                </Box>
                <Person sx={{ fontSize: 40, color: '#1976d2' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#fff3e0' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={700} color="#ed6c02">
                    {stats.restaurants}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Restaurants
                  </Typography>
                </Box>
                <Restaurant sx={{ fontSize: 40, color: '#ed6c02' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#e8f5e8' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={700} color="#2e7d32">
                    {stats.orders}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
                  </Typography>
                </Box>
                <ShoppingCart sx={{ fontSize: 40, color: '#2e7d32' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#f3e5f5' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight={700} color="#9c27b0">
                    {stats.activeOrders}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Orders
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: '#9c27b0' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4
                      }
                    }}
                    onClick={action.action}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Box sx={{ color: action.color, mr: 1 }}>
                          {action.icon}
                        </Box>
                        <Typography variant="h6" fontWeight={600}>
                          {action.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {action.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Service Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Service Health
            </Typography>
            <List>
              {serviceStatus.map((service, index) => (
                <React.Fragment key={service.name}>
                  <ListItem>
                    <ListItemIcon>
                      {getStatusIcon(service.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={service.name}
                      secondary={service.error || 'Service is running normally'}
                    />
                    <Chip
                      label={service.status}
                      color={getStatusColor(service.status)}
                      size="small"
                    />
                  </ListItem>
                  {index < serviceStatus.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" fontWeight={600}>
                Recent Orders
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/orders')}
              >
                View All Orders
              </Button>
            </Box>
            {recentOrders.length > 0 ? (
              <List>
                {recentOrders.map((order, index) => (
                  <React.Fragment key={order.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1" fontWeight={600}>
                              Order #{order.id}
                            </Typography>
                            <Chip
                              label={order.status}
                              color={getOrderStatusColor(order.status)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Total: ${order.totalAmount.toFixed(2)} • {new Date(order.createdAt).toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Address: {order.deliveryAddress}
                            </Typography>
                          </Box>
                        }
                      />
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => navigate(`/orders/${order.id}/track`)}
                      >
                        Track
                      </Button>
                    </ListItem>
                    {index < recentOrders.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography variant="body1" color="text.secondary">
                  No orders found
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
