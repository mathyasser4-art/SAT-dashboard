import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../logo.png'
import mrshahinLogo from '../../mrshahin_logo.svg'
import '../../reusable.css'
import './Navbar.css'

const Navbar = () => {
    const isAuth = Boolean(localStorage.getItem('O_authWEB') || localStorage.getItem('userToken'));
    const role = localStorage.getItem('auth_role');
    const schoolName = (localStorage.getItem('school_name') || '').toLowerCase();
    
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
                    <Link to={'/users'}><i className="fa fa-user" aria-hidden="true"></i></Link>
                    <Link to={'/school'}><i className="fa fa-graduation-cap" aria-hidden="true"></i></Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
