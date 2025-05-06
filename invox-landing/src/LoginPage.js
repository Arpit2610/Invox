import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    
    const isAdminLogin = location.pathname === '/admin-login';

    useEffect(() => {
        // Clear any stored user data on login page load
        localStorage.removeItem('user');
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    expectedRole: isAdminLogin ? 'admin' : 'user'
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Strict role validation
                if ((isAdminLogin && data.role !== 'admin') || 
                    (!isAdminLogin && data.role !== 'user')) {
                    setError(`Please use the ${data.role} login page`);
                    return;
                }

                localStorage.setItem('user', JSON.stringify(data));
                
                // Redirect based on role
                if (data.role === 'admin') {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/user-dashboard');
                }
            } else {
                setError(data.msg || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-box">
                <h2>{isAdminLogin ? 'Admin Login' : 'User Login'}</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                <div className="login-footer">
                    {isAdminLogin ? (
                        <p>Not an admin? <a href="/user-login">Login as User</a></p>
                    ) : (
                        <p>Admin? <a href="/admin-login">Login as Admin</a></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
