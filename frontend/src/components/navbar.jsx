import Nav from 'react-bootstrap/Nav';

import './navbar.css';

function NavBar() {
    return (
        <div className='nav-parent'>
            <Nav 
                className='nav-container'
                defaultActiveKey='/quote-creation'
            >
                <Nav.Item className='nav-item'>
                    <Nav.Link href='/quote-creation' className='nav-link'>Creation</Nav.Link>
                </Nav.Item>
                <Nav.Item className='nav-item'>
                    <Nav.Link href='/quote-list' className='nav-link'>List</Nav.Link>
                </Nav.Item>
                <Nav.Item className='nav-item'>
                    <Nav.Link href='/quote-detail' className='nav-link'>Detail</Nav.Link>
                </Nav.Item>
                <Nav.Item className='nav-item'>
                    <Nav.Link href='/quote-edit' className='nav-link'>Edit</Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    )
}

export default NavBar;
