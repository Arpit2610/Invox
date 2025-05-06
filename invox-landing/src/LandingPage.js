import React from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaChartLine, FaFileInvoice } from 'react-icons/fa';
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <nav className="navbar">
                <div className="navbar-logo">
                    <h1>INVOX</h1>
                </div>
                <div className="navbar-links">
                    <Link to="/select-role">Login</Link>
                    <Link to="/signup" className="signup-btn">Sign Up</Link>
                </div>
            </nav>

            <main className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1>Inventory Management<br />Reimagined</h1>
                        <p>Streamline your business operations with our powerful inventory and invoice management system.</p>
                        <div className="hero-buttons">
                            <Link to="/signup" className="primary-btn">Get Started</Link>
                            <Link to="/about" className="secondary-btn">Learn More</Link>
                        </div>
                    </div>
                    <div className="hero-animation">
                        <div className="hero-icon">
                            <FaBoxOpen />
                            <div className="icon-circle"></div>
                        </div>
                    </div>
                </div>
            </main>

            <section className="features-section">
                <h2>Why Choose Invox?</h2>
                <div className="features-grid">
                    <div className="feature">
                        <div className="feature-icon">
                            <FaChartLine />
                        </div>
                        <h3>Real-time Tracking</h3>
                        <p>Monitor your inventory levels in real-time with accurate data and instant updates.</p>
                    </div>
                    <div className="feature">
                        <div className="feature-icon">
                            <FaFileInvoice />
                        </div>
                        <h3>Invoice Generation</h3>
                        <p>Create professional invoices instantly with our automated billing system.</p>
                    </div>
                    <div className="feature">
                        <div className="feature-icon">
                            <FaBoxOpen />
                        </div>
                        <h3>Customer Management</h3>
                        <p>Manage customer relationships effectively with detailed profiles and history.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
