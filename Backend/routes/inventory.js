const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Inventory = require('../models/Inventory');
const User = require('../models/User');

// Get all inventory items (for both admin and users)
router.get('/all', auth, async (req, res) => {
    try {
        console.log('Fetching inventory items...'); // Debug log
        console.log('User:', req.user); // Debug log

        const items = await Inventory.find().sort({ createdAt: -1 });
        console.log('Found items:', items.length); // Debug log
        
        res.json(items);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ 
            message: 'Failed to fetch inventory items',
            error: error.message 
        });
    }
});

// Add new inventory item (admin only)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can add inventory items' });
        }

        const { name, description, price, quantity } = req.body;

        // Create new item
        const newItem = new Inventory({
            name,
            description,
            price: Number(price),
            quantity: Number(quantity),
            addedByAdmin: true
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        console.error('Error adding inventory item:', error);
        res.status(500).json({ 
            message: 'Failed to add inventory item',
            error: error.message
        });
    }
});

// Update inventory item (admin only)
router.put('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can update inventory items' });
        }

        const { name, description, price, quantity } = req.body;
        const updatedItem = await Inventory.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                price: Number(price),
                quantity: Number(quantity),
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json(updatedItem);
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ message: 'Failed to update item' });
    }
});

// Delete inventory item (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can delete inventory items' });
        }

        const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Failed to delete item' });
    }
});

// Get inventory items for users
router.get('/shop', auth, async (req, res) => {
    try {
        // Users can see all items since they're all added by admin
        const items = await Inventory.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        console.error('Error fetching shop items:', error);
        res.status(500).json({ message: 'Failed to fetch shop items' });
    }
});

module.exports = router; 