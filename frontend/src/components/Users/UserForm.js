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
} from '@mui/material';
import { Save, ArrowBack, Person } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import userService from '../../services/userService';

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    username: '',
    email: '',
  });

  useEffect(() => {
    if (isEditing) {
      loadUser();
    }
  }, [id, isEditing]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const user = await userService.getUserById(id);
      setInitialValues({
        username: user.username || '',
        email: user.email || '',
      });
    } catch (error) {
      console.error('Error loading user:', error);
      toast.error('Failed to load user data');
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username must be at most 50 characters')
      .required('Username is required')
      .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      setSubmitting(true);
      
      // Check if username exists (only for new users or if username changed)
      if (!isEditing || values.username !== initialValues.username) {
        const usernameExists = await userService.usernameExists(values.username);
        if (usernameExists) {
          setErrors({ username: 'Username already exists' });
          return;
        }
      }

      // Check if email exists (only for new users or if email changed)
      if (!isEditing || values.email !== initialValues.email) {
        const emailExists = await userService.emailExists(values.email);
        if (emailExists) {
          setErrors({ email: 'Email already exists' });
          return;
        }
      }

      if (isEditing) {
        await userService.updateUser(id, values);
        toast.success('User updated successfully');
      } else {
        await userService.createUser(values);
        toast.success('User created successfully');
      }

      navigate('/users');
    } catch (error) {
      console.error('Error saving user:', error);
      const message = error.response?.data?.message || 'Failed to save user';
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
    <Box maxWidth="md" mx="auto">
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/users')}
          sx={{ mr: 2 }}
        >
          Back to Users
        </Button>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
            {isEditing ? 'Edit User' : 'Create New User'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEditing ? 'Update user information' : 'Add a new user to the system'}
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
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <Box display="flex" alignItems="center" mb={3}>
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
                  <Person sx={{ color: 'white', fontSize: 30 }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    User Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enter the user's basic information
                  </Typography>
                </Box>
              </Box>

              <Box mb={3}>
                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label="Username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                  placeholder="Enter username"
                  disabled={isSubmitting}
                />
              </Box>

              <Box mb={4}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  placeholder="Enter email address"
                  disabled={isSubmitting}
                />
              </Box>

              {/* Form Info */}
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Note:</strong> Username must be unique and can only contain letters, numbers, and underscores. 
                  Email address must be valid and unique.
                </Typography>
              </Alert>

              {/* Actions */}
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => navigate('/users')}
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
                  {isSubmitting ? 'Saving...' : isEditing ? 'Update User' : 'Create User'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default UserForm;
