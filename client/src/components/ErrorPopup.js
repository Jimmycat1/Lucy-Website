import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {clearRequestError} from '../actions/requestActions';

class ErrorPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
        isOpen: false,
        error: {},
    }
  }

  static getDerivedStateFromProps(props, state){
      const request = props.request;

      let isOpen;
      // Open if request failed
      if (request.id !== ''){
        if(request.display){
          if (request.isPending === true){
            isOpen = false;
          } else {
            if (request.success === true){
              isOpen = false;
            } else {
              isOpen = true;
            }
          }
        } else {
          isOpen = false
        }
      }

      if (isOpen){
        let error = props.request.response.error
        if(error){
          state = {...state, error}
        } else {
          isOpen = false;
        }
      }
      state = {...state, isOpen}

      return state;
  }

  getErrorMsg = () => {
    const ERROR_ID = this.state.error.ERROR_ID;
    const emailAddress = 'luda.silina@gmail.com';
    switch(ERROR_ID){
        case 'REQUEST_FAIL':
            return 'The request was not successful. Perhaps you mistyped something? Check the info below for more details...'
        case 'LOGIN_FAILED':
            return 'Sorry, wrong login credentials.'
        case 'EMAIL_NOT_SENT':
            return (<>We couldn't send over the email. This sometimes happens if you've misspelt your email address. <br/>Alternative option: email me at <span style={{'fontWeight':'bold'}}>{emailAddress}</span></>);
        case 'ADD_PAINTING_FAILED':
            return (<>The name you entered is probably already taken.</>)
        case 'TOO_MANY_REQUESTS':
            return (<>We are experiencing too many requests at the moment.</>)
        default:
            return '';
    }
  }

  dismiss = () => {
    this.props.clearRequestError(this.props.request.REQUEST_ID);
    this.setState({
      isOpen: false
    })
  }

  render() {
      return (
      <div style={{visibility: this.state.isOpen?'visible':'hidden'}} className='popup-message'>
            <h3>Something went wrong</h3>
            <p>{this.getErrorMsg()}</p>
            <details open={false}>
                <summary>See details</summary>
                {
                  (this.state.error.details)

                    ? this.state.error.details.map((item, index) => {
                        return (<p key={index}>- {item}</p>)
                      })

                    : ''
                }
            </details>
            <button onClick={this.dismiss} className='popup-button'>
              Dismiss
            </button>
      </div>
    );
  }
}

ErrorPopup.propTypes = {
  request: PropTypes.object.isRequired,
  clearRequestError: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, { clearRequestError })(ErrorPopup);