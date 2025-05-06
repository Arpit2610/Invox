import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';

const SignupPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user'
    });

    const [error, setError] = useState('');

    const validEmailDomains = ['@gmail.com', '@yahoo.com', '@outlook.com', '@hotmail.com', '@chitkara.edu.in'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'name') {
            const sanitizedValue = value.replace(/[^A-Za-z]/g, '');
            setFormData(prevState => ({
                ...prevState,
                [name]: sanitizedValue
            }));
            return;
        }

        if (name === 'email') {
            const sanitizedValue = value.replace(/[^a-zA-Z0-9@._-]/g, '');
            setFormData(prevState => ({
                ...prevState,
                [name]: sanitizedValue.toLowerCase()
            }));
            return;
        }

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateEmail = (email) => {
        if (!email.includes('@')) return false;
        return validEmailDomains.some(domain => email.toLowerCase().endsWith(domain));
    };

    const validateName = (name) => {
        return name.length >= 2 && /^[A-Za-z]+$/.test(name);
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const errors = [];
        if (password.length < minLength) errors.push(`Password must be at least ${minLength} characters long`);
        if (!hasUpperCase) errors.push('Password must contain at least one uppercase letter');
        if (!hasLowerCase) errors.push('Password must contain at least one lowercase letter');
        if (!hasNumbers) errors.push('Password must contain at least one number');
        if (!hasSpecialChar) errors.push('Password must contain at least one special character');

        return {
            isValid: errors.length === 0,
            errors
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateName(formData.name)) {
            setError('Name must contain only letters and be at least 2 characters long');
            return;
        }

        if (!validateEmail(formData.email)) {
            setError('Please use a valid email domain (Gmail, Yahoo, Outlook, Hotmail, or Chitkara)');
            return;
        }

        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            setError(passwordValidation.errors.join('\n'));
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Registration successful as ${formData.role.toUpperCase()}`);
                navigate(formData.role === 'admin' ? '/admin-login' : '/user-login');
            } else {
                setError(data.msg || 'Registration failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
            setError('An error occurred during registration');
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-container">
                <h2>Create Account</h2>
                <p className="signup-subtitle">Sign up to get started</p>

                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name (letters only)"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="6"
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            minLength="6"
                        />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button 
                        type="submit" 
                        className="btn primary-btn"
                        disabled={!formData.name || !formData.email || !formData.password || !formData.confirmPassword}
                    >
                        Sign Up
                    </button>
                </form>
                <p className="login-link">
                    Already have an account? <a href="/select-role">Login</a>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
