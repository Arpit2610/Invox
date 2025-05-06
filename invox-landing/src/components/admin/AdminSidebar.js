import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    DashboardOutlined,
    StockOutlined,
    LogoutOutlined,
    BarChartOutlined
} from '@ant-design/icons';

const AdminSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        {
            path: '/admin/dashboard',
            icon: <DashboardOutlined className="menu-icon" />,
            text: 'Dashboard'
        },
        {
            path: '/admin/inventory',
            icon: <StockOutlined className="menu-icon" />,
            text: 'Inventory'
        },
        {
            path: '/admin/analytics',
            icon: <BarChartOutlined className="menu-icon" />,
            text: 'Analytics'
        }
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="admin-sidebar">
            <div className="logo">
                <h1>INVOX</h1>
            </div>
            <ul className="admin-menu">
                {menuItems.map((item) => (
                    <li key={item.path} className="menu-item">
                        <Link
                            to={item.path}
                            className={`menu-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span className="menu-text">{item.text}</span>
                        </Link>
                    </li>
                ))}
            </ul>
            <button className="logout-button" onClick={handleLogout}>
                <LogoutOutlined className="logout-icon" />
                Logout
            </button>
        </div>
    );
};

export default AdminSidebar; 