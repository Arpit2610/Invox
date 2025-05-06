import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCog, FaUser } from 'react-icons/fa';
import './RoleSelection.css';

const RoleSelection = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Cleanup function to handle any resize observers
        return () => {
            if (window.ResizeObserver) {
                const resizeObserver = new ResizeObserver(() => {});
                resizeObserver.disconnect();
            }
        };
    }, []);

    const handleRoleSelect = (role) => {
        // Add a small delay to prevent the ResizeObserver error
        setTimeout(() => {
            navigate(role === 'admin' ? '/admin-login' : '/user-login');
        }, 100);
    };

    return (
        <div className="role-selection">
            <div className="role-container">
                <h1>Select Role</h1>
                <div className="roles">
                    <div 
                        className="role-card"
                        onClick={() => handleRoleSelect('admin')}
                        role="button"
                        tabIndex={0}
                    >
                        <div className="role-icon">
                            <FaUserCog />
                        </div>
                        <h2>Admin</h2>
                        <p>Access administrative controls and manage system settings</p>
                    </div>
                    <div 
                        className="role-card"
                        onClick={() => handleRoleSelect('user')}
                        role="button"
                        tabIndex={0}
                    >
                        <div className="role-icon">
                            <FaUser />
                        </div>
                        <h2>User</h2>
                        <p>Access inventory management and invoice generation</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection; 