import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Card, Row, Col, Button, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { InventoryContext } from '../InventoryContext';
import './Shop.css';

const { Title } = Typography;

const Shop = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useContext(InventoryContext);

    useEffect(() => {
        fetchShopItems();
    }, []);

    const fetchShopItems = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('user'));
            console.log('User info:', userInfo);

            if (!userInfo || !userInfo.token) {
                message.error('Please login to view shop items');
                navigate('/user-login');
                return;
            }

            const response = await axios.get('http://localhost:5000/api/inventory/all', {
                headers: { 
                    'Authorization': `Bearer ${userInfo.token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            setItems(response.data);
        } catch (error) {
            console.error('Shop fetch error:', error);
            message.error('Failed to fetch shop items');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (item) => {
        try {
            addToCart({
                id: item._id,
                name: item.name,
                price: item.price,
                quantity: 1,
                maxQuantity: item.quantity
            });
            message.success(`${item.name} added to cart`);
        } catch (error) {
            message.error('Failed to add item to cart');
        }
    };

    return (
        <div className="shop-container">
            <div className="shop-header">
                <Title level={2} className="section-title">
                    Newly Added Items
                </Title>
                <div className="header-description">
                    Check out our latest products added to the inventory
                </div>
            </div>
            <Row gutter={[32, 32]} className="shop-items-grid">
                {items.map(item => (
                    <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
                        <Card 
                            title={item.name}
                            loading={loading}
                            className="shop-card"
                        >
                            <p>{item.description}</p>
                            <p>Price: ₹{item.price}</p>
                            <p>Available: {item.quantity}</p>
                            <Button 
                                type="primary" 
                                block
                                onClick={() => handleAddToCart(item)}
                                disabled={item.quantity <= 0}
                            >
                                Add to Cart
                            </Button>
                        </Card>
                    </Col>
                ))}
                {!loading && items.length === 0 && (
                    <div className="no-items">
                        <p>No items available in the shop</p>
                    </div>
                )}
            </Row>
        </div>
    );
};

export default Shop; 