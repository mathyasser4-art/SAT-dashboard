import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../logo.png'
import mrshahinLogo from '../../mrshahin_logo.svg'
import getReportSummary from '../../api/getReportSummary.api';
import '../../reusable.css'
import './Navbar.css'

const Navbar = () => {
    const isAuth = Boolean(localStorage.getItem('O_authWEB') || localStorage.getItem('userToken'));
    const role = localStorage.getItem('auth_role');
    const schoolName = (localStorage.getItem('school_name') || '').toLowerCase();
    const [pendingReportsCount, setPendingReportsCount] = useState(0);

    useEffect(() => {
        getReportSummary(setPendingReportsCount);
        const interval = setInterval(() => {
            getReportSummary(setPendingReportsCount);
        }, 30000);
        return () => clearInterval(interval);
    }, []);
    
    // SAT School Account logo selection
    const isSatSchoolAccount = isAuth && (
        schoolName.includes('sat') ||
        schoolName.includes('bluepaper') ||
        schoolName.includes('shahin') ||
        schoolName === 'sat school' ||
        ['Teacher', 'School', 'Student', 'Supervisor', 'IT'].includes(role) ||
        Boolean(role)
    );
    const activeLogo = isSatSchoolAccount ? mrshahinLogo : logo;

    return (
        <nav>
            <div className='nav-container d-flex justify-content-space-between align-items-center'>
                <Link to={'/questionType'}>
                    <img 
                        src={activeLogo} 
                        alt="Logo" 
                        style={{ maxHeight: '36px', width: 'auto', objectFit: 'contain' }} 
                    />
                </Link>
                <div className='d-flex align-items-center school'>
                    <Link to={'/reportedQuestions'} className="reports-nav-item" title="Question Revision Queue">
                        <i className="fa fa-flag" aria-hidden="true" style={{ color: pendingReportsCount > 0 ? '#ef4444' : '#64748b' }}></i>
                        {pendingReportsCount > 0 && (
                            <span className="reports-nav-badge">{pendingReportsCount}</span>
                        )}
                    </Link>
                    <Link to={'/users'}><i className="fa fa-user" aria-hidden="true"></i></Link>
                    <Link to={'/school'}><i className="fa fa-graduation-cap" aria-hidden="true"></i></Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
