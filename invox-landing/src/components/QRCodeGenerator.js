import QRCode from 'qrcode.react';

const InvoiceQRCode = ({ invoiceData }) => {
    const qrData = JSON.stringify({
        id: invoiceData._id,
        amount: invoiceData.total,
        date: invoiceData.date
    });

    return (
        <div className="qr-code">
            <QRCode value={qrData} size={128} />
        </div>
    );
}; 