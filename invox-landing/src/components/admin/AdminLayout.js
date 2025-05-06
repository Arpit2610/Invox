import React, { Suspense, useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Admin Layout Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-container">
                    <h1>Something went wrong.</h1>
                    <button onClick={() => window.location.reload()}>
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

const AdminLayout = () => {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Verify admin access
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.user.role !== 'admin') {
            navigate('/admin-login');
            return;
        }
        setIsLoading(false);
    }, [navigate]);

    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <ErrorBoundary>
            <div className="admin-layout">
                <AdminSidebar />
                <div className="admin-content">
                    <Suspense fallback={<div>Loading...</div>}>
                        <Outlet />
                    </Suspense>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default AdminLayout; 