import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { addPainting } from '../../actions/adminActions';



class AddPainting extends Component {
  constructor(props){
    super(props)
    this.state = {
      name:'',
      image: null,
    }
  }
  render(){
      return (
          <>
            <div className='addPainting'>
                <h3 className='heading-medium'>Just enter the name of the painting and upload an image and we'll get you started...</h3>
                <form className='addPainting--form formA' onSubmit={this.onSubmit} method='POST'>

                    <label>
                    <p>Name</p>
                    <input
                        type="text"
                        minLength="1"
                        required={true}
                        name="name"

                        value={this.state.name}
                        onChange={this.handleChange}
                    />
                    </label>

                    <label htmlFor='image' >
                        <h3 className='ADMIN-button'>Add a photo</h3>
                    </label>
                    <input 
                        type='file' accept='image/*' id='image' name='image' required
                        onChange={this.takeImage}
                        style={{'display':'none'}}
                    ></input>

                    <input type='submit' className='ADMIN-button' value='Next >>>' disabled={(this.state.image===null)}></input>

                </form>
            </div>
          </>
      )
  }

  takeImage = event => {
    if(event.target.files[0]){
      this.setState({
        image: event.target.files[0]
      });
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }


  onSubmit = e => {
    e.preventDefault();
    this.props.addPainting(this.state.name, this.state.image);
  }
}







AddPainting.propTypes = {
  paintingDict: PropTypes.object.isRequired,
  requests: PropTypes.array.isRequired,

  addPainting: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  paintingDict: state.paintings.paintingDict,
  requests: state.requests,
});

export default connect(mapStateToProps, {addPainting})(AddPainting);
