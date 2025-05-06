import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    const isAdminLogin = location.pathname === '/admin-login';

    useEffect(() => {
        localStorage.removeItem('user');
    }, []);

    const sanitizeInput = (input) => {
        // Remove any HTML tags and trim whitespace
        return input.replace(/<[^>]*>/g, '').trim();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const sanitizedEmail = sanitizeInput(email);
        const sanitizedPassword = sanitizeInput(password);

        if (!sanitizedEmail || !sanitizedPassword) {
            setError('Please provide both email and password');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email: sanitizedEmail,
                password: sanitizedPassword,
                expectedRole: isAdminLogin ? 'admin' : 'user'
            });

            const { token, user } = response.data;
            
            // Store user info in localStorage
            localStorage.setItem('user', JSON.stringify({ token, user }));

            // Determine where to redirect based on user role and login page
            if (location.pathname === '/admin-login') {
                if (user.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    setError('Access denied. Admin privileges required.');
                    localStorage.removeItem('user');
                }
            } else {
                if (user.role === 'admin') {
                    setError('Please use admin login page');
                    localStorage.removeItem('user');
                } else {
                    navigate('/user-dashboard');
                }
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>{isAdminLogin ? 'Admin Login' : 'User Login'}</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="form-group password-input-container">
                        <label>Password:</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                            <button 
                                type="button" 
                                className="password-toggle-btn"
                                onClick={togglePasswordVisibility}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                        </div>
                    </div>
                    <div className="forgot-password-link">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
                <div className="login-footer">
                    {isAdminLogin ? (
                        <p>Not an admin? <Link to="/user-login">Login as User</Link></p>
                    ) : (
                        <p>Admin? <Link to="/admin-login">Login as Admin</Link></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage; 