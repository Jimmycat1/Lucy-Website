import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import RequestPopup from './RequestPopup';

// Just stores the whole bunch of RequestPopups. Each one for each request.
class RequestPopupContainer extends Component {
  render(){
      const requests = this.props.requests;
      if(requests.length > 0){
        return (<>
            {this.props.requests.map(request => (
              <RequestPopup key={request.REQUEST_ID} request={request}></RequestPopup>
            ))}
            </>
        )
      }else{
        return '';
      }
  }
}

RequestPopupContainer.propTypes = {
  requests: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
    requests: state.requests
});

export default connect(mapStateToProps, {})(RequestPopupContainer);