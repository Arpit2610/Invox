import React, { useContext, useState, useEffect, useRef } from 'react';
import { InventoryContext } from './InventoryContext';
import { FaTrash } from 'react-icons/fa';
import './InvoiceGenerator.css';

const InvoiceGenerator = () => {
    const { cart, clearCart, calculateCartTotal, removeFromCart, updateCartItemQuantity } = useContext(InventoryContext);
    const [generating, setGenerating] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const paypalRef = useRef();
    const buttonRendered = useRef(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUserInfo(user.user);
        }
    }, []);

    useEffect(() => {
        if (window.paypal && !buttonRendered.current && paypalRef.current) {
            buttonRendered.current = true;

            paypalRef.current.innerHTML = '';

            window.paypal.Buttons({
                createOrder: (data, actions) => {
                    const currentTotal = calculateCartTotal();
                    if (currentTotal <= 0) {
                        alert('Please add items to cart first');
                        return;
                    }
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: currentTotal.toFixed(2),
                                currency_code: 'USD'
                            },
                            description: 'Invoice Generation Payment'
                        }]
                    });
                },
                onApprove: async (data, actions) => {
                    setProcessing(true);
                    try {
                        const order = await actions.order.capture();
                        console.log('Payment successful:', order);
                        await handleGenerateInvoice(order);
                        clearCart();
                        alert('Payment successful and invoice generated!');
                    } catch (error) {
                        console.error('Payment error:', error);
                        alert('Payment failed: ' + error.message);
                    } finally {
                        setProcessing(false);
                    }
                },
                onError: (err) => {
                    console.error('PayPal error:', err);
                    alert('Payment failed. Please try again.');
                },
                onCancel: () => {
                    console.log('Payment cancelled');
                }
            }).render(paypalRef.current);
        }
    }, []);

    const handleRemoveItem = (itemId) => {
        removeFromCart(itemId);
    };

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity > 0) {
            updateCartItemQuantity(itemId, parseInt(newQuantity));
        }
    };

    const handleGenerateInvoice = async (paymentDetails) => {
        setGenerating(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('user'));
            if (!userInfo || !userInfo.token) {
                throw new Error('No authentication token found');
            }

            const createResponse = await fetch('http://localhost:5000/api/invoices/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`
                },
                body: JSON.stringify({
                    items: cart.map(item => ({
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    total: calculateCartTotal(),
                    paymentDetails: paymentDetails
                })
            });

            if (!createResponse.ok) {
                throw new Error('Failed to create invoice');
            }

            const { invoiceId } = await createResponse.json();

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
        } catch (error) {
            console.error('Error generating invoice:', error);
            throw error;
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="invoice-generator">
            {userInfo && (
                <div className="user-info">
                    <h3>Invoice Details</h3>
                    <p>Name: {userInfo.name}</p>
                    <p>Email: {userInfo.email}</p>
                </div>
            )}

            <div className="cart-items">
                <h3>Cart Items</h3>
                {cart.length === 0 ? (
                    <p className="empty-cart">No items in cart. Add items from inventory.</p>
                ) : (
                    cart.map((item, index) => (
                        <div key={index} className="cart-item">
                            <span className="item-name">{item.name}</span>
                            <div className="item-controls">
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                    className="quantity-input"
                                />
                                <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                                <button 
                                    className="remove-item-btn"
                                    onClick={() => handleRemoveItem(item.id)}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            <div className="invoice-summary">
                <div className="total">
                    <span>Total Amount:</span>
                    <span>₹{calculateCartTotal().toFixed(2)}</span>
                </div>
                {cart.length > 0 && (
                    <div ref={paypalRef} className="paypal-button-container" />
                )}
            </div>
        </div>
    );
};

export default InvoiceGenerator;
