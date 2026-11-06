import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../satarea_logo.svg'
import getReportSummary from '../../api/getReportSummary.api';
import '../../reusable.css'
import './Navbar.css'

const Navbar = () => {
    const [pendingReportsCount, setPendingReportsCount] = useState(0);

    useEffect(() => {
        getReportSummary(setPendingReportsCount);
        const interval = setInterval(() => {
            getReportSummary(setPendingReportsCount);
        }, 30000);
        return () => clearInterval(interval);
    }, []);
    

    return (
        <nav>
            <div className='nav-container d-flex justify-content-space-between align-items-center'>
                <Link to={'/questionType'}>
                    <img 
                        src={logo} 
                        alt="SATAREA Admin" 
                        style={{ maxHeight: '36px', width: 'auto', objectFit: 'contain' }} 
                    />
                </Link>
                <div className='d-flex align-items-center school'>
                    <Link to={'/reportedQuestions'} className="reports-nav-item" title="Reported Questions (Revision Queue)">
                        <i className="fa fa-flag" aria-hidden="true" style={{ color: '#ef4444' }}></i>
                        {pendingReportsCount > 0 && (
                            <span className="reports-nav-badge">{pendingReportsCount}</span>
                        )}
                    </Link>
                    <Link to={'/notices'} title="Send a notice to the website's users"><i className="fa fa-bullhorn" aria-hidden="true"></i></Link>
                    <Link to={'/users'}><i className="fa fa-user" aria-hidden="true"></i></Link>
                    <Link to={'/school'}><i className="fa fa-graduation-cap" aria-hidden="true"></i></Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
