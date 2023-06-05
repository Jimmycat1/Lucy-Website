import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { login } from "../../actions/authActions";
import { LoadSignOn } from "../../components/LoadSign";

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      message: "",
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.errors.msg) {
      let newMsg = "";

      if (props.errors.id === 'LOGIN_FAIL'){
        newMsg = props.errors.msg.message;
      }
      
      state = { ...state, message: newMsg };
    }
    return state;
  }

  render() {
    if (this.props.user.isLoading){
      return (<LoadSignOn/>);
    } else {
      return (
        <>
          <div className="section container">
            <div id="ADMIN-LOGIN-WINDOW">
              <h3 className="heading-common">Welcome, if you be admin...</h3>
              <h4 className="heading-sub margin-bottom-M">
                Please log in below.
              </h4>

              <form method="POST" onSubmit={this.login}>
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={this.state.username}
                  onChange={this.handleChange}
                  required
                  autoFocus
                ></input>

                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  required
                ></input>

                <input type="submit" value="Enter" className="ADMIN-button" />
              </form>

              <div id="login-message">{this.state.message}</div>
            </div>
          </div>
        </>
      );
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  login = (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    console.log(`Loging in ${username}...`);
    this.setState({ username: "", password: "" });

    // Attempt to login
    this.props.login({ username, password });
  };
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { login })(LoginForm);
