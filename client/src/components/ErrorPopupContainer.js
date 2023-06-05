import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import ErrorPopup from './ErrorPopup';

// Just stores the whole bunch of RequestPopups. Each one for each request.
class ErrorPopupContainer extends Component {
  render(){
      return (<>
          {this.props.requests.map(request => (
            <ErrorPopup key={request.REQUEST_ID} request={request}></ErrorPopup>
          ))}
          </>
      )
  }
}

ErrorPopupContainer.propTypes = {
  requests: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
    requests: state.requests
});

export default connect(mapStateToProps, {})(ErrorPopupContainer);