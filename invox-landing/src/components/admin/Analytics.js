import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Statistic, Table } from 'antd';
import { DollarOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import './Analytics.css';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Analytics = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        activeUsers: 0
    });
    const [recentInvoices, setRecentInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [salesData, setSalesData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('user'));
            const token = userInfo?.token;

            const [statsResponse, invoicesResponse] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:5000/api/admin/invoices', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setStats(statsResponse.data);
            setRecentInvoices(invoicesResponse.data);

            // Process invoices for chart data
            const processedData = processInvoicesForChart(invoicesResponse.data);
            setSalesData(processedData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching analytics data:', error);
            setLoading(false);
        }
    };

    const processInvoicesForChart = (invoices) => {
        // Group invoices by date
        const groupedData = invoices.reduce((acc, invoice) => {
            const date = new Date(invoice.date).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = {
                    totalAmount: 0,
                    orderCount: 0,
                    itemCount: 0
                };
            }
            acc[date].totalAmount += invoice.total;
            acc[date].orderCount += 1;
            acc[date].itemCount += invoice.items.length;
            return acc;
        }, {});

        // Convert to array and sort by date
        return Object.entries(groupedData)
            .map(([date, data]) => ({
                date,
                ...data
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const salesChartData = {
        labels: salesData.map(item => item.date),
        datasets: [
            {
                label: 'Sales Amount (₹)',
                data: salesData.map(item => item.totalAmount),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1,
                type: 'bar',
                yAxisID: 'y'
            },
            {
                label: 'Number of Orders',
                data: salesData.map(item => item.orderCount),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1,
                type: 'bar',
                yAxisID: 'y1'
            }
        ]
    };

    const itemsChartData = {
        labels: salesData.map(item => item.date),
        datasets: [{
            label: 'Items Sold',
            data: salesData.map(item => item.itemCount),
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#ffffff',
                    font: { size: 12 }
                }
            },
            title: {
                display: true,
                text: 'Sales Analytics',
                color: '#ffffff',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            }
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#ffffff',
                    font: { size: 12 }
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#ffffff',
                    font: { size: 12 }
                }
            },
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#ffffff',
                    font: { size: 12 }
                }
            }
        },
        barPercentage: 0.9,
        categoryPercentage: 0.8
    };

    const barChartOptions = {
        ...chartOptions,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#ffffff'
                }
            },
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#ffffff'
                }
            }
        }
    };

    const columns = [
        {
            title: 'Invoice ID',
            dataIndex: '_id',
            key: '_id',
            render: (text) => text.slice(-6).toUpperCase()
        },
        {
            title: 'Customer',
            dataIndex: ['userId', 'name'],
            key: 'customer'
        },
        {
            title: 'Amount',
            dataIndex: 'total',
            key: 'amount',
            render: (amount) => `₹${amount.toFixed(2)}`
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => new Date(date).toLocaleDateString()
        }
    ];

    return (
        <div className="analytics-container">
            <h2 className="analytics-title">Analytics Dashboard</h2>
            
            <Row gutter={[16, 16]} className="stats-row">
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Total Sales"
                            value={stats.totalSales}
                            prefix="₹"
                            precision={2}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<DollarOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Total Orders"
                            value={stats.totalOrders}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<ShoppingOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Active Users"
                            value={stats.activeUsers}
                            valueStyle={{ color: '#1890ff' }}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card className="chart-card" title="Sales & Orders Trend">
                        <div className="chart-container">
                            <Bar 
                                options={{
                                    ...chartOptions,
                                    maintainAspectRatio: false,
                                    responsive: true
                                }} 
                                data={salesChartData}
                            />
                        </div>
                    </Card>
                </Col>
                <Col span={24}>
                    <Card className="chart-card" title="Items Sold">
                        <div className="chart-container">
                            <Bar 
                                options={{
                                    ...barChartOptions,
                                    maintainAspectRatio: false,
                                    responsive: true
                                }} 
                                data={itemsChartData}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>

            <Card className="recent-invoices" title="Recent Invoices">
                <div className="table-container">
                    <Table
                        columns={columns}
                        dataSource={recentInvoices}
                        loading={loading}
                        rowKey="_id"
                        pagination={{
                            pageSize: 5,
                            total: recentInvoices.length,
                            showSizeChanger: false,
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                            defaultPageSize: 5,
                            position: ['bottomCenter']
                        }}
                        scroll={{ y: 350 }}
                        size="middle"
                    />
                </div>
            </Card>
        </div>
    );
};

export default Analytics; 