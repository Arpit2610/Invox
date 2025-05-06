import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './StockItemsManager.css';

const StockItemsManager = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        price: '',
        category: '',
        description: ''
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const response = await axios.get('http://localhost:5000/api/inventory/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setItems(response.data);
        } catch (err) {
            setError('Failed to fetch items');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            if (editingItem) {
                await axios.put(`http://localhost:5000/api/inventory/${editingItem._id}`, formData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } else {
                await axios.post('http://localhost:5000/api/inventory/add', formData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }
            setShowForm(false);
            setEditingItem(null);
            setFormData({
                name: '',
                quantity: '',
                price: '',
                category: '',
                description: ''
            });
            fetchItems();
        } catch (err) {
            setError('Failed to save item');
        }
    };

    return (
        <div className="stock-items-manager">
            <div className="header">
                <h2>Stock Items Management</h2>
                <button className="add-button" onClick={() => setShowForm(true)}>
                    <FaPlus /> Add New Item
                </button>
            </div>

            {showForm && (
                <div className="form-overlay">
                    <div className="item-form">
                        <h3>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
                        <form onSubmit={handleSubmit}>
                            {/* Form fields */}
                        </form>
                    </div>
                </div>
            )}

            <div className="items-table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Category</th>
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
                                <td className="actions">
                                    <button onClick={() => handleEdit(item)}>
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleDelete(item._id)}>
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

export default StockItemsManager; 