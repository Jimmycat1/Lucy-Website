import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {clearRequest} from '../actions/requestActions';

class RequestPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
        isOpen: false
    }
  }

  static getDerivedStateFromProps(props, state){
      const request = props.request;
      if(request){

        // Open if request success
        var isOpen = false;
        if (request.id !== ''){
          if (request.display){
            if (request.isPending === true){
              isOpen = false;
            } else {
              if (request.success === true){
                isOpen = true;
              } else {
                isOpen = false;
              }
            }
          } else {
            isOpen = false;
          }
        }
        state = {...state, isOpen:isOpen};
      }
      
      return state;
  }

  getMsg = () => {
    if (this.props.request){
      const requestId = this.props.request.id;
      switch(requestId){
          case 'UPDATE_PAINTING':
              return 'The painting was updated successfully.'
          case 'DELETE_PAINTING':
            return 'The painting was deleted.'
          case 'SEND_MESSAGE':
            return 'Your message is in my inbox. I will reply as soon as I can because I love you!'
          default:
              return '';
      }
    } else {
      return '';
    }
  }


  render() {
    return (
      <div style={{visibility: this.state.isOpen?'visible':'hidden'}} className='popup-message'>
            <h3>Success!</h3>
            <p>{this.getMsg()}</p>
            <button type='button' onClick={this.closePopup} className='popup-button'>
              Ok
            </button>
      </div>
    );
  }

  closePopup = () => {
    const REQUEST_ID = this.props.request.REQUEST_ID;
    this.props.clearRequest(REQUEST_ID);
  }
}


// Need to manually assign request to it.
RequestPopup.propTypes = {
  request: PropTypes.object.isRequired,
  clearRequest: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {clearRequest})(RequestPopup);