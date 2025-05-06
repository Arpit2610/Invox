const nodemailer = require('nodemailer');

const sendInvoiceEmail = async (to, invoiceData, pdfBuffer) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: 'your-email@gmail.com',
        to: to,
        subject: 'Your Invoice from Invox',
        html: `<h1>Invoice Generated</h1>
               <p>Amount: ${invoiceData.total}</p>`,
        attachments: [{
            filename: 'invoice.pdf',
            content: pdfBuffer
        }]
    });
}; 