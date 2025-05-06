import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Divider } from 'antd';
import { FaTrash } from 'react-icons/fa';
import './InvoiceGenerator.css';

const InvoiceGenerator = ({ cart, setCart }) => {
    const [generating, setGenerating] = useState(false);
    const [form] = Form.useForm();
    const userInfo = JSON.parse(localStorage.getItem('user'))?.user;

    useEffect(() => {
        // Pre-fill and lock user details
        if (userInfo) {
            form.setFieldsValue({
                name: userInfo.name,
                email: userInfo.email
            });
        }
    }, [form, userInfo]);

    // Calculate cart total
    const calculateCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Remove item from cart
    const handleRemoveItem = (itemId) => {
        setCart(cart.filter(item => item._id !== itemId));
    };

    // Update item quantity
    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity > 0) {
            setCart(cart.map(item => 
                item._id === itemId 
                    ? { ...item, quantity: parseInt(newQuantity) }
                    : item
            ));
        }
    };

    const handleGenerateInvoice = async (values) => {
        if (cart.length === 0) {
            alert('Please add items to cart first');
            return;
        }

        setGenerating(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('user'));
            if (!userInfo || !userInfo.token) {
                throw new Error('No authentication token found');
            }

            // Create invoice
            const createResponse = await fetch('http://localhost:5000/api/invoices/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: JSON.stringify({
                    customerDetails: {
                        name: values.name,
                        email: values.email,
                        phoneNo: values.phoneNo,  // Make sure this matches the backend
                        address: values.address,
                        userId: userInfo.user.id
                    },
                    items: cart.map(item => ({
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        subtotal: item.price * item.quantity
                    })),
                    total: calculateCartTotal(),
                    paymentMethod: values.paymentMethod || 'Cash',
                    notes: values.notes
                })
            });

            if (!createResponse.ok) {
                const errorData = await createResponse.json();
                throw new Error(errorData.message || 'Failed to create invoice');
            }

            const { invoiceId } = await createResponse.json();

            // Generate PDF
            const pdfResponse = await fetch(`http://localhost:5000/api/invoices/generate/${invoiceId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`
                }
            });

            if (!pdfResponse.ok) {
                throw new Error('Failed to generate PDF');
            }

            const blob = await pdfResponse.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            // Clear cart after successful generation
            setCart([]);
            form.resetFields();
            alert('Invoice generated successfully!');
        } catch (error) {
            console.error('Error generating invoice:', error);
            alert(error.message || 'Failed to generate invoice');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="invoice-generator">
            <Card title="Generate Invoice" className="invoice-form-card">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleGenerateInvoice}
                >
                    <div className="form-sections">
                        <div className="customer-details">
                            <h3>User Details</h3>
                            <Form.Item name="name" label="Name">
                                <Input disabled />
                            </Form.Item>
                            <Form.Item name="email" label="Email">
                                <Input disabled />
                            </Form.Item>
                        </div>

                        <Divider />

                        <div className="cart-items">
                            <h3>Cart Items</h3>
                            {cart.length === 0 ? (
                                <p className="empty-cart">No items in cart. Add items from the shop.</p>
                            ) : (
                                cart.map((item) => (
                                    <div key={item._id} className="cart-item">
                                        <span className="item-name">{item.name}</span>
                                        <div className="item-controls">
                                            <Input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                                                className="quantity-input"
                                            />
                                            <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                                            <Button 
                                                type="text"
                                                danger
                                                icon={<FaTrash />}
                                                onClick={() => handleRemoveItem(item._id)}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <Divider />

                        <div className="additional-details">
                            <h3>Additional Details</h3>
                            <Form.Item name="paymentMethod" label="Payment Method">
                                <Input placeholder="Cash/Card/UPI" />
                            </Form.Item>
                            <Form.Item name="notes" label="Notes">
                                <Input.TextArea rows={4} placeholder="Any additional notes..." />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="invoice-summary">
                        <div className="total">
                            <span>Total Amount:</span>
                            <span>₹{calculateCartTotal().toFixed(2)}</span>
                        </div>
                        <Button 
                            type="primary"
                            htmlType="submit"
                            className="generate-btn"
                            disabled={cart.length === 0 || generating}
                            loading={generating}
                        >
                            {generating ? 'Generating...' : 'Generate Invoice'}
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default InvoiceGenerator; 