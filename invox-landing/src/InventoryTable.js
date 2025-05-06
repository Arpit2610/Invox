import React, { useContext } from 'react';
import { InventoryContext } from './InventoryContext';
import './InventoryTable.css';

const InventoryTable = () => {
    const { inventory, deleteItem } = useContext(InventoryContext);

    return (
        <div className="inventory-table">
            <h3>Current Inventory</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>₹{item.price.toFixed(2)}</td>
                            <td>{item.category}</td>
                            <td>{item.description}</td>
                            <td>
                                <button 
                                    className="delete-btn"
                                    onClick={() => deleteItem(item.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryTable;
