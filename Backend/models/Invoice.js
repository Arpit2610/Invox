const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    customerDetails: {
        name: String,
        email: String,
        phoneNo: String,
        address: String,
        userId: String
    },
    items: [{
        name: String,
        quantity: Number,
        price: Number,
        subtotal: Number
    }],
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        default: 'Cash'
    },
    notes: String
});

module.exports = mongoose.model('Invoice', InvoiceSchema); 