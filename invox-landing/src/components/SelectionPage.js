import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserTie, FaUser } from 'react-icons/fa';
import './SelectionPage.css';

const SelectionPage = () => {
    const navigate = useNavigate();

    return (
        <div className="selection-page">
            <div className="selection-container">
                <h1>Welcome to Invox</h1>
                <div className="selection-boxes">
                    <div 
                        className="selection-box admin"
                        onClick={() => navigate('/admin-login?role=admin')}
                    >
                        <FaUserTie className="role-icon" />
                        <h2>Admin</h2>
                        <p>Login as Administrator</p>
                    </div>
                    <div 
                        className="selection-box user"
                        onClick={() => navigate('/user-login?role=user')}
                    >
                        <FaUser className="role-icon" />
                        <h2>User</h2>
                        <p>Login as Regular User</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectionPage; 