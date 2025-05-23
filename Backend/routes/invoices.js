const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Invoice = require('../models/Invoice');
const PDFDocument = require('pdfkit');

// Create invoice
router.post('/create', auth, async (req, res) => {
    try {
        const { items, total } = req.body;
        
        // Create invoice in database
        const invoice = new Invoice({
            invoiceNumber: `INV-${Date.now()}`,
            userId: req.user.id,
            items,
            total,
            status: 'pending'
        });
        
        await invoice.save();
        
        // Return the invoice ID
        res.json({ 
            message: 'Invoice created successfully',
            invoiceId: invoice._id,
            invoiceNumber: invoice.invoiceNumber
        });

    } catch (error) {
        console.error('Invoice creation error:', error);
        res.status(500).json({ message: 'Failed to create invoice', error: error.message });
    }
});

// Generate PDF for invoice
router.get('/generate/:invoiceId', auth, async (req, res) => {
    try {
        // Get both invoice and user details
        const invoice = await Invoice.findOne({ 
            _id: req.params.invoiceId,
            userId: req.user.id 
        });

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        // Get the logged-in user's details from the auth middleware
        const loggedInUserName = req.user.name;  // This comes from the auth token

        const doc = new PDFDocument({
            margin: 50,
            size: 'A4'
        });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);

        doc.pipe(res);

        // Header
        doc.fontSize(25)
           .font('Helvetica-Bold')
           .text('INVOX', 50, 57, { align: 'left' })
           .fontSize(10)
           .font('Helvetica')
           .text('Inventory Management System', 50, 87, { align: 'left' });

        // Company details on right
        doc.fontSize(10)
           .text('123 Business Street', 400, 57, { align: 'right' })
           .text('City, State, 12345', 400, 70, { align: 'right' })
           .text('Phone: (555) 123-4567', 400, 83, { align: 'right' })
           .text('Email: support@invox.com', 400, 96, { align: 'right' });

        // Separator line
        doc.moveTo(50, 120)
           .lineTo(550, 120)
           .stroke();

        // Invoice details on right
        doc.fontSize(10)
           .text(`Invoice Number: ${invoice.invoiceNumber}`, 400, 140)
           .text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 400, 155)
           .text(`Payment Method: ${invoice.paymentMethod}`, 400, 170);

        // User Information Box with role indicator
        doc.rect(50, 140, 300, 100)
           .fillAndStroke('#f6f6f6', '#cccccc');
        
        // Add role-specific styling
        const isAdmin = req.user.role === 'admin';
        const roleColor = isAdmin ? '#FF4444' : '#4CAF50';
        const roleText = isAdmin ? 'ADMIN GENERATED' : 'USER GENERATED';
        
        doc.fillColor('#000000')
           .fontSize(12)
           .font('Helvetica-Bold')
           .text('Generated By:', 60, 150)
           .fontSize(10)
           .font('Helvetica')
           .text(`Name: ${loggedInUserName}`, 60, 170)  // Use logged-in user's name
           .text(`Email: ${req.user.email}`, 60, 190)   // Use logged-in user's email
           .fillColor(roleColor)
           .font('Helvetica-Bold')
           .text(roleText, 60, 210);

        // Reset color to black
        doc.fillColor('#000000')
           .font('Helvetica');

        // Items Table Header
        const tableTop = 280;
        const itemX = 50;
        const quantityX = 280;
        const priceX = 370;
        const amountX = 470;

        // Table Headers with background
        doc.rect(50, tableTop - 10, 500, 25)
           .fill('#f6f6f6');

        doc.fillColor('#000000')
           .font('Helvetica-Bold')
           .fontSize(10)
           .text('Item', itemX, tableTop)
           .text('Quantity', quantityX, tableTop)
           .text('Price', priceX, tableTop)
           .text('Amount', amountX, tableTop);

        // Table rows
        let position = tableTop + 30;
        invoice.items.forEach((item, i) => {
            const row = position + (i * 30);
            
            // Alternate row background
            if (i % 2 === 0) {
                doc.rect(50, row - 10, 500, 25)
                   .fill('#f9f9f9');
            }
            
            doc.fillColor('#000000')
               .font('Helvetica')
               .fontSize(10)
               .text(item.name, itemX, row)
               .text(item.quantity.toString(), quantityX, row)
               .text(`₹${item.price.toFixed(2)}`, priceX, row)
               .text(`₹${(item.quantity * item.price).toFixed(2)}`, amountX, row);
        });

        // Total section with box
        const totalY = position + (invoice.items.length * 30) + 30;
        doc.rect(350, totalY - 10, 200, 25)
           .fill('#f6f6f6');

        doc.fillColor('#000000')
           .font('Helvetica-Bold')
           .fontSize(12)
           .text('Total Amount:', 350, totalY)
           .text(`₹${invoice.total.toFixed(2)}`, amountX, totalY);

        // Footer with signature space
        const footerY = doc.page.height - 150;
        
        // Signature box
        doc.rect(50, footerY, 200, 60)
           .stroke('#cccccc');
        
        doc.fontSize(10)
           .text('Authorized Signature', 90, footerY + 40);

        // Modified footer to show logged-in user
        doc.fontSize(10)
           .font('Helvetica')
           .text('Thank you for your business!', 0, doc.page.height - 70, {
               align: 'center',
               width: doc.page.width
           })
           .fontSize(8)
           .fillColor(roleColor)
           .text(`Generated by: ${loggedInUserName}`, {  // Show logged-in user's name in footer
               align: 'center',
               width: doc.page.width
           })
           .fillColor('#000000')
           .text('This is a computer generated invoice.', {
               align: 'center',
               width: doc.page.width
           });

        doc.end();

        // Update invoice status
        invoice.status = 'completed';
        await invoice.save();

    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({ message: 'Failed to generate PDF', error: error.message });
    }
});

// Get invoice history
router.get('/history', auth, async (req, res) => {
    try {
        const invoices = await Invoice.find({ userId: req.user.id })
            .sort({ createdAt: -1 });
        res.json(invoices);
    } catch (error) {
        console.error('Fetch history error:', error);
        res.status(500).json({ message: 'Failed to fetch invoice history' });
    }
});

// Add this new route to get all invoices (admin only)
router.get('/all', [auth, admin], async (req, res) => {
    try {
        // Fetch all invoices with user details
        const invoices = await Invoice.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.json(invoices);
    } catch (error) {
        console.error('Fetch all invoices error:', error);
        res.status(500).json({ message: 'Failed to fetch invoices' });
    }
});

module.exports = router; 