import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || !user.token) {
        // Redirect to appropriate login page based on the route
        const isAdminRoute = location.pathname.startsWith('/admin');
        return <Navigate to={isAdminRoute ? '/admin-login' : '/user-login'} state={{ from: location }} />;
    }

    // Check if trying to access admin routes
    if (location.pathname.startsWith('/admin')) {
        // Check if user is admin
        if (!user.user.role || user.user.role !== 'admin') {
            // If not admin, redirect to user dashboard
            return <Navigate to="/user-dashboard" />;
        }
    }

    // If user is trying to access user routes and is admin, redirect to admin dashboard
    if (location.pathname === '/user-dashboard' && user.user.role === 'admin') {
        return <Navigate to="/admin/dashboard" />;
    }

    return children;
};

export default PrivateRoute; 