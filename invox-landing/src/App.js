import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './SignupPage';
import Dashboard from './Dashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import LandingPage from './LandingPage';
import { InventoryProvider } from './InventoryContext';
import './App.css';
import './styles/theme.css';
import SelectionPage from './components/SelectionPage';
import AdminLayout from './components/admin/AdminLayout';
import PrivateRoute from './components/PrivateRoute';
import StockInventoryTable from './components/admin/StockInventoryTable';
import Shop from './components/Shop';
import AdminAnalytics from './components/admin/AdminAnalytics';
import Analytics from './components/admin/Analytics';
import ForgotPassword from './components/ForgotPassword';
import { jwtDecode } from 'jwt-decode';

const App = () => {
    useEffect(() => {
        // Check token expiration every minute
        const interval = setInterval(() => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.token) {
                const decodedToken = jwtDecode(user.token);
                if (decodedToken.exp * 1000 < Date.now()) {
                    // Token has expired
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                    alert('Your session has expired. Please login again.');
                }
            }
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <InventoryProvider>
            <Router>
                <div className="app">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/select-role" element={<SelectionPage />} />
                        <Route path="/admin-login" element={<LoginPage />} />
                        <Route path="/user-login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        
                        <Route path="/user-dashboard" element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        } />
                        
                        <Route path="/shop" element={
                            <PrivateRoute>
                                <Shop />
                            </PrivateRoute>
                        } />

                        <Route path="/admin" element={
                            <PrivateRoute>
                                <AdminLayout />
                            </PrivateRoute>
                        }>
                            <Route index element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="inventory" element={<StockInventoryTable />} />
                            <Route path="orders" element={<div>Orders Page</div>} />
                            <Route path="users" element={<div>Users Page</div>} />
                            <Route path="reports" element={<AdminAnalytics />} />
                            <Route path="invoices" element={<div>Invoices Page</div>} />
                            <Route path="analytics" element={<Analytics />} />
                        </Route>

                        <Route path="/forgot-password" element={<ForgotPassword />} />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </Router>
        </InventoryProvider>
    );
};

export default App;
