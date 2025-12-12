import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Chip,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  Refresh,
  Visibility,
  TrackChanges,
  ShoppingCart,
  Restaurant,
  Person,
  LocationOn,
  AccessTime,
  AttachMoney,
  ExpandMore,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import orderService, { OrderStatus } from '../../services/orderService';
import userService from '../../services/userService';
import restaurantService from '../../services/restaurantService';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [detailsDialog, setDetailsDialog] = useState({ open: false, order: null });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, usersData, restaurantsData] = await Promise.all([
        orderService.getAllOrders().catch(() => []),
        userService.getAllUsers().catch(() => []),
        restaurantService.getAllRestaurants().catch(() => [])
      ]);

      setOrders(ordersData);
      setUsers(usersData);
      setRestaurants(restaurantsData);
      
      toast.success(`Loaded ${ordersData.length} orders`);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load orders data');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(order =>
        order.id.toString().includes(searchQuery) ||
        order.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getUserName(order.userId).toLowerCase().includes(searchQuery.toLowerCase()) ||
        getRestaurantName(order.restaurantId).toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredOrders(filtered);
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : `User ${userId}`;
  };

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    return restaurant ? restaurant.name : `Restaurant ${restaurantId}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      [OrderStatus.PLACED]: 'default',
      [OrderStatus.CONFIRMED]: 'info',
      [OrderStatus.PREPARING]: 'warning',
      [OrderStatus.READY_FOR_PICKUP]: 'secondary',
      [OrderStatus.OUT_FOR_DELIVERY]: 'primary',
      [OrderStatus.DELIVERED]: 'success',
      [OrderStatus.CANCELLED]: 'error',
    };
    return colors[status] || 'default';
  };

  const handleViewDetails = (order) => {
    setDetailsDialog({ open: true, order });
  };

  const handleCloseDetails = () => {
    setDetailsDialog({ open: false, order: null });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
  };

  const getOrderTotal = (order) => {
    return (parseFloat(order.totalAmount) + parseFloat(order.deliveryFee || 0) + parseFloat(order.taxAmount || 0)).toFixed(2);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <div className="loading-spinner" />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
            Order Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage food orders
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/orders/new')}
          sx={{ height: 'fit-content' }}
        >
          Create New Order
        </Button>
      </Box>

      {/* Search and Filters */}
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search orders by ID, address, user, or restaurant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Filter by Status"
              >
                <MenuItem value="">All Statuses</MenuItem>
                {Object.values(OrderStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.replace('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={clearFilters}
                disabled={!searchQuery && !statusFilter}
              >
                Clear Filters
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadData}
              >
                Refresh
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Statistics */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <Chip
          icon={<ShoppingCart />}
          label={`Total Orders: ${orders.length}`}
          color="primary"
          variant="outlined"
        />
        <Chip
          icon={<Search />}
          label={`Filtered: ${filteredOrders.length}`}
          color="secondary"
          variant="outlined"
        />
        <Chip
          label={`Active: ${orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status)).length}`}
          color="warning"
          variant="outlined"
        />
        <Chip
          label={`Delivered: ${orders.filter(o => o.status === 'DELIVERED').length}`}
          color="success"
          variant="outlined"
        />
      </Box>

      {/* Orders List */}
      <Grid container spacing={2}>
        {filteredOrders.map((order) => (
          <Grid item xs={12} key={order.id}>
            <Card
              sx={{
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: 3,
                },
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Order #{order.id}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Chip
                        label={order.status.replace('_', ' ')}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(order.createdAt), 'MMM dd, yyyy • HH:mm')}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" gap={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleViewDetails(order)}
                    >
                      Details
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<TrackChanges />}
                      onClick={() => navigate(`/orders/${order.id}/track`)}
                    >
                      Track
                    </Button>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Customer
                        </Typography>
                        <Typography variant="body2">
                          {getUserName(order.userId)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Restaurant sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Restaurant
                        </Typography>
                        <Typography variant="body2">
                          {getRestaurantName(order.restaurantId)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AttachMoney sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Total Amount
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          ${getOrderTotal(order)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {order.actualDeliveryTime ? 'Delivered' : 'Estimated Delivery'}
                        </Typography>
                        <Typography variant="body2">
                          {order.actualDeliveryTime 
                            ? format(new Date(order.actualDeliveryTime), 'HH:mm')
                            : order.estimatedDeliveryTime 
                              ? format(new Date(order.estimatedDeliveryTime), 'HH:mm')
                              : 'TBD'
                          }
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" alignItems="start" gap={1}>
                      <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mt: 0.5 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Delivery Address
                        </Typography>
                        <Typography variant="body2">
                          {order.deliveryAddress}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {order.specialInstructions && (
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">
                        Special Instructions
                      </Typography>
                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        "{order.specialInstructions}"
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* No Orders Message */}
      {filteredOrders.length === 0 && !loading && (
        <Box textAlign="center" py={6}>
          <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No orders found
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            {searchQuery || statusFilter 
              ? 'No orders match your search criteria.' 
              : 'Get started by creating your first order.'
            }
          </Typography>
          {!searchQuery && !statusFilter && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/orders/new')}
            >
              Create First Order
            </Button>
          )}
        </Box>
      )}

      {/* Order Details Dialog */}
      <Dialog
        open={detailsDialog.open}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Order #{detailsDialog.order?.id} Details
        </DialogTitle>
        <DialogContent>
          {detailsDialog.order && (
            <Box>
              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Customer
                  </Typography>
                  <Typography variant="body2">
                    {getUserName(detailsDialog.order.userId)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Restaurant
                  </Typography>
                  <Typography variant="body2">
                    {getRestaurantName(detailsDialog.order.restaurantId)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Status
                  </Typography>
                  <Chip
                    label={detailsDialog.order.status.replace('_', ' ')}
                    color={getStatusColor(detailsDialog.order.status)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Order Date
                  </Typography>
                  <Typography variant="body2">
                    {format(new Date(detailsDialog.order.createdAt), 'MMM dd, yyyy • HH:mm')}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="subtitle2" gutterBottom>
                Delivery Address
              </Typography>
              <Typography variant="body2" mb={2}>
                {detailsDialog.order.deliveryAddress}
              </Typography>

              {detailsDialog.order.specialInstructions && (
                <>
                  <Typography variant="subtitle2" gutterBottom>
                    Special Instructions
                  </Typography>
                  <Typography variant="body2" mb={2} sx={{ fontStyle: 'italic' }}>
                    "{detailsDialog.order.specialInstructions}"
                  </Typography>
                </>
              )}

              <Typography variant="subtitle2" gutterBottom>
                Order Items
              </Typography>
              {detailsDialog.order.orderItems && detailsDialog.order.orderItems.length > 0 ? (
                <List dense>
                  {detailsDialog.order.orderItems.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary={
                            <Box display="flex" justifyContent="space-between">
                              <Typography variant="body2">
                                {item.name} x {item.quantity}
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                ${item.total?.toFixed(2) || (item.price * item.quantity).toFixed(2)}
                              </Typography>
                            </Box>
                          }
                          secondary={`$${item.price?.toFixed(2)} each`}
                        />
                      </ListItem>
                      {index < detailsDialog.order.orderItems.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                  <Divider sx={{ my: 1 }} />
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Subtotal</Typography>
                          <Typography variant="body2">
                            ${detailsDialog.order.totalAmount}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {detailsDialog.order.deliveryFee > 0 && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2">Delivery Fee</Typography>
                            <Typography variant="body2">
                              ${detailsDialog.order.deliveryFee}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  )}
                  {detailsDialog.order.taxAmount > 0 && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2">Tax</Typography>
                            <Typography variant="body2">
                              ${detailsDialog.order.taxAmount}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  )}
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="subtitle1" fontWeight={600}>Total</Typography>
                          <Typography variant="subtitle1" fontWeight={600}>
                            ${getOrderTotal(detailsDialog.order)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No order items available
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
          <Button
            variant="contained"
            startIcon={<TrackChanges />}
            onClick={() => {
              handleCloseDetails();
              navigate(`/orders/${detailsDialog.order?.id}/track`);
            }}
          >
            Track Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Orders;
