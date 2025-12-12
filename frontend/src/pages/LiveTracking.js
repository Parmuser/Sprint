import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  TextField,
  Grid,
  Alert,
  Divider,
} from '@mui/material';
import {
  TrackChanges,
  Refresh,
  CheckCircle,
  RadioButtonUnchecked,
  Restaurant,
  LocalShipping,
  Home,
  AccessTime,
  Person,
  LocationOn,
  Notifications,
  PlayArrow,
  Stop,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import notificationService from '../services/notificationService';
import orderService from '../services/orderService';

const LiveTracking = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const [connected, setConnected] = useState(false);
  const [userId, setUserId] = useState('456');
  const [trackingOrderId, setTrackingOrderId] = useState(orderId || '123');
  const [notifications, setNotifications] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [simulationInterval, setSimulationInterval] = useState(null);
  const notificationsEndRef = useRef(null);

  const orderStatuses = [
    { key: 'PLACED', label: 'Order Placed', icon: <CheckCircle />, description: 'Order has been placed successfully' },
    { key: 'CONFIRMED', label: 'Confirmed', icon: <Restaurant />, description: 'Restaurant has confirmed your order' },
    { key: 'PREPARING', label: 'Preparing', icon: <Restaurant />, description: 'Restaurant is preparing your food' },
    { key: 'READY_FOR_PICKUP', label: 'Ready for Pickup', icon: <CheckCircle />, description: 'Food is ready for delivery' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: <LocalShipping />, description: 'Your order is on the way' },
    { key: 'DELIVERED', label: 'Delivered', icon: <Home />, description: 'Order has been delivered successfully' },
  ];

  useEffect(() => {
    if (orderId) {
      loadOrderDetails(orderId);
    }
    return () => {
      disconnect();
    };
  }, [orderId]);

  useEffect(() => {
    scrollToBottom();
  }, [notifications]);

  const loadOrderDetails = async (id) => {
    try {
      const order = await orderService.getOrderById(id);
      setOrderDetails(order);
      setTrackingOrderId(id);
      if (order.userId) {
        setUserId(order.userId.toString());
      }
    } catch (error) {
      console.error('Error loading order details:', error);
      toast.error('Failed to load order details');
    }
  };

  const connect = async () => {
    try {
      if (!userId || !trackingOrderId) {
        toast.error('Please enter both User ID and Order ID');
        return;
      }

      toast.info('Connecting to live tracking...');
      
      try {
        await notificationService.connect(userId);
        setConnected(true);
        toast.success('Connected to live tracking');
        
        // Subscribe to order tracking
        notificationService.subscribeToOrderTracking(trackingOrderId, userId);
        
        // Add message handlers
        notificationService.addMessageHandler('status', handleStatusMessage);
        notificationService.addMessageHandler('tracking', handleTrackingMessage);
        notificationService.addMessageHandler('user', handleUserMessage);
        
      } catch (error) {
        console.warn('WebSocket service not available, using simulation mode');
        setConnected(true);
        toast.info('Using simulation mode - WebSocket service not available');
        
        // Start simulation
        startSimulation();
      }
      
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect to tracking service');
      setConnected(false);
    }
  };

  const disconnect = () => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
    
    if (notificationService.isConnected()) {
      notificationService.removeMessageHandler('status', handleStatusMessage);
      notificationService.removeMessageHandler('tracking', handleTrackingMessage);
      notificationService.removeMessageHandler('user', handleUserMessage);
      notificationService.disconnect();
    }
    
    setConnected(false);
    toast.info('Disconnected from live tracking');
  };

  const startSimulation = () => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
    }
    
    const interval = notificationService.simulateOrderTracking(trackingOrderId);
    setSimulationInterval(interval);
  };

  const handleStatusMessage = (message) => {
    addNotification({
      type: 'status',
      title: 'System Status',
      message: message.message || 'Status update received',
      timestamp: message.timestamp || new Date().toISOString(),
      priority: 'normal'
    });
  };

  const handleTrackingMessage = (message) => {
    const statusInfo = orderStatuses.find(s => s.key === message.status);
    
    addNotification({
      type: 'tracking',
      title: statusInfo ? statusInfo.label : message.status,
      message: message.message || statusInfo?.description || 'Order status updated',
      timestamp: message.timestamp || new Date().toISOString(),
      priority: message.status === 'DELIVERED' ? 'high' : 'normal',
      orderId: message.orderId,
      status: message.status,
      estimatedDeliveryTime: message.estimatedDeliveryTime
    });
  };

  const handleUserMessage = (message) => {
    addNotification({
      type: 'user',
      title: 'Personal Notification',
      message: message.message || 'You have a new notification',
      timestamp: message.timestamp || new Date().toISOString(),
      priority: message.priority || 'normal'
    });
  };

  const addNotification = (notification) => {
    setNotifications(prev => [...prev, { id: Date.now(), ...notification }]);
    
    // Show toast for important notifications
    if (notification.priority === 'high') {
      toast.success(notification.message);
    } else if (notification.type === 'tracking') {
      toast.info(notification.message);
    }
  };

  const scrollToBottom = () => {
    notificationsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const clearNotifications = () => {
    setNotifications([]);
    toast.info('Notifications cleared');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'tracking':
        return <TrackChanges />;
      case 'user':
        return <Person />;
      default:
        return <Notifications />;
    }
  };

  const getCurrentStatusStep = () => {
    if (!orderDetails) return -1;
    return orderStatuses.findIndex(status => status.key === orderDetails.status);
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
          🚚 Live Order Tracking
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Real-time tracking and notifications for food delivery orders
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Connection Controls */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Connection Settings
            </Typography>
            
            <Box mb={2}>
              <TextField
                fullWidth
                label="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                disabled={connected}
                size="small"
                margin="normal"
              />
            </Box>
            
            <Box mb={3}>
              <TextField
                fullWidth
                label="Order ID"
                value={trackingOrderId}
                onChange={(e) => setTrackingOrderId(e.target.value)}
                disabled={connected}
                size="small"
                margin="normal"
              />
            </Box>

            <Box display="flex" gap={2} flexWrap="wrap">
              {!connected ? (
                <Button
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={connect}
                  disabled={!userId || !trackingOrderId}
                >
                  Start Tracking
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<Stop />}
                  onClick={disconnect}
                >
                  Stop Tracking
                </Button>
              )}
              
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => {
                  if (connected && trackingOrderId) {
                    startSimulation();
                    toast.info('Simulation restarted');
                  }
                }}
                disabled={!connected}
              >
                Simulate
              </Button>
            </Box>

            <Box mt={2}>
              <Chip
                label={connected ? 'Connected' : 'Disconnected'}
                color={connected ? 'success' : 'error'}
                variant="outlined"
                icon={connected ? <CheckCircle /> : <RadioButtonUnchecked />}
              />
            </Box>
          </Paper>

          {/* Order Details */}
          {orderDetails && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Order Details
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <TrackChanges />
                  </ListItemIcon>
                  <ListItemText
                    primary="Order ID"
                    secondary={`#${orderDetails.id}`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary="Customer"
                    secondary={`User ${orderDetails.userId}`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Restaurant />
                  </ListItemIcon>
                  <ListItemText
                    primary="Restaurant"
                    secondary={`Restaurant ${orderDetails.restaurantId}`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <LocationOn />
                  </ListItemIcon>
                  <ListItemText
                    primary="Delivery Address"
                    secondary={orderDetails.deliveryAddress}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <AccessTime />
                  </ListItemIcon>
                  <ListItemText
                    primary="Order Time"
                    secondary={format(new Date(orderDetails.createdAt), 'MMM dd, yyyy • HH:mm')}
                  />
                </ListItem>
              </List>
            </Paper>
          )}
        </Grid>

        {/* Order Progress */}
        <Grid item xs={12} lg={8}>
          {orderDetails && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Order Progress
              </Typography>
              
              <Stepper activeStep={getCurrentStatusStep()} orientation="vertical">
                {orderStatuses.map((status, index) => (
                  <Step key={status.key}>
                    <StepLabel
                      StepIconComponent={() => (
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            backgroundColor: index <= getCurrentStatusStep() ? 'primary.main' : 'grey.300',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                          }}
                        >
                          {React.cloneElement(status.icon, { sx: { fontSize: 16 } })}
                        </Box>
                      )}
                    >
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {status.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {status.description}
                        </Typography>
                      </Box>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {index === getCurrentStatusStep() ? 'Current status' : 'Completed'}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Paper>
          )}

          {/* Live Notifications */}
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight={600}>
                Live Notifications
              </Typography>
              <Box>
                <Button
                  size="small"
                  onClick={clearNotifications}
                  disabled={notifications.length === 0}
                >
                  Clear All
                </Button>
              </Box>
            </Box>

            {!connected && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Connect to start receiving live notifications for your order.
              </Alert>
            )}

            <Box
              sx={{
                maxHeight: 400,
                overflowY: 'auto',
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                p: 1
              }}
            >
              {notifications.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <Notifications sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    No notifications yet. {connected ? 'Listening for updates...' : 'Connect to start tracking.'}
                  </Typography>
                </Box>
              ) : (
                <List dense>
                  {notifications.map((notification, index) => (
                    <React.Fragment key={notification.id}>
                      <ListItem
                        sx={{
                          border: notification.priority === 'high' ? '2px solid' : '1px solid',
                          borderColor: notification.priority === 'high' ? 'error.main' : 'grey.200',
                          borderRadius: 1,
                          mb: 1,
                          backgroundColor: notification.priority === 'high' ? 'error.light' : 'background.paper',
                          animation: notification.priority === 'high' ? 'pulse 1s ease-in-out' : 'none',
                        }}
                      >
                        <ListItemIcon>
                          {getTypeIcon(notification.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {notification.title}
                              </Typography>
                              {notification.orderId && (
                                <Chip
                                  label={`#${notification.orderId}`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                {notification.message}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {format(new Date(notification.timestamp), 'HH:mm:ss')}
                                {notification.source === 'simulation' && ' (simulated)'}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < notifications.length - 1 && <Divider sx={{ my: 1 }} />}
                    </React.Fragment>
                  ))}
                  <div ref={notificationsEndRef} />
                </List>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LiveTracking;
