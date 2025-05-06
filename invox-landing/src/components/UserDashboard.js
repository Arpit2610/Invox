import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaShoppingCart, FaFileInvoice } from 'react-icons/fa';
import InvoiceGenerator from './InvoiceGenerator';
import './UserDashboard.css';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState(() => {
        return localStorage.getItem('userDashboardSection') || 'shop';
    });
    const [inventory, setInventory] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchInventory();
    }, []);

    useEffect(() => {
        localStorage.setItem('userDashboardSection', activeSection);
    }, [activeSection]);

    const fetchInventory = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const response = await axios.get('http://localhost:5000/api/inventory/available', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setInventory(response.data);
        } catch (err) {
            setError('Failed to fetch inventory');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (item) => {
        if (item.quantity <= 0) {
            alert('This item is out of stock');
            return;
        }

        const existingItem = cart.find(cartItem => cartItem._id === item._id);
        if (existingItem) {
            // Check if adding one more would exceed available quantity
            if (existingItem.quantity + 1 > item.quantity) {
                alert(`Sorry, only ${item.quantity} items available in stock`);
                return;
            }
            setCart(cart.map(cartItem => 
                cartItem._id === item._id 
                    ? {...cartItem, quantity: cartItem.quantity + 1}
                    : cartItem
            ));
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('userDashboardSection');
        navigate('/');
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
        localStorage.setItem('userDashboardSection', section);
    };

    const renderContent = () => {
        switch(activeSection) {
            case 'shop':
                return (
                    <div className="shop-section">
                        <h2>Available Items</h2>
                        <div className="inventory-grid">
                            {inventory.map(item => (
                                <div key={item._id} className="inventory-item">
                                    <h3>{item.name}</h3>
                                    <p>Price: ₹{item.price}</p>
                                    <p>Available: {item.quantity}</p>
                                    <button 
                                        onClick={() => addToCart(item)}
                                        className="add-to-cart-btn"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'invoice':
                return <InvoiceGenerator cart={cart} setCart={setCart} />;
            default:
                return null;
        }
    };

    return (
        <div className="user-dashboard">
            <div className="sidebar">
                <div className="logo-section">
                    <h2>User Panel</h2>
                </div>
                <nav className="nav-menu">
                    <button
                        className={`nav-item ${activeSection === 'shop' ? 'active' : ''}`}
                        onClick={() => handleSectionChange('shop')}
                    >
                        <FaShoppingCart /> <span>Shop</span>
                    </button>
                    <button
                        className={`nav-item ${activeSection === 'invoice' ? 'active' : ''}`}
                        onClick={() => handleSectionChange('invoice')}
                    >
                        <FaFileInvoice /> <span>Generate Invoice ({cart.length})</span>
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

export default UserDashboard; 