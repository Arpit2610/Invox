import React, { useState, useContext, useEffect } from 'react';
import { InventoryContext } from './InventoryContext';
import './CustomerDetails.css';

const CustomerDetails = () => {
    const { customers, addCustomer } = useContext(InventoryContext);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        company: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addCustomer(formData);
        setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
            company: ''
        });
    };

    return (
        <div className="customer-details-container">
            <div className="customer-form-section">
                <h3>Add New Customer</h3>
                <form onSubmit={handleSubmit} className="customer-form">
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
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
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Company</label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        Add Customer
                    </button>
                </form>
            </div>
            <div className="customers-list-section">
                <h3>Customer List</h3>
                <div className="customers-grid">
                    {customers.map(customer => (
                        <div key={customer.id} className="customer-card">
                            <h4>{customer.name}</h4>
                            <p>{customer.company}</p>
                            <p>{customer.email}</p>
                            <p>{customer.phone}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomerDetails;
