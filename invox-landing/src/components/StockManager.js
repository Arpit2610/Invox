import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StockManager.css';

function StockManager() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStocks, setUserStocks] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchUserStocks = async (userId) => {
    try {
      const response = await axios.get(`/api/stock/${userId}`);
      setUserStocks(response.data);
      setSelectedUser(userId);
    } catch (error) {
      console.error('Error fetching user stocks:', error);
    }
  };

  const updateStock = async (stockId, quantity) => {
    try {
      await axios.put(`/api/stock/${stockId}`, { quantity });
      fetchUserStocks(selectedUser);
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  return (
    <div className="stock-manager">
      <div className="users-list">
        <h3>Select User</h3>
        {users.map(user => (
          <div
            key={user._id}
            className={`user-item ${selectedUser === user._id ? 'selected' : ''}`}
            onClick={() => fetchUserStocks(user._id)}
          >
            {user.username}
          </div>
        ))}
      </div>
      
      {selectedUser && (
        <div className="stocks-list">
          <h3>User Stocks</h3>
          {userStocks.map(stock => (
            <div key={stock._id} className="stock-item">
              <span>{stock.name}</span>
              <input
                type="number"
                value={stock.quantity}
                onChange={(e) => updateStock(stock._id, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StockManager; 