import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Card, Spin, Alert } from 'antd';
import './AdminAnalytics.css';

const AdminAnalytics = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchInvoiceHistory();
    }, []);

    const fetchInvoiceHistory = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const response = await axios.get('http://localhost:5000/api/admin/invoices', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setInvoices(response.data);
        } catch (err) {
            setError('Failed to fetch invoice history');
            console.error('Error fetching invoices:', err);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Invoice ID',
            dataIndex: 'invoiceNumber',
            key: 'invoiceNumber',
        },
        {
            title: 'User Name',
            dataIndex: ['userId', 'name'],
            key: 'userName',
        },
        {
            title: 'User Email',
            dataIndex: ['userId', 'email'],
            key: 'userEmail',
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'date',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Items',
            dataIndex: 'items',
            key: 'items',
            render: (items) => (
                <ul className="items-list">
                    {items.map((item, index) => (
                        <li key={index}>
                            {item.name} x {item.quantity} - ₹{item.price}
                        </li>
                    ))}
                </ul>
            ),
        },
        {
            title: 'Total Amount',
            dataIndex: 'total',
            key: 'total',
            render: (total) => `₹${total.toFixed(2)}`,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <span className={`status-badge ${status.toLowerCase()}`}>
                    {status}
                </span>
            ),
        }
    ];

    if (loading) return <Spin size="large" className="loading-spinner" />;
    if (error) return <Alert message={error} type="error" />;

    return (
        <div className="admin-analytics">
            <h2>Invoice Analytics</h2>
            <div className="stats-cards">
                <Card className="stat-card">
                    <h3>Total Invoices</h3>
                    <p>{invoices.length}</p>
                </Card>
                <Card className="stat-card">
                    <h3>Total Revenue</h3>
                    <p>₹{invoices.reduce((sum, invoice) => sum + invoice.total, 0).toFixed(2)}</p>
                </Card>
                <Card className="stat-card">
                    <h3>Unique Customers</h3>
                    <p>{new Set(invoices.map(invoice => invoice.userId._id)).size}</p>
                </Card>
            </div>
            <Table 
                columns={columns} 
                dataSource={invoices}
                rowKey="_id"
                className="invoices-table"
            />
        </div>
    );
};

export default AdminAnalytics; 