import React, { useState } from 'react';
import { FaBoxOpen, FaFileInvoice, FaList, FaSignOutAlt, FaHistory, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import InventoryManager from './InventoryManager';
import InvoiceGenerator from './InvoiceGenerator';
import InvoiceHistory from './InvoiceHistory';
import InventoryTable from './InventoryTable';
import Shop from './components/Shop';
import './Dashboard.css';

const Dashboard = () => {
    const [activeComponent, setActiveComponent] = useState('inventory');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const renderComponent = () => {
        switch (activeComponent) {
            case 'inventory':
                return <InventoryManager />;
            case 'shop':
                return <Shop />;
            case 'invoice':
                return <InvoiceGenerator />;
            case 'invoiceHistory':
                return <InvoiceHistory />;
            case 'inventoryTable':
                return <InventoryTable />;
            default:
                return <InventoryManager />;
        }
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <div className="logo-section">
                    <h2>Invox</h2>
                    <p>Inventory Management</p>
                </div>
                <nav className="nav-menu">
                    <button 
                        className={`nav-item ${activeComponent === 'inventory' ? 'active' : ''}`}
                        onClick={() => setActiveComponent('inventory')}
                    >
                        <FaBoxOpen /> <span>Inventory</span>
                    </button>
                    <button 
                        className={`nav-item ${activeComponent === 'shop' ? 'active' : ''}`}
                        onClick={() => setActiveComponent('shop')}
                    >
                        <FaShoppingCart /> <span>Visit Shop</span>
                    </button>
                    <button 
                        className={`nav-item ${activeComponent === 'invoice' ? 'active' : ''}`}
                        onClick={() => setActiveComponent('invoice')}
                    >
                        <FaFileInvoice /> <span>Generate Invoice</span>
                    </button>
                    <button 
                        className={`nav-item ${activeComponent === 'invoiceHistory' ? 'active' : ''}`}
                        onClick={() => setActiveComponent('invoiceHistory')}
                    >
                        <FaHistory /> <span>Invoice History</span>
                    </button>
                    <button 
                        className={`nav-item ${activeComponent === 'inventoryTable' ? 'active' : ''}`}
                        onClick={() => setActiveComponent('inventoryTable')}
                    >
                        <FaList /> <span>Stock List</span>
                    </button>
                </nav>
                <button className="logout-button" onClick={handleLogout}>
                    <FaSignOutAlt /> <span>Logout</span>
                </button>
            </div>
            <main className="main-content">
                <header className="content-header">
                    <h1>{activeComponent.charAt(0).toUpperCase() + activeComponent.slice(1)}</h1>
                </header>
                <div className="content-body">
                    {renderComponent()}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
