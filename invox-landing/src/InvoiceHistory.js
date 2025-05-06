import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaDownload } from 'react-icons/fa';
import './InvoiceHistory.css';

const InvoiceHistory = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('user'));
            if (!userInfo || !userInfo.token) {
                setError('Please login to view invoice history');
                setLoading(false);
                return;
            }

            const response = await axios.get('http://localhost:5000/api/invoices/history', {
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`,
                    'Accept': 'application/json'
                },
                validateStatus: function (status) {
                    return status < 500; // Resolve only if the status code is less than 500
                }
            });

            if (response.status === 200) {
                setInvoices(response.data);
            } else if (response.status === 401) {
                setError('Session expired. Please login again.');
                // Optionally redirect to login page or clear invalid token
                localStorage.removeItem('user');
            } else {
                setError(response.data.message || 'Failed to fetch invoices');
            }
        } catch (error) {
            console.error('Error fetching invoices:', error);
            if (error.response?.status === 401) {
                setError('Please login again');
                localStorage.removeItem('user');
            } else {
                setError('Failed to connect to the server');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (invoiceId) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('user'));
            if (!userInfo || !userInfo.token) {
                throw new Error('Please login to download invoices');
            }

            const response = await axios.get(
                `http://localhost:5000/api/invoices/download/${invoiceId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${userInfo.token}`
                    },
                    responseType: 'blob'
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${invoiceId}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading invoice:', error);
            alert(error.message || 'Failed to download invoice');
        }
    };

    if (loading) {
        return <div className="loading">Loading invoice history...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (invoices.length === 0) {
        return <div className="no-invoices">No invoices found. Generate some invoices first!</div>;
    }

    return (
        <div className="invoice-history">
            <h2>Invoice History</h2>
            <div className="invoice-list">
                {invoices.map(invoice => (
                    <div key={invoice._id} className="invoice-card">
                        <div className="invoice-header">
                            <h3>Invoice #{invoice.invoiceNumber}</h3>
                            <span className="date">
                                {new Date(invoice.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="invoice-items">
                            {invoice.items.map((item, index) => (
                                <div key={index} className="invoice-item">
                                    <span>{item.name}</span>
                                    <span>{item.quantity} x ₹{item.price}</span>
                                </div>
                            ))}
                        </div>
                        <div className="invoice-footer">
                            <span className="total">Total: ₹{invoice.total.toFixed(2)}</span>
                            <button 
                                className="download-btn"
                                onClick={() => handleDownload(invoice._id)}
                            >
                                <FaDownload /> Download
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InvoiceHistory; 