const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Stock = require('../models/Stock');

// Get all stock items (admin only)
router.get('/all', auth, admin, async (req, res) => {
    try {
        const stocks = await Stock.find().sort({ category: 1 });
        res.json(stocks);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Add new stock item
router.post('/add', auth, admin, async (req, res) => {
    try {
        const newStock = new Stock(req.body);
        const stock = await newStock.save();
        res.json(stock);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Update stock item
router.put('/:id', auth, admin, async (req, res) => {
    try {
        const stock = await Stock.findByIdAndUpdate(
            req.params.id,
            { ...req.body, lastUpdated: Date.now() },
            { new: true }
        );
        res.json(stock);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Delete stock item
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        await Stock.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Stock item removed' });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Get user's stocks
router.get('/:userId', auth, admin, async (req, res) => {
  try {
    const stocks = await Stock.find({ user: req.params.userId });
    res.json(stocks);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Update stock quantity
router.put('/:stockId', auth, admin, async (req, res) => {
  try {
    const stock = await Stock.findByIdAndUpdate(
      req.params.stockId,
      { quantity: req.body.quantity },
      { new: true }
    );
    res.json(stock);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

module.exports = router; 