import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {openMenu, closeMenu, toggleMenu} from '../actions/menuActions';
import { basket_toggle } from '../actions/basketActions';
import {USE_BASKET} from '../config.js';

class Top extends Component {
    constructor() {
        super();

        this.state = {

        }
    }

    render(){
        return (
            <React.Fragment>
                <header className='topnav'>
                    <div>

                        <Link to='/' onClick={this.linkClicked}
                            className='topnav-item-left heading-common center-relative-Y'>
                                LucyArt
                        </Link>

                        <button id='menu-button' className = 'menu-button topnav-item-right center-relative-Y'
                            onClick={this.toggleMenu}>
                            <i className="fas fa-bars"></i>
                        </button>

                        <Link to='/paintings/gallery' onClick={this.linkClicked}
                            className='menu-button topnav-item-right center-relative-Y'>
                            <i className="fas fa-images"></i>
                        </Link>

                        { // Only if basket feature is enabled
                        (USE_BASKET===true)?
                          (<button id='menu-button' className = 'menu-button topnav-item-right center-relative-Y'
                            onClick={this.toggleBasket}>
                            <i className="fas fa-shopping-cart"></i>
                          </button>)
                        :('')
                        }

                    </div>
                </header>

                <div className='topnav-placeholder'></div>

                <div id='full-screen-menu' style={this.getMenuStyle()}>
                {/* Display none because invisible at first */}
                    <ul>
                        <li><Link to='/#top' onClick={this.linkClicked}>                       Home             </Link></li>
                        <li><Link to='/paintings/gallery#top' onClick={this.linkClicked}>      Artworks             </Link></li>
                        <li><Link to='/contact#top' onClick={this.linkClicked}>                Contact me          </Link></li>
                    </ul>
                </div>
            </React.Fragment>
        );
    }

    toggleBasket = () => {
        this.props.basket_toggle();
    }

    toggleMenu = () => {
        const button = document.getElementById('menu-button')
        this.props.toggleMenu()
        button.blur()
    }

    getMenuStyle = () => {
        const style = (this.props.menu.isOpen)
            ?{'transform':'translateY(0vh)'}
            :{'transform':'translateY(-100vh)'}
        return style
    }

    linkClicked = () => {
        document.getElementById('topOfPage').scrollIntoView();
        this.props.closeMenu()
    }
};

Top.propTypes = {
    menu: PropTypes.object.isRequired,

    openMenu: PropTypes.func.isRequired,
    closeMenu: PropTypes.func.isRequired,
    toggleMenu: PropTypes.func.isRequired,

    basket_toggle: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    menu: state.menu
});

export default connect(mapStateToProps, { openMenu, closeMenu, toggleMenu, basket_toggle })(Top);
