import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';

const AdvancedAnalytics = () => {
    return (
        <div className="analytics-grid">
            <div className="chart-card">
                <h3>Revenue Trends</h3>
                <Line data={revenueData} options={options} />
            </div>
            <div className="chart-card">
                <h3>Popular Items</h3>
                <Pie data={itemsData} options={options} />
            </div>
            <div className="chart-card">
                <h3>User Growth</h3>
                <Bar data={userData} options={options} />
            </div>
        </div>
    );
}; 