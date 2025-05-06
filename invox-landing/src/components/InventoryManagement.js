import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import './InventoryManagement.css';

const InventoryManagement = ({ userMode = false }) => {
    const [items, setItems] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [newItem, setNewItem] = useState({
        name: '',
        quantity: '',
        price: '',
        category: '',
        description: ''
    });
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        fetchInventory();
        if (userMode) {
            fetchUsers();
        }
    }, [userMode]);

    const fetchUsers = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const response = await axios.get('http://localhost:5000/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (err) {
            setError('Failed to fetch users');
            console.error(err);
        }
    };

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const endpoint = userMode && selectedUser
                ? `http://localhost:5000/api/inventory/user/${selectedUser}`
                : 'http://localhost:5000/api/inventory/admin/all';
            
            const response = await axios.get(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setItems(response.data);
        } catch (err) {
            setError('Failed to fetch inventory');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            if (editingItem) {
                await axios.put(`http://localhost:5000/api/inventory/${editingItem._id}`, newItem, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setEditingItem(null);
            } else {
                await axios.post('http://localhost:5000/api/inventory', newItem, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }
            setNewItem({
                name: '',
                quantity: '',
                price: '',
                category: '',
                description: ''
            });
            fetchInventory();
        } catch (err) {
            setError('Failed to save item');
            console.error(err);
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
                console.error(err);
            }
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setNewItem({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            category: item.category,
            description: item.description || ''
        });
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="inventory-management">
            {userMode && (
                <div className="user-selector">
                    <select
                        value={selectedUser}
                        onChange={(e) => {
                            setSelectedUser(e.target.value);
                            fetchInventory();
                        }}
                    >
                        <option value="">Select User</option>
                        {users.map(user => (
                            <option key={user._id} value={user._id}>
                                {user.name} ({user.email})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <form onSubmit={handleSubmit} className="inventory-form">
                <h3>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
                <div className="form-grid">
                    <input
                        type="text"
                        placeholder="Item Name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                        required
                        min="0"
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={newItem.price}
                        onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                        required
                        min="0"
                        step="0.01"
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        value={newItem.category}
                        onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                        required
                    />
                </div>
                <textarea
                    placeholder="Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                />
                {userMode && (
                    <select
                        value={newItem.userId}
                        onChange={(e) => setNewItem({...newItem, userId: e.target.value})}
                        required
                    >
                        <option value="">Select User</option>
                        {users.map(user => (
                            <option key={user._id} value={user._id}>
                                {user.name} ({user.email})
                            </option>
                        ))}
                    </select>
                )}
                <div className="form-actions">
                    <button type="submit" className="submit-btn">
                        {editingItem ? 'Update Item' : 'Add Item'}
                    </button>
                    {editingItem && (
                        <button 
                            type="button" 
                            className="cancel-btn"
                            onClick={() => {
                                setEditingItem(null);
                                setNewItem({
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
                    )}
                </div>
            </form>

            <div className="inventory-list">
                <h3>Current Inventory</h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Description</th>
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
                                    <td>{item.description}</td>
                                    <td className="actions">
                                        <button 
                                            className="edit-btn"
                                            onClick={() => handleEdit(item)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            className="delete-btn"
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
        </div>
    );
};

export default InventoryManagement; 