import { useLocation, Link } from 'react-router-dom';

import Nav from 'react-bootstrap/Nav';

import './navbar.css';

function NavBar() {
    const location = useLocation();
    return (
        <div className='nav-parent'>
            <Nav 
                className='nav-container'
                activeKey={location.pathname}
            >
                <Nav.Item className='nav-item'>
                    <Nav.Link as={Link} to='/quote-creation' eventKey='/quote-creation' className='nav-link'>Creation</Nav.Link>
                </Nav.Item>
                <Nav.Item className='nav-item'>
                    <Nav.Link as={Link} to='/quote-list' eventKey='/quote-list' className='nav-link'>List</Nav.Link>
                </Nav.Item>
                <Nav.Item className='nav-item'>
                    <Nav.Link as={Link} to='/quote-detail' eventKey='/quote-detail' className='nav-link'>Detail</Nav.Link>
                </Nav.Item>
                <Nav.Item className='nav-item'>
                    <Nav.Link as={Link} to='/quote-edit' eventKey='/quote-edit' className='nav-link'>Edit</Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    )
}

export default NavBar;
