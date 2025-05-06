const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Invoice = require('../models/Invoice');
const Product = require('../models/Product');

// Get dashboard stats
router.get('/stats', auth, async (req, res) => {
    try {
        const totalSales = await Invoice.aggregate([
            { $group: { _id: null, total: { $sum: "$total" } } }
        ]);

        const stats = {
            totalSales: totalSales[0]?.total || 0,
            totalOrders: await Invoice.countDocuments(),
            activeUsers: await User.countDocuments({ status: 'active' }),
            totalProducts: await Product.countDocuments()
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Error fetching dashboard stats' });
    }
});

// Get recent users
router.get('/recent-users', auth, async (req, res) => {
    try {
        const users = await User.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('-password');

        res.json(users);
    } catch (error) {
        console.error('Error fetching recent users:', error);
        res.status(500).json({ message: 'Error fetching recent users' });
    }
});

// Add this route to your existing admin.js
router.get('/invoices', auth, async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate('userId', 'name email')  // Get user details
            .sort({ createdAt: -1 });  // Sort by newest first
        
        res.json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ message: 'Error fetching invoice history' });
    }
});

// Add this to your existing admin.js routes

router.get('/sales-data', auth, async (req, res) => {
    try {
        // Get monthly sales data
        const monthlySales = await Invoice.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" }
                    },
                    amount: { $sum: "$total" },
                    orders: { $sum: 1 },
                    itemsSold: { $sum: { $size: "$items" } }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            {
                $project: {
                    date: {
                        $concat: [
                            { $toString: "$_id.year" },
                            "-",
                            { $toString: "$_id.month" }
                        ]
                    },
                    amount: 1,
                    orders: 1,
                    itemsSold: 1
                }
            }
        ]);

        // Get daily sales data (last 30 days)
        const dailySales = await Invoice.aggregate([
            {
                $match: {
                    date: { $gte: new Date(Date.now() - 30*24*60*60*1000) }
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
                    },
                    amount: { $sum: "$total" },
                    orders: { $sum: 1 },
                    itemsSold: { $sum: { $size: "$items" } }
                }
            },
            { $sort: { "_id.date": 1 } },
            {
                $project: {
                    date: "$_id.date",
                    amount: 1,
                    orders: 1,
                    itemsSold: 1
                }
            }
        ]);

        // Get yearly sales data
        const yearlySales = await Invoice.aggregate([
            {
                $group: {
                    _id: { year: { $year: "$date" } },
                    amount: { $sum: "$total" },
                    orders: { $sum: 1 },
                    itemsSold: { $sum: { $size: "$items" } }
                }
            },
            { $sort: { "_id.year": 1 } },
            {
                $project: {
                    date: { $toString: "$_id.year" },
                    amount: 1,
                    orders: 1,
                    itemsSold: 1
                }
            }
        ]);

        res.json({
            daily: dailySales,
            monthly: monthlySales,
            yearly: yearlySales
        });
    } catch (error) {
        console.error('Error fetching sales data:', error);
        res.status(500).json({ message: 'Error fetching sales data' });
    }
});

module.exports = router; 