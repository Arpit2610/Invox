import React, { useState, useContext } from 'react';
import { InventoryContext } from './InventoryContext';
import { FaShoppingCart, FaCheck } from 'react-icons/fa';
import './InventoryManager.css';

const InventoryManager = () => {
    const { inventory, addToCart, cart } = useContext(InventoryContext);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', ...new Set(inventory.map(item => item.category))];

    const filteredInventory = selectedCategory === 'All'
        ? inventory
        : inventory.filter(item => item.category === selectedCategory);

    const isItemInCart = (itemId) => {
        return cart.some(cartItem => cartItem.id === itemId);
    };

    const handleAddToCart = (item) => {
        addToCart(item, 1);
    };

    // Function to format price in Indian Rupees
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    };

    return (
        <div className="inventory-manager">
            <div className="category-filter">
                {categories.map(category => (
                    <button
                        key={category}
                        className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>
            
            <div className="inventory-grid">
                {filteredInventory.map(item => (
                    <div key={item.id} className="inventory-card">
                        <div className="item-details">
                            <h3>{item.name}</h3>
                            <p className="category">{item.category}</p>
                            <p className="description">{item.description}</p>
                            <p className="price">{formatPrice(item.price)}</p>
                            <p className="stock">In Stock: {item.quantity}</p>
                        </div>
                        <button 
                            className={`add-to-cart-btn ${isItemInCart(item.id) ? 'in-cart' : ''}`}
                            onClick={() => handleAddToCart(item)}
                            disabled={item.quantity === 0 || isItemInCart(item.id)}
                        >
                            {isItemInCart(item.id) ? (
                                <>
                                    <FaCheck /> Added to Cart
                                </>
                            ) : (
                                <>
                                    <FaShoppingCart /> Add to Cart
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InventoryManager;
