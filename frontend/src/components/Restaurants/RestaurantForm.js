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
  Switch,
  FormControlLabel,
  InputAdornment,
} from '@mui/material';
import { 
  Save, 
  ArrowBack, 
  Restaurant as RestaurantIcon,
  Phone,
  Email,
  Schedule,
  LocalShipping,
  AttachMoney,
  Image,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import restaurantService from '../../services/restaurantService';

const RestaurantForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    cuisine: '',
    rating: 0,
    isActive: true,
    openingTime: '09:00',
    closingTime: '22:00',
    deliveryFee: 0,
    minimumOrder: 0,
    imageUrl: '',
  });

  const cuisineOptions = [
    'Indian',
    'Italian',
    'Chinese',
    'Japanese',
    'Mexican',
    'American',
    'Thai',
    'Mediterranean',
    'French',
    'Korean',
    'Vietnamese',
    'Greek',
    'Turkish',
    'Lebanese',
    'Spanish',
    'Brazilian',
    'Other'
  ];

  useEffect(() => {
    if (isEditing) {
      loadRestaurant();
    }
  }, [id, isEditing]);

  const loadRestaurant = async () => {
    try {
      setLoading(true);
      const restaurant = await restaurantService.getRestaurantById(id);
      setInitialValues({
        name: restaurant.name || '',
        description: restaurant.description || '',
        address: restaurant.address || '',
        phone: restaurant.phone || '',
        email: restaurant.email || '',
        cuisine: restaurant.cuisine || '',
        rating: restaurant.rating || 0,
        isActive: restaurant.isActive !== false,
        openingTime: restaurant.openingTime || '09:00',
        closingTime: restaurant.closingTime || '22:00',
        deliveryFee: restaurant.deliveryFee || 0,
        minimumOrder: restaurant.minimumOrder || 0,
        imageUrl: restaurant.imageUrl || '',
      });
    } catch (error) {
      console.error('Error loading restaurant:', error);
      toast.error('Failed to load restaurant data');
      navigate('/restaurants');
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be at most 100 characters')
      .required('Restaurant name is required'),
    description: Yup.string()
      .min(10, 'Description must be at least 10 characters')
      .max(255, 'Description must be at most 255 characters')
      .required('Description is required'),
    address: Yup.string()
      .required('Address is required'),
    phone: Yup.string()
      .matches(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
      .required('Phone number is required'),
    email: Yup.string()
      .email('Invalid email format'),
    cuisine: Yup.string()
      .required('Cuisine type is required'),
    rating: Yup.number()
      .min(0, 'Rating cannot be negative')
      .max(5, 'Rating cannot be more than 5'),
    deliveryFee: Yup.number()
      .min(0, 'Delivery fee cannot be negative')
      .required('Delivery fee is required'),
    minimumOrder: Yup.number()
      .min(0, 'Minimum order cannot be negative')
      .required('Minimum order is required'),
    imageUrl: Yup.string()
      .url('Please enter a valid URL'),
    openingTime: Yup.string()
      .required('Opening time is required'),
    closingTime: Yup.string()
      .required('Closing time is required'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      setSubmitting(true);
      
      const restaurantData = {
        ...values,
        rating: parseFloat(values.rating),
        deliveryFee: parseFloat(values.deliveryFee),
        minimumOrder: parseFloat(values.minimumOrder),
      };

      if (isEditing) {
        await restaurantService.updateRestaurant(id, restaurantData);
        toast.success('Restaurant updated successfully');
      } else {
        await restaurantService.createRestaurant(restaurantData);
        toast.success('Restaurant created successfully');
      }

      navigate('/restaurants');
    } catch (error) {
      console.error('Error saving restaurant:', error);
      const message = error.response?.data?.message || 'Failed to save restaurant';
      toast.error(message);
      
      // Set form errors if available
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setSubmitting(false);
    }
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
          onClick={() => navigate('/restaurants')}
          sx={{ mr: 2 }}
        >
          Back to Restaurants
        </Button>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
            {isEditing ? 'Edit Restaurant' : 'Create New Restaurant'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEditing ? 'Update restaurant information' : 'Add a new restaurant to the platform'}
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
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
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
                  <RestaurantIcon sx={{ color: 'white', fontSize: 30 }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Restaurant Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enter the restaurant's details and settings
                  </Typography>
                </Box>
              </Box>

              {/* Basic Information */}
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Basic Information
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Restaurant Name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    disabled={isSubmitting}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={touched.cuisine && Boolean(errors.cuisine)}>
                    <InputLabel>Cuisine Type</InputLabel>
                    <Select
                      name="cuisine"
                      value={values.cuisine}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Cuisine Type"
                      disabled={isSubmitting}
                    >
                      {cuisineOptions.map((cuisine) => (
                        <MenuItem key={cuisine} value={cuisine}>
                          {cuisine}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.cuisine && errors.cuisine && (
                      <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                        {errors.cuisine}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="description"
                    label="Description"
                    multiline
                    rows={3}
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                    placeholder="Describe the restaurant and its specialties..."
                    disabled={isSubmitting}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="address"
                    label="Address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address}
                    disabled={isSubmitting}
                  />
                </Grid>
              </Grid>

              {/* Contact Information */}
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Contact Information
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="phone"
                    label="Phone Number"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone />
                        </InputAdornment>
                      ),
                    }}
                    disabled={isSubmitting}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Email (Optional)"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      ),
                    }}
                    disabled={isSubmitting}
                  />
                </Grid>
              </Grid>

              {/* Operating Hours */}
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Operating Hours
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="openingTime"
                    label="Opening Time"
                    type="time"
                    value={values.openingTime}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.openingTime && Boolean(errors.openingTime)}
                    helperText={touched.openingTime && errors.openingTime}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Schedule />
                        </InputAdornment>
                      ),
                    }}
                    disabled={isSubmitting}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="closingTime"
                    label="Closing Time"
                    type="time"
                    value={values.closingTime}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.closingTime && Boolean(errors.closingTime)}
                    helperText={touched.closingTime && errors.closingTime}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Schedule />
                        </InputAdornment>
                      ),
                    }}
                    disabled={isSubmitting}
                  />
                </Grid>
              </Grid>

              {/* Pricing & Delivery */}
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Pricing & Delivery
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney />
                        </InputAdornment>
                      ),
                    }}
                    disabled={isSubmitting}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="minimumOrder"
                    label="Minimum Order"
                    type="number"
                    inputProps={{ min: 0, step: 0.01 }}
                    value={values.minimumOrder}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.minimumOrder && Boolean(errors.minimumOrder)}
                    helperText={touched.minimumOrder && errors.minimumOrder}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoney />
                        </InputAdornment>
                      ),
                    }}
                    disabled={isSubmitting}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    name="rating"
                    label="Rating (0-5)"
                    type="number"
                    inputProps={{ min: 0, max: 5, step: 0.1 }}
                    value={values.rating}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.rating && Boolean(errors.rating)}
                    helperText={touched.rating && errors.rating}
                    disabled={isSubmitting}
                  />
                </Grid>
              </Grid>

              {/* Additional Settings */}
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Additional Settings
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="imageUrl"
                    label="Image URL (Optional)"
                    value={values.imageUrl}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.imageUrl && Boolean(errors.imageUrl)}
                    helperText={touched.imageUrl && errors.imageUrl}
                    placeholder="https://example.com/restaurant-image.jpg"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Image />
                        </InputAdornment>
                      ),
                    }}
                    disabled={isSubmitting}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.isActive}
                        onChange={(e) => setFieldValue('isActive', e.target.checked)}
                        disabled={isSubmitting}
                      />
                    }
                    label="Restaurant is currently open for orders"
                  />
                </Grid>
              </Grid>

              {/* Form Info */}
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Note:</strong> Make sure all information is accurate as it will be displayed to customers. 
                  The rating will be automatically updated based on customer reviews.
                </Typography>
              </Alert>

              {/* Actions */}
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => navigate('/restaurants')}
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
                  {isSubmitting ? 'Saving...' : isEditing ? 'Update Restaurant' : 'Create Restaurant'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default RestaurantForm;
