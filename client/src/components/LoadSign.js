import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";


class LoadSign extends Component {
  constructor(props) {
    super(props);

    this.state = {
        isOpen: false
    }
  }

  static getDerivedStateFromProps(props, state){
      const requests = props.requests;

      let pendingRequests = requests.filter(request => {
        if (request.id !== ''){
          if (request.isPending === true){
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      });

      // If any loading, display
      let isOpen;
      if (pendingRequests.length > 0){
        isOpen = true
      } else {
        isOpen = false
      }
      state = {...state, isOpen: isOpen}
      
      return state;
  }

  
  render() {
      if (this.state.isOpen){
        return (
          <div className='loadSign'>
              <div className='circle-loader'></div>
          </div>
        )
      } else {
        return '';
      }
  }
}

LoadSign.propTypes = {
  requests: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  requests: state.requests
});

export default connect(mapStateToProps, {})(LoadSign);

export const LoadSignOn = () => (
  <div className='loadSign'>
    <div className='circle-loader'></div>
  </div>
)