import React, { createContext, useState } from 'react';

export const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
    const [inventory, setInventory] = useState([
        {
            id: 1,
            name: "Laptop",
            quantity: 50,
            price: 45999,
            category: "Electronics",
            description: "High-performance laptop with 8GB RAM, 512GB SSD"
        },
        {
            id: 2,
            name: "Smartphone",
            quantity: 100,
            price: 15999,
            category: "Electronics",
            description: "Latest model smartphone with 128GB storage"
        },
        {
            id: 3,
            name: "Office Desk",
            quantity: 30,
            price: 8999,
            category: "Furniture",
            description: "Modern office desk with drawer storage"
        },
        {
            id: 4,
            name: "Office Chair",
            quantity: 50,
            price: 4999,
            category: "Furniture",
            description: "Ergonomic office chair with lumbar support"
        },
        {
            id: 5,
            name: "Wireless Mouse",
            quantity: 200,
            price: 999,
            category: "Electronics",
            description: "Wireless optical mouse with long battery life"
        },
        {
            id: 6,
            name: "Mechanical Keyboard",
            quantity: 75,
            price: 2499,
            category: "Electronics",
            description: "RGB mechanical gaming keyboard"
        },
        {
            id: 7,
            name: "Monitor",
            quantity: 40,
            price: 12999,
            category: "Electronics",
            description: "24-inch Full HD LED Monitor"
        },
        {
            id: 8,
            name: "Filing Cabinet",
            quantity: 25,
            price: 6999,
            category: "Furniture",
            description: "3-drawer metal filing cabinet"
        },
        {
            id: 9,
            name: "Desk Lamp",
            quantity: 60,
            price: 799,
            category: "Accessories",
            description: "LED desk lamp with adjustable brightness"
        },
        {
            id: 10,
            name: "Printer",
            quantity: 30,
            price: 18999,
            category: "Electronics",
            description: "All-in-one color printer with scanner"
        },
        {
            id: 11,
            name: "Headphones",
            quantity: 150,
            price: 1499,
            category: "Electronics",
            description: "Over-ear wireless headphones"
        },
        {
            id: 12,
            name: "Bookshelf",
            quantity: 20,
            price: 3999,
            category: "Furniture",
            description: "5-tier wooden bookshelf"
        }
    ]);
    
    const [cart, setCart] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [invoices, setInvoices] = useState([]);

    const addItem = (item) => {
        setInventory([...inventory, { ...item, id: Date.now() }]);
    };

    const updateItem = (id, updatedItem) => {
        setInventory(inventory.map(item => 
            item.id === id ? { ...item, ...updatedItem } : item
        ));
    };

    const deleteItem = (id) => {
        setInventory(inventory.filter(item => item.id !== id));
    };

    const addToCart = (item, quantity) => {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            setCart(cart.map(cartItem =>
                cartItem.id === item.id
                    ? { ...cartItem, quantity: cartItem.quantity + quantity }
                    : cartItem
            ));
        } else {
            setCart([...cart, { ...item, quantity }]);
        }
    };

    const removeFromCart = (itemId) => {
        setCart(cart.filter(item => item.id !== itemId));
    };

    const updateCartItemQuantity = (itemId, quantity) => {
        setCart(cart.map(item =>
            item.id === itemId ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => {
        setCart([]);
    };

    const calculateCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const addCustomer = (customer) => {
        setCustomers([...customers, { ...customer, id: Date.now() }]);
    };

    const addInvoice = (invoice) => {
        setInvoices([...invoices, { ...invoice, id: Date.now(), date: new Date() }]);
    };

    return (
        <InventoryContext.Provider value={{
            inventory,
            cart,
            customers,
            invoices,
            addItem,
            updateItem,
            deleteItem,
            addToCart,
            removeFromCart,
            updateCartItemQuantity,
            clearCart,
            calculateCartTotal,
            addCustomer,
            addInvoice
        }}>
            {children}
        </InventoryContext.Provider>
    );
};
