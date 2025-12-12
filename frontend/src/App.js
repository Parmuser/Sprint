import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import Users from './pages/Users';
import Restaurants from './pages/Restaurants';
import Orders from './pages/Orders';
import LiveTracking from './pages/LiveTracking';
import UserForm from './components/Users/UserForm';
import RestaurantForm from './components/Restaurants/RestaurantForm';
import OrderForm from './components/Orders/OrderForm';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/new" element={<UserForm />} />
          <Route path="/users/edit/:id" element={<UserForm />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/new" element={<RestaurantForm />} />
          <Route path="/restaurants/edit/:id" element={<RestaurantForm />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/new" element={<OrderForm />} />
          <Route path="/orders/:id/track" element={<LiveTracking />} />
          <Route path="/live-tracking" element={<LiveTracking />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
