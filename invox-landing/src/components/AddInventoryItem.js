import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddInventoryItem.css';

const AddInventoryItem = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        price: '',
        category: '',
        description: '',
        userId: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const response = await axios.get('http://localhost:5000/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (err) {
            setError('Failed to fetch users');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            await axios.post('http://localhost:5000/api/inventory', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSuccess('Item added successfully!');
            setFormData({
                name: '',
                quantity: '',
                price: '',
                category: '',
                description: '',
                userId: ''
            });
        } catch (err) {
            setError('Failed to add item');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="add-inventory-container">
            <h2>Add New Inventory Item</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <form onSubmit={handleSubmit} className="add-inventory-form">
                <div className="form-group">
                    <label>Item Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        min="0"
                    />
                </div>

                <div className="form-group">
                    <label>Price (₹)</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                    />
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Assign to User</label>
                    <select
                        name="userId"
                        value={formData.userId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select User</option>
                        {users.map(user => (
                            <option key={user._id} value={user._id}>
                                {user.name} ({user.email})
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Item'}
                </button>
            </form>
        </div>
    );
};

export default AddInventoryItem; 