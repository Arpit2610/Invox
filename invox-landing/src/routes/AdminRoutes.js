import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminDashboard from '../components/admin/AdminDashboard';
import StockInventoryTable from '../components/admin/StockInventoryTable';
// ... other imports

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="inventory" element={<StockInventoryTable />} />
            {/* ... other routes */}
        </Routes>
    );
};

export default AdminRoutes; 