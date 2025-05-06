import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import './AdminInventory.css';

const AdminInventory = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        price: '',
        category: '',
        description: ''
    });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const response = await axios.get('http://localhost:5000/api/inventory/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setItems(response.data);
        } catch (err) {
            setError('Failed to fetch inventory');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            if (editItem) {
                await axios.put(`http://localhost:5000/api/inventory/${editItem._id}`, formData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } else {
                await axios.post('http://localhost:5000/api/inventory', formData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }
            setShowForm(false);
            setEditItem(null);
            setFormData({
                name: '',
                quantity: '',
                price: '',
                category: '',
                description: ''
            });
            fetchInventory();
        } catch (err) {
            setError('Failed to save item');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                const token = JSON.parse(localStorage.getItem('user'))?.token;
                await axios.delete(`http://localhost:5000/api/inventory/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                fetchInventory();
            } catch (err) {
                setError('Failed to delete item');
            }
        }
    };

    const handleEdit = (item) => {
        setEditItem(item);
        setFormData({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            category: item.category,
            description: item.description || ''
        });
        setShowForm(true);
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="admin-inventory">
            <div className="inventory-header">
                <h2>Inventory Management</h2>
                <button 
                    className="add-button"
                    onClick={() => setShowForm(true)}
                >
                    <FaPlus /> Add New Item
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {showForm && (
                <div className="form-overlay">
                    <div className="inventory-form">
                        <h3>{editItem ? 'Edit Item' : 'Add New Item'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Quantity</label>
                                <input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                                    required
                                    min="0"
                                />
                            </div>
                            <div className="form-group">
                                <label>Price (₹)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="save-button">
                                    {editItem ? 'Update Item' : 'Add Item'}
                                </button>
                                <button 
                                    type="button" 
                                    className="cancel-button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditItem(null);
                                        setFormData({
                                            name: '',
                                            quantity: '',
                                            price: '',
                                            category: '',
                                            description: ''
                                        });
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="inventory-table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item._id}>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>₹{item.price.toFixed(2)}</td>
                                <td>{item.category}</td>
                                <td>
                                    <span className={`status ${item.quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                        {item.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </td>
                                <td>
                                    <button 
                                        className="edit-button"
                                        onClick={() => handleEdit(item)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        className="delete-button"
                                        onClick={() => handleDelete(item._id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminInventory; 