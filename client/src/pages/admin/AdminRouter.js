import React, { Component, lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import { loadUser } from "../../actions/authActions";

import { LoadSignOn } from "../../components/LoadSign";
import LoginForm from '../../pages/admin/LoginForm';

const AddPainting =             lazy(()=>import('../../components/admin/AddPainting'));
const Navbar =                  lazy(()=>import( '../../components/admin/Navbar'));
const OnePaintingEditor =       lazy(()=>import( "../../components/admin/OnePaintingEditor0"));
const AdminDashboard =          lazy(()=>import( "../../pages/admin/AdminDashboard"));
const AdminPaintingsSelector =  lazy(()=>import( "../../pages/admin/AdminPaintingsSelector"));

class AdminRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
    };
  }

  componentDidMount() {
    if (!this.props.auth.user && this.props.auth.isAuthenticated && !this.props.auth.isLoading) {
      this.props.loadUser();
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { isAuthenticated } = props.auth;
    if (isAuthenticated !== true) {
      state = { ...state, loggedIn: false };
    } else {
      state = { ...state, loggedIn: true };
    }

    return state;
  }

  render() {
    if (this.state.loggedIn !== true) {
      return (
        <>
          <LoginForm></LoginForm>
        </>
      );
    } else {
      const scrollToTop = () => {
        document.getElementById('topOfPage').scrollIntoView();
      }
      return (
        <>
          <Suspense fallback={<LoadSignOn/>}>
            <Navbar />
            <Switch>
              <Route onChange={scrollToTop} path="/admin/login" exact>
                {/*Because logged on already.*/}
                <Redirect to='/admin'/>
              </Route>
              <Route onChange={scrollToTop} path='/admin' exact>
                <AdminDashboard />
              </Route>
              <Route onChange={scrollToTop} path="/admin/paintings" exact>
                <AdminPaintingsSelector/>
              </Route>
              <Route onChange={scrollToTop} path='/admin/paintings/add' exact>
                <div className='section container'>
                  <AddPainting/>
                </div>
              </Route>
              <Route
                onChange={scrollToTop}
                path="/admin/paintings/:paintingId/edit"
                render={(props) => (
                  <OnePaintingEditor
                    paintingId={props.match.params.paintingId}
                    {...props}
                  />
                )}
              ></Route>
            </Switch>
          </Suspense>
        </>
      );
    }
  }
}

AdminRouter.propTypes = {
  loadUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { loadUser })(AdminRouter);
