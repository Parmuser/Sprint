# Zomato Clone Frontend

A modern React-based frontend application for the Zomato-like food delivery microservices system.

## Features

### 🏠 Dashboard
- Real-time statistics and metrics
- Service health monitoring
- Quick actions for common tasks
- Recent orders overview

### 👥 User Management
- Complete CRUD operations for users
- Search and filter capabilities
- Form validation with Formik & Yup
- Responsive design

### 🍽️ Restaurant Management
- Restaurant CRUD with detailed information
- Cuisine-based filtering
- Operating hours and pricing management
- Image support and ratings

### 📦 Order Management
- Comprehensive order tracking
- Multi-item order creation
- Status management
- Customer and restaurant information

### 🚚 Live Tracking
- Real-time order status updates
- WebSocket-based notifications
- Order progress visualization
- Simulation mode for testing

## Technology Stack

- **React 18** - Frontend framework
- **Material-UI (MUI)** - Component library
- **React Router v6** - Client-side routing
- **Formik & Yup** - Form handling and validation
- **Axios** - HTTP client
- **STOMP.js & SockJS** - WebSocket communication
- **React Query** - Data fetching and caching
- **Date-fns** - Date manipulation
- **React Toastify** - Notifications
- **Styled Components** - Additional styling

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Backend services running (User Service on port 8080, etc.)

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Backend Service Configuration

The frontend expects the following backend services:

- **User Service**: `http://localhost:8080`
- **Restaurant Service**: `http://localhost:8081`
- **Order Service**: `http://localhost:8082`
- **Notification Service**: `http://localhost:8083`
- **Eureka Server**: `http://localhost:8761`

### Environment Variables

Create a `.env` file in the frontend root directory:

```env
REACT_APP_API_BASE_URL=http://localhost
REACT_APP_NOTIFICATION_SERVICE_URL=http://localhost:8083
```

## Application Structure

```
src/
├── components/          # Reusable components
│   ├── Layout/         # Navigation and layout components
│   ├── Users/          # User-specific components
│   ├── Restaurants/    # Restaurant-specific components
│   └── Orders/         # Order-specific components
├── pages/              # Main page components
│   ├── Home.js         # Dashboard page
│   ├── Users.js        # User management page
│   ├── Restaurants.js  # Restaurant management page
│   ├── Orders.js       # Order management page
│   └── LiveTracking.js # Live tracking page
├── services/           # API service layers
│   ├── apiService.js   # Base API configuration
│   ├── userService.js  # User API calls
│   ├── restaurantService.js # Restaurant API calls
│   ├── orderService.js # Order API calls
│   └── notificationService.js # WebSocket service
├── App.js              # Main application component
├── index.js            # Application entry point
└── index.css           # Global styles
```

## Features in Detail

### User Management
- ✅ Create, read, update, delete users
- ✅ Username and email uniqueness validation
- ✅ Search functionality
- ✅ Responsive card-based layout

### Restaurant Management
- ✅ Complete restaurant information management
- ✅ Cuisine-based filtering
- ✅ Operating hours and pricing
- ✅ Image URL support
- ✅ Active/inactive status

### Order Management
- ✅ Multi-item order creation
- ✅ Customer and restaurant selection
- ✅ Real-time total calculation
- ✅ Order status tracking
- ✅ Detailed order views

### Live Tracking
- ✅ WebSocket-based real-time updates
- ✅ Order status progression
- ✅ Simulation mode for testing
- ✅ Notification system
- ✅ Visual order timeline

## API Integration

### Service Clients
Each microservice has a dedicated client with:
- Automatic retry logic
- Error handling and user feedback
- Loading states
- Fallback to mock data when services are unavailable

### Mock Data Support
When backend services are not available, the frontend provides:
- Sample restaurants with different cuisines
- Mock order data with various statuses
- Simulated live tracking updates
- Realistic user scenarios

## Responsive Design

The application is fully responsive and works on:
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (320px - 767px)

## Development Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject configuration (not recommended)
npm run eject
```

## Production Build

```bash
# Create production build
npm run build

# The build folder contains the optimized production files
# Deploy the contents of the build folder to your web server
```

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Contributing

1. Follow the existing code structure
2. Use Material-UI components consistently
3. Add proper error handling
4. Include loading states
5. Test on multiple screen sizes
6. Add proper TypeScript types (future enhancement)

## Future Enhancements

- [ ] TypeScript migration
- [ ] Unit and integration tests
- [ ] PWA capabilities
- [ ] Offline support
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Dark theme
- [ ] Real-time chat support
- [ ] Push notifications
- [ ] Advanced search with filters

## Troubleshooting

### Common Issues

1. **Services not connecting:**
   - Check if backend services are running
   - Verify port numbers in configuration
   - Check CORS settings on backend

2. **WebSocket not working:**
   - Notification service provides fallback simulation
   - Check browser console for WebSocket errors
   - Verify notification service URL

3. **Build errors:**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Update dependencies if needed

### Performance Tips

- Use React.memo for expensive components
- Implement proper loading states
- Use React Query for caching
- Optimize bundle size with code splitting

## License

This project is part of the Zomato Clone microservices demonstration system.
