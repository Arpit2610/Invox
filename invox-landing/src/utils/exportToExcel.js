import * as XLSX from 'xlsx';

export const exportToExcel = (data, fileName) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoices");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
};

// Usage in component:
const handleExport = () => {
    const formattedData = invoices.map(invoice => ({
        'Invoice ID': invoice._id,
        'Date': new Date(invoice.date).toLocaleDateString(),
        'Amount': invoice.total,
        'Items': invoice.items.length
    }));
    exportToExcel(formattedData, 'invoice_history');
}; 