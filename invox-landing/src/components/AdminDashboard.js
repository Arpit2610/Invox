import React, { useState, useEffect } from 'react';
import { FaUsers, FaBoxes, FaSignOutAlt, FaWarehouse, FaFileInvoice } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import StockManager from './StockManager';
import OrderHistory from './OrderHistory';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState('stocklist');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const renderContent = () => {
        switch(activeSection) {
            case 'stocklist':
                return <StockManager />;
            case 'orders':
                return <OrderHistory />;
            default:
                return null;
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="sidebar">
                <div className="logo-section">
                    <h2>Admin Panel</h2>
                </div>
                <nav className="nav-menu">
                    <button
                        className={`nav-item ${activeSection === 'stocklist' ? 'active' : ''}`}
                        onClick={() => setActiveSection('stocklist')}
                    >
                        <FaWarehouse /> <span>Stock List</span>
                    </button>
                    <button
                        className={`nav-item ${activeSection === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveSection('orders')}
                    >
                        <FaFileInvoice /> <span>Orders History</span>
                    </button>
                </nav>
                <button className="logout-button" onClick={handleLogout}>
                    <FaSignOutAlt /> <span>Logout</span>
                </button>
            </div>
            <main className="main-content">
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboard; 