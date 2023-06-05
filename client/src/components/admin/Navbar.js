import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { openMenu, closeMenu, toggleMenu } from '../../actions/menuActions';
import { logout } from '../../actions/authActions';

class Navbar extends Component {

    render() {
        return (
            <>
                <header className='topnav'>
                    <div>
                        <Link to='/admin/' onClick={this.props.closeMenu}
                            className='topnav-item-left heading-common center-relative-Y'>
                            Dashboard
                    </Link>
                        <button id='menu-button' className='menu-button topnav-item-right center-relative-Y'
                            onClick={this.toggleMenu}>
                            <i className="fas fa-bars"></i>
                        </button>
                    </div>
                </header>

                <div className='topnav-placeholder'></div>

                <div id='full-screen-menu' style={this.getMenuStyle()}>
                    {/* Display none because invisible at first */}
                    <ul>
                        <li><Link to='/admin/' onClick={this.props.closeMenu}> Dashboard    </Link></li>
                        <li><Link to='/admin/profile' onClick={this.props.closeMenu}>   Profile         </Link></li>
                        <li><Link to='/' onClick={this.logout}>                         Log Out         </Link></li>
                    </ul>
                </div>
            </>
        );
    }

    toggleMenu = () => {
        const button = document.getElementById('menu-button');
        this.props.toggleMenu();
        button.blur();
    }

    getMenuStyle = () => {
        const style = (this.props.menu.isOpen)
            ? { 'transform': 'translateY(0vh)' }
            : { 'transform': 'translateY(-100vh)' }
        return style
    }

    logout = () => {
        this.props.logout();
        this.props.closeMenu();
    }
}

Navbar.propTypes = {
    menu: PropTypes.object.isRequired,

    openMenu: PropTypes.func.isRequired,
    closeMenu: PropTypes.func.isRequired,
    toggleMenu: PropTypes.func.isRequired,

    logout: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    menu: state.menu
});

export default connect(mapStateToProps, { openMenu, closeMenu, toggleMenu, logout })(Navbar);