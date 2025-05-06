import React, { useState, useEffect } from 'react';
import { FaUsers, FaChartLine, FaBoxes, FaSignOutAlt, FaTrash, FaEdit, FaUserFriends, FaUserShield, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState('users');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userStats, setUserStats] = useState({
        totalUsers: 0,
        adminCount: 0,
        regularUsers: 0,
        recentUsers: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const response = await fetch('http://localhost:5000/api/admin/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
                calculateUserStats(data);
            } else {
                throw new Error('Failed to fetch users');
            }
        } catch (error) {
            setError('Error fetching users');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateUserStats = (users) => {
        const stats = {
            totalUsers: users.length,
            adminCount: users.filter(user => user.role === 'admin').length,
            regularUsers: users.filter(user => user.role === 'user').length,
            recentUsers: users.filter(user => {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                return new Date(user.createdAt) > oneWeekAgo;
            }).length
        };
        setUserStats(stats);
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const token = JSON.parse(localStorage.getItem('user'))?.token;
                const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    setUsers(users.filter(user => user._id !== userId));
                } else {
                    throw new Error('Failed to delete user');
                }
            } catch (error) {
                setError('Error deleting user');
                console.error('Error:', error);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const renderUserStats = () => (
        <div className="user-stats-grid">
            <div className="stat-card">
                <div className="stat-icon">
                    <FaUserFriends />
                </div>
                <div className="stat-info">
                    <h3>Total Users</h3>
                    <p>{userStats.totalUsers}</p>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon">
                    <FaUserShield />
                </div>
                <div className="stat-info">
                    <h3>Admins</h3>
                    <p>{userStats.adminCount}</p>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon">
                    <FaUserFriends />
                </div>
                <div className="stat-info">
                    <h3>Regular Users</h3>
                    <p>{userStats.regularUsers}</p>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon">
                    <FaCalendarAlt />
                </div>
                <div className="stat-info">
                    <h3>New Users (7 days)</h3>
                    <p>{userStats.recentUsers}</p>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        if (loading) {
            return <div className="loading">Loading...</div>;
        }

        if (error) {
            return <div className="error">{error}</div>;
        }

        return (
            <div className="users-list">
                <h3>User Statistics</h3>
                {renderUserStats()}
                <h3>Registered Users</h3>
                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Join Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`role-badge ${user.role}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="actions">
                                        <button 
                                            className="delete-btn"
                                            onClick={() => handleDeleteUser(user._id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="admin-dashboard">
            <div className="sidebar">
                <div className="logo-section">
                    <h2>Admin Panel</h2>
                </div>
                <nav className="nav-menu">
                    <button
                        className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveSection('users')}
                    >
                        <FaUsers /> <span>Users</span>
                    </button>
                    <button
                        className={`nav-item ${activeSection === 'stats' ? 'active' : ''}`}
                        onClick={() => setActiveSection('stats')}
                    >
                        <FaChartLine /> <span>Statistics</span>
                    </button>
                </nav>
                <button className="logout-button" onClick={handleLogout}>
                    <FaSignOutAlt /> <span>Logout</span>
                </button>
            </div>
            <main className="main-content">
                <header className="content-header">
                    <h1>Admin Dashboard</h1>
                </header>
                <div className="content-body">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard; 