import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import './UserInventory.css';

const UserInventory = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAvailableItems();
    }, []);

    const fetchAvailableItems = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/inventory/available');
            setItems(res.data);
        } catch (err) {
            setError('Failed to fetch inventory items');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="user-inventory">
            <h2>Available Items</h2>
            <div className="items-grid">
                {items.map(item => (
                    <div key={item._id} className="item-card">
                        <h3>{item.name}</h3>
                        <div className="item-details">
                            <p className="price">₹{item.price.toFixed(2)}</p>
                            <p className="quantity">In Stock: {item.quantity}</p>
                            <p className="category">{item.category}</p>
                        </div>
                        <p className="description">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserInventory; 