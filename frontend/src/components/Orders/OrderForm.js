import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import { 
  Save, 
  ArrowBack, 
  ShoppingCart,
  Add,
  Remove,
  Delete,
  Person,
  Restaurant,
  LocationOn,
  AttachMoney,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import orderService from '../../services/orderService';
import userService from '../../services/userService';
import restaurantService from '../../services/restaurantService';

const OrderForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [initialValues, setInitialValues] = useState({
    userId: '',
    restaurantId: '',
    deliveryAddress: '',
    specialInstructions: '',
    deliveryFee: 2.99,
    taxAmount: 0,
    orderItems: [
      {
        name: '',
        quantity: 1,
        price: 0,
      }
    ]
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isEditing) {
      loadOrder();
    }
  }, [id, isEditing]);

  const loadData = async () => {
    try {
      const [usersData, restaurantsData] = await Promise.all([
        userService.getAllUsers().catch(() => []),
        restaurantService.getAllRestaurants().catch(() => [])
      ]);
      setUsers(usersData);
      setRestaurants(restaurantsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load form data');
    }
  };

  const loadOrder = async () => {
    try {
      setLoading(true);
      const order = await orderService.getOrderById(id);
      setInitialValues({
        userId: order.userId || '',
        restaurantId: order.restaurantId || '',
        deliveryAddress: order.deliveryAddress || '',
        specialInstructions: order.specialInstructions || '',
        deliveryFee: order.deliveryFee || 2.99,
        taxAmount: order.taxAmount || 0,
        orderItems: order.orderItems && order.orderItems.length > 0 
          ? order.orderItems.map(item => ({
              name: item.name || '',
              quantity: item.quantity || 1,
              price: item.price || 0,
            }))
          : [{ name: '', quantity: 1, price: 0 }]
      });
    } catch (error) {
      console.error('Error loading order:', error);
      toast.error('Failed to load order data');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    userId: Yup.string().required('Customer is required'),
    restaurantId: Yup.string().required('Restaurant is required'),
    deliveryAddress: Yup.string()
      .min(10, 'Address must be at least 10 characters')
      .required('Delivery address is required'),
    deliveryFee: Yup.number()
      .min(0, 'Delivery fee cannot be negative')
      .required('Delivery fee is required'),
    taxAmount: Yup.number()
      .min(0, 'Tax amount cannot be negative'),
    orderItems: Yup.array()
      .of(
        Yup.object({
          name: Yup.string().required('Item name is required'),
          quantity: Yup.number()
            .min(1, 'Quantity must be at least 1')
            .required('Quantity is required'),
          price: Yup.number()
            .min(0, 'Price cannot be negative')
            .required('Price is required'),
        })
      )
      .min(1, 'At least one order item is required'),
  });

  const calculateTotals = (orderItems, deliveryFee) => {
    const subtotal = orderItems.reduce((sum, item) => {
      return sum + (parseFloat(item.price || 0) * parseInt(item.quantity || 0));
    }, 0);
    
    const taxAmount = subtotal * 0.08; // 8% tax
    const total = subtotal + parseFloat(deliveryFee || 0) + taxAmount;
    
    return {
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      setSubmitting(true);
      
      const { subtotal, taxAmount, total } = calculateTotals(values.orderItems, values.deliveryFee);
      
      const orderData = {
        userId: parseInt(values.userId),
        restaurantId: parseInt(values.restaurantId),
        totalAmount: parseFloat(subtotal),
        deliveryFee: parseFloat(values.deliveryFee),
        taxAmount: parseFloat(taxAmount),
        deliveryAddress: values.deliveryAddress,
        specialInstructions: values.specialInstructions || null,
        status: 'PLACED',
        estimatedDeliveryTime: new Date(Date.now() + 45 * 60000).toISOString(), // 45 minutes from now
        orderItems: values.orderItems.map(item => ({
          name: item.name,
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price),
          total: parseFloat(item.price) * parseInt(item.quantity)
        }))
      };

      if (isEditing) {
        await orderService.updateOrder(id, orderData);
        toast.success('Order updated successfully');
      } else {
        await orderService.createOrder(orderData);
        toast.success('Order created successfully');
      }

      navigate('/orders');
    } catch (error) {
      console.error('Error saving order:', error);
      const message = error.response?.data?.message || 'Failed to save order';
      toast.error(message);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === parseInt(userId));
    return user ? user.username : '';
  };

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find(r => r.id === parseInt(restaurantId));
    return restaurant ? restaurant.name : '';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth="lg" mx="auto">
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/orders')}
          sx={{ mr: 2 }}
        >
          Back to Orders
        </Button>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
            {isEditing ? 'Edit Order' : 'Create New Order'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEditing ? 'Update order information' : 'Create a new food order'}
          </Typography>
        </Box>
      </Box>

      {/* Form */}
      <Paper sx={{ p: 4 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => {
            const totals = calculateTotals(values.orderItems, values.deliveryFee);
            
            return (
              <Form>
                {/* Header Section */}
                <Box display="flex" alignItems="center" mb={4}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 3,
                    }}
                  >
                    <ShoppingCart sx={{ color: 'white', fontSize: 30 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Order Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Enter the order details and items
                    </Typography>
                  </Box>
                </Box>

                {/* Basic Information */}
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  Basic Information
                </Typography>
                
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <FormControl 
                      fullWidth 
                      error={touched.userId && Boolean(errors.userId)}
                    >
                      <InputLabel>Customer</InputLabel>
                      <Select
                        name="userId"
                        value={values.userId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Customer"
                        disabled={isSubmitting}
                      >
                        {users.map((user) => (
                          <MenuItem key={user.id} value={user.id}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Person sx={{ fontSize: 16 }} />
                              {user.username} ({user.email})
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.userId && errors.userId && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                          {errors.userId}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl 
                      fullWidth 
                      error={touched.restaurantId && Boolean(errors.restaurantId)}
                    >
                      <InputLabel>Restaurant</InputLabel>
                      <Select
                        name="restaurantId"
                        value={values.restaurantId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Restaurant"
                        disabled={isSubmitting}
                      >
                        {restaurants.filter(r => r.isActive).map((restaurant) => (
                          <MenuItem key={restaurant.id} value={restaurant.id}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Restaurant sx={{ fontSize: 16 }} />
                              {restaurant.name} ({restaurant.cuisine})
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.restaurantId && errors.restaurantId && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                          {errors.restaurantId}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="deliveryAddress"
                      label="Delivery Address"
                      multiline
                      rows={2}
                      value={values.deliveryAddress}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.deliveryAddress && Boolean(errors.deliveryAddress)}
                      helperText={touched.deliveryAddress && errors.deliveryAddress}
                      placeholder="Enter complete delivery address..."
                      disabled={isSubmitting}
                      InputProps={{
                        startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="specialInstructions"
                      label="Special Instructions (Optional)"
                      multiline
                      rows={2}
                      value={values.specialInstructions}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Any special requests or instructions for the delivery..."
                      disabled={isSubmitting}
                    />
                  </Grid>
                </Grid>

                {/* Order Items */}
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  Order Items
                </Typography>
                
                <FieldArray name="orderItems">
                  {({ push, remove }) => (
                    <Box sx={{ mb: 4 }}>
                      {values.orderItems.map((item, index) => (
                        <Card key={index} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                          <CardContent>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} md={4}>
                                <TextField
                                  fullWidth
                                  name={`orderItems.${index}.name`}
                                  label="Item Name"
                                  value={item.name}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={
                                    touched.orderItems?.[index]?.name && 
                                    Boolean(errors.orderItems?.[index]?.name)
                                  }
                                  helperText={
                                    touched.orderItems?.[index]?.name && 
                                    errors.orderItems?.[index]?.name
                                  }
                                  disabled={isSubmitting}
                                />
                              </Grid>
                              
                              <Grid item xs={12} md={3}>
                                <TextField
                                  fullWidth
                                  name={`orderItems.${index}.quantity`}
                                  label="Quantity"
                                  type="number"
                                  inputProps={{ min: 1, step: 1 }}
                                  value={item.quantity}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={
                                    touched.orderItems?.[index]?.quantity && 
                                    Boolean(errors.orderItems?.[index]?.quantity)
                                  }
                                  helperText={
                                    touched.orderItems?.[index]?.quantity && 
                                    errors.orderItems?.[index]?.quantity
                                  }
                                  disabled={isSubmitting}
                                />
                              </Grid>
                              
                              <Grid item xs={12} md={3}>
                                <TextField
                                  fullWidth
                                  name={`orderItems.${index}.price`}
                                  label="Price"
                                  type="number"
                                  inputProps={{ min: 0, step: 0.01 }}
                                  value={item.price}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={
                                    touched.orderItems?.[index]?.price && 
                                    Boolean(errors.orderItems?.[index]?.price)
                                  }
                                  helperText={
                                    touched.orderItems?.[index]?.price && 
                                    errors.orderItems?.[index]?.price
                                  }
                                  disabled={isSubmitting}
                                  InputProps={{
                                    startAdornment: <AttachMoney />
                                  }}
                                />
                              </Grid>
                              
                              <Grid item xs={12} md={2}>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                  <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Total
                                  </Typography>
                                  <Typography variant="h6" fontWeight={600}>
                                    ${(parseFloat(item.price || 0) * parseInt(item.quantity || 0)).toFixed(2)}
                                  </Typography>
                                  <IconButton
                                    color="error"
                                    onClick={() => remove(index)}
                                    disabled={values.orderItems.length <= 1 || isSubmitting}
                                    size="small"
                                  >
                                    <Delete />
                                  </IconButton>
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      ))}
                      
                      <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => push({ name: '', quantity: 1, price: 0 })}
                        disabled={isSubmitting}
                        sx={{ mt: 1 }}
                      >
                        Add Item
                      </Button>
                    </Box>
                  )}
                </FieldArray>

                {/* Pricing */}
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  Pricing
                </Typography>
                
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="deliveryFee"
                      label="Delivery Fee"
                      type="number"
                      inputProps={{ min: 0, step: 0.01 }}
                      value={values.deliveryFee}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.deliveryFee && Boolean(errors.deliveryFee)}
                      helperText={touched.deliveryFee && errors.deliveryFee}
                      disabled={isSubmitting}
                      InputProps={{
                        startAdornment: <AttachMoney />
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Order Summary
                      </Typography>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Subtotal:</Typography>
                        <Typography variant="body2">${totals.subtotal}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Delivery Fee:</Typography>
                        <Typography variant="body2">${parseFloat(values.deliveryFee || 0).toFixed(2)}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Tax (8%):</Typography>
                        <Typography variant="body2">${totals.taxAmount}</Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="h6" fontWeight={600}>Total:</Typography>
                        <Typography variant="h6" fontWeight={600}>${totals.total}</Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Form Info */}
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    <strong>Note:</strong> Tax is automatically calculated at 8% of the subtotal. 
                    Make sure all item details are accurate before submitting.
                  </Typography>
                </Alert>

                {/* Actions */}
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/orders')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : isEditing ? 'Update Order' : 'Create Order'}
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Paper>
    </Box>
  );
};

export default OrderForm;
