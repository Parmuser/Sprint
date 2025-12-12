import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
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
  TablePagination,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Person,
  Email,
  Refresh,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import userService from '../../services/userService';

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const userData = await userService.getAllUsers();
      setUsers(userData);
      toast.success(`Loaded ${userData.length} users`);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
    setPage(0); // Reset to first page when filtering
  };

  const handleDeleteClick = (user) => {
    setDeleteDialog({ open: true, user });
  };

  const handleDeleteConfirm = async () => {
    const { user } = deleteDialog;
    try {
      await userService.deleteUser(user.id);
      await loadUsers();
      toast.success(`User ${user.username} deleted successfully`);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(`Failed to delete user ${user.username}`);
    } finally {
      setDeleteDialog({ open: false, user: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, user: null });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage user accounts and profiles
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/users/new')}
          sx={{ height: 'fit-content' }}
        >
          Add New User
        </Button>
      </Box>

      {/* Search and Actions */}
      <Box display="flex" gap={2} mb={3} alignItems="center">
        <TextField
          fullWidth
          placeholder="Search users by username or email..."
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
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadUsers}
        >
          Refresh
        </Button>
      </Box>

      {/* Statistics */}
      <Box display="flex" gap={2} mb={3}>
        <Chip
          icon={<Person />}
          label={`Total Users: ${users.length}`}
          color="primary"
          variant="outlined"
        />
        <Chip
          icon={<Search />}
          label={`Filtered: ${filteredUsers.length}`}
          color="secondary"
          variant="outlined"
        />
      </Box>

      {/* Users Grid */}
      <Grid container spacing={2}>
        {paginatedUsers.map((user) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    <Person sx={{ color: 'white' }} />
                  </Box>
                  <Box flexGrow={1}>
                    <Typography variant="h6" fontWeight={600} noWrap>
                      {user.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {user.id}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {user.email}
                  </Typography>
                </Box>

                <Box display="flex" gap={1} justifyContent="flex-end">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/users/edit/${user.id}`)}
                    title="Edit User"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteClick(user)}
                    title="Delete User"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* No Users Message */}
      {filteredUsers.length === 0 && !loading && (
        <Box textAlign="center" py={6}>
          <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No users found
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            {searchQuery ? 'No users match your search criteria.' : 'Get started by adding your first user.'}
          </Typography>
          {!searchQuery && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/users/new')}
            >
              Add First User
            </Button>
          )}
        </Box>
      )}

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <Box mt={3}>
          <TablePagination
            component="div"
            count={filteredUsers.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
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
          Delete User
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete user "{deleteDialog.user?.username}"? 
            This action cannot be undone.
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

export default Users;
