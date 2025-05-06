import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Tag, Spin, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import './OrderHistory.css';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const response = await axios.get('http://localhost:5000/api/invoices/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('Fetched orders:', response.data); // Debug log
            setOrders(response.data);
        } catch (error) {
            message.error('Failed to fetch orders');
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadInvoice = async (invoiceId) => {
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const response = await fetch(
                `http://localhost:5000/api/invoices/generate/${invoiceId}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (!response.ok) throw new Error('Failed to download invoice');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${invoiceId}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            message.error('Failed to download invoice');
            console.error('Error downloading invoice:', error);
        }
    };

    const columns = [
        {
            title: 'Invoice Number',
            dataIndex: 'invoiceNumber',
            key: 'invoiceNumber',
        },
        {
            title: 'User',
            dataIndex: ['userId', 'name'],  // Changed from customerDetails to userId
            key: 'userName',
        },
        {
            title: 'Email',
            dataIndex: ['userId', 'email'],  // Changed from customerDetails to userId
            key: 'userEmail',
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'date',
            render: (date) => new Date(date).toLocaleDateString(),
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
                <Tag color={status === 'completed' ? 'green' : 'orange'}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownloadInvoice(record._id)}
                >
                    Download
                </Button>
            ),
        },
    ];

    if (loading) return <Spin size="large" />;

    return (
        <div className="order-history">
            <Card title="Orders History">
                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="_id"
                    expandable={{
                        expandedRowRender: (record) => (
                            <div className="order-items">
                                <h4>Order Items:</h4>
                                <Table
                                    columns={[
                                        { title: 'Item', dataIndex: 'name' },
                                        { title: 'Quantity', dataIndex: 'quantity' },
                                        { 
                                            title: 'Price', 
                                            dataIndex: 'price',
                                            render: (price) => `₹${price.toFixed(2)}`
                                        },
                                        { 
                                            title: 'Subtotal', 
                                            dataIndex: 'subtotal',
                                            render: (subtotal) => `₹${subtotal.toFixed(2)}`
                                        },
                                    ]}
                                    dataSource={record.items}
                                    pagination={false}
                                />
                            </div>
                        ),
                    }}
                />
            </Card>
        </div>
    );
};

export default OrderHistory; 