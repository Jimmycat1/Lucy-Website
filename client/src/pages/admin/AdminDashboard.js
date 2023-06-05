import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { logout } from '../../actions/authActions';

class AdminDashboard extends Component {
    constructor(props) {
        super(props)

        this.state = {}
    }

    render() {
        return (
            <>
                <div id='ADMIN-dashboard'>
                    <h2>Welcome, {this.props.auth.user.name}!</h2>
                    <p className='heading-sub'>See what you can do below:</p>
                    <div className='dashboard-options'>
                        <div className='dashboard-option'>
                            <a href='/admin/paintings/add' target='_self'>
                                <h3>Add a Painting</h3>
                                <i className="fas fa-plus" ></i>
                            </a>
                        </div>
                        <div className='dashboard-option'>
                            <a href='/admin/paintings' target='_self'>
                                <h3>My Masterpieces</h3>
                                <i className="fas fa-images" ></i>
                            </a>
                        </div>
                        <div className='dashboard-option'>
                            <a href='/admin/orders' target='_self'>
                                <h3>Orders</h3>
                                <i className="fas fa-file-invoice-dollar" ></i>
                            </a>
                        </div>
                        <div className='dashboard-option'>
                            <a href='/admin/messages' target='_self'>
                                <h3>My Messages</h3>
                                <i className="fas fa-comments" ></i>
                            </a>
                        </div>
                        <div className='dashboard-option'>
                            <a href='/admin/profile' target='_self'>
                                <h3>My Profile</h3>
                                <i className="fas fa-user-circle" ></i>
                            </a>
                        </div>
                        <div className='dashboard-option'>
                            <a href='#' onClick={this.props.logout} target='_self'>
                                <h3>Log out</h3>
                                <i className="fas fa-sign-out-alt" ></i>
                            </a>
                        </div>
                    </div>

                </div>
            </>
        )
    }

};

AdminDashboard.propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { logout })(AdminDashboard);
