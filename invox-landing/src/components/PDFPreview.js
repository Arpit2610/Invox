import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFPreview = ({ pdfUrl }) => {
    return (
        <div className="pdf-preview">
            <Document file={pdfUrl}>
                <Page pageNumber={1} />
            </Document>
        </div>
    );
};

export default PDFPreview; 