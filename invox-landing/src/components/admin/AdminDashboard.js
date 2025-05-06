import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, DatePicker } from 'antd';
import { 
    ShoppingCartOutlined, 
    UserOutlined, 
    DollarOutlined,
    ShoppingOutlined 
} from '@ant-design/icons';
import axios from 'axios';
import './AdminDashboard.css';

const { RangePicker } = DatePicker;

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        activeUsers: 0,
        totalProducts: 0
    });
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('user'));
            const [statsRes, usersRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/stats', {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                }),
                axios.get('http://localhost:5000/api/admin/recent-users', {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                })
            ]);

            setStats(statsRes.data);
            setRecentUsers(usersRes.data.map(user => ({
                ...user,
                role: user.role || 'user',
                status: user.status || 'inactive'
            })));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const userColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (name) => name || 'N/A'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email) => email || 'N/A'
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: role => (
                <Tag color={role === 'admin' ? 'red' : 'green'}>
                    {(role || 'user').toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Joined',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: date => date ? new Date(date).toLocaleDateString() : 'N/A',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: status => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {(status || 'inactive').toUpperCase()}
                </Tag>
            ),
        }
    ];

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h2>Dashboard Overview</h2>
                <RangePicker 
                    onChange={(dates) => {
                        // Handle date range change
                        console.log(dates);
                    }}
                />
            </div>

            <Row gutter={[24, 24]} className="stats-cards">
                <Col xs={24} sm={12} lg={6}>
                    <Card loading={loading}>
                        <Statistic
                            title="Total Sales"
                            value={stats.totalSales || 0}
                            prefix={<DollarOutlined />}
                            suffix="₹"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card loading={loading}>
                        <Statistic
                            title="Total Orders"
                            value={stats.totalOrders || 0}
                            prefix={<ShoppingCartOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card loading={loading}>
                        <Statistic
                            title="Active Users"
                            value={stats.activeUsers || 0}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card loading={loading}>
                        <Statistic
                            title="Total Products"
                            value={stats.totalProducts || 0}
                            prefix={<ShoppingOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <div className="recent-users">
                <h3>Recent Users</h3>
                <Table
                    columns={userColumns}
                    dataSource={recentUsers}
                    rowKey={record => record._id || Math.random().toString()}
                    loading={loading}
                    pagination={{ pageSize: 5 }}
                />
            </div>
        </div>
    );
};

export default AdminDashboard; 