import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  IconButton,
  InputAdornment,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Restaurant as RestaurantIcon,
  Phone,
  Email,
  Schedule,
  LocalShipping,
  FilterList,
  Refresh,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import restaurantService from '../../services/restaurantService';

const Restaurants = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, restaurant: null });
  const [cuisines, setCuisines] = useState([]);

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    filterRestaurants();
  }, [restaurants, searchQuery, cuisineFilter]);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const restaurantData = await restaurantService.getAllRestaurants();
      setRestaurants(restaurantData);
      
      // Get unique cuisines
      const uniqueCuisines = [...new Set(restaurantData.map(r => r.cuisine))].sort();
      setCuisines(uniqueCuisines);
      
      toast.success(`Loaded ${restaurantData.length} restaurants`);
    } catch (error) {
      console.error('Error loading restaurants:', error);
      toast.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const filterRestaurants = () => {
    let filtered = restaurants;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by cuisine
    if (cuisineFilter) {
      filtered = filtered.filter(restaurant => restaurant.cuisine === cuisineFilter);
    }

    setFilteredRestaurants(filtered);
  };

  const handleDeleteClick = (restaurant) => {
    setDeleteDialog({ open: true, restaurant });
  };

  const handleDeleteConfirm = async () => {
    const { restaurant } = deleteDialog;
    try {
      await restaurantService.deleteRestaurant(restaurant.id);
      await loadRestaurants();
      toast.success(`Restaurant ${restaurant.name} deleted successfully`);
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      toast.error(`Failed to delete restaurant ${restaurant.name}`);
    } finally {
      setDeleteDialog({ open: false, restaurant: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, restaurant: null });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCuisineFilter('');
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
            Restaurant Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage restaurants and their information
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/restaurants/new')}
          sx={{ height: 'fit-content' }}
        >
          Add New Restaurant
        </Button>
      </Box>

      {/* Search and Filters */}
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search restaurants..."
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
              <InputLabel>Filter by Cuisine</InputLabel>
              <Select
                value={cuisineFilter}
                onChange={(e) => setCuisineFilter(e.target.value)}
                label="Filter by Cuisine"
              >
                <MenuItem value="">All Cuisines</MenuItem>
                {cuisines.map((cuisine) => (
                  <MenuItem key={cuisine} value={cuisine}>
                    {cuisine}
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
                disabled={!searchQuery && !cuisineFilter}
              >
                Clear Filters
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadRestaurants}
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
          icon={<RestaurantIcon />}
          label={`Total Restaurants: ${restaurants.length}`}
          color="primary"
          variant="outlined"
        />
        <Chip
          icon={<Search />}
          label={`Filtered: ${filteredRestaurants.length}`}
          color="secondary"
          variant="outlined"
        />
        <Chip
          label={`Active: ${restaurants.filter(r => r.isActive).length}`}
          color="success"
          variant="outlined"
        />
        <Chip
          label={`Cuisines: ${cuisines.length}`}
          color="info"
          variant="outlined"
        />
      </Box>

      {/* Restaurants Grid */}
      <Grid container spacing={3}>
        {filteredRestaurants.map((restaurant) => (
          <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
              }}
            >
              {restaurant.imageUrl && (
                <CardMedia
                  component="img"
                  height="200"
                  image={restaurant.imageUrl}
                  alt={restaurant.name}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box flexGrow={1}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {restaurant.name}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Chip
                        label={restaurant.cuisine}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        label={restaurant.isActive ? 'Open' : 'Closed'}
                        size="small"
                        color={restaurant.isActive ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" mb={2} sx={{ flexGrow: 1 }}>
                  {restaurant.description}
                </Typography>

                <Box mb={2}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Rating
                      value={restaurant.rating}
                      readOnly
                      size="small"
                      precision={0.1}
                    />
                    <Typography variant="body2" color="text.secondary" ml={1}>
                      {restaurant.rating?.toFixed(1) || 'N/A'}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {restaurant.phone}
                    </Typography>
                  </Box>

                  {restaurant.email && (
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {restaurant.email}
                      </Typography>
                    </Box>
                  )}

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {restaurant.openingTime} - {restaurant.closingTime}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <LocalShipping sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      ${restaurant.deliveryFee?.toFixed(2)} delivery • ${restaurant.minimumOrder?.toFixed(2)} min
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" gap={1} justifyContent="flex-end" mt="auto">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/restaurants/edit/${restaurant.id}`)}
                    title="Edit Restaurant"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteClick(restaurant)}
                    title="Delete Restaurant"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* No Restaurants Message */}
      {filteredRestaurants.length === 0 && !loading && (
        <Box textAlign="center" py={6}>
          <RestaurantIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No restaurants found
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            {searchQuery || cuisineFilter 
              ? 'No restaurants match your search criteria.' 
              : 'Get started by adding your first restaurant.'
            }
          </Typography>
          {!searchQuery && !cuisineFilter && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/restaurants/new')}
            >
              Add First Restaurant
            </Button>
          )}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Restaurant
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete restaurant "{deleteDialog.restaurant?.name}"? 
            This action cannot be undone and will also remove all associated orders and menu items.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Restaurants;
