import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {updatePainting_add_image, updatePainting_delete_filename} from '../../actions/adminActions';


class PhotoCollectionEditor extends Component{
    constructor(props){
        super(props);
        // this.photosList = React.createRef();
    }
    render(){
        return (
        <>
            <div className='PhotoCollectionsEditor'>
                <>
                    <div className='photosList' ref={this.photosList}>
                        {this.props.filenames.map((filename, index)=> (

                            <div key={index} className='photosList--photo'>
                                <img src={`/images/${filename}`} alt='painting'></img>
                                <button type='button'
                                        className='ADMIN-button ADMIN-button-delete'
                                        onClick={this.onRemoveImage(filename)}
                                > X </button>
                            </div>

                        ))}


                        <label htmlFor='image' className='photosList--add' style={{'cursor':'pointer'}}>
                            <h3>Add a photo</h3>
                            <i className='fas fa-plus'></i>
                        </label>
                        <input
                            type='file' accept='image/*' id='image' name='image' multiple
                            style={{'display':'none'}}
                            onChange={this.onAddImage}
                        >
                        </input>
                    </div>
                </>
            </div>
        </>
        )
    }

/*    onImageUpload = event => {
        const photosList = this.photosList.current;
        const addButton = photosList.querySelector('.photosList--add');

        for (let image of event.target.files){

            this.setState({
                files: [...this.state.files, image]
            });

            let newImage = document.createElement('img');
            newImage.src = URL.createObjectURL(image);

            let container = document.createElement('div');
            container.classList.add('photosList--photo');
            container.classList.add('photosList--photo--preview');

            container.appendChild(newImage);
            photosList.insertBefore(container, addButton);
        }
  }
  */

    onRemoveImage = filename => event =>{
        this.props.updatePainting_delete_filename({
          filename: filename,
          paintingID: this.props.paintingID,
        })
    }

    onAddImage = (event) => {
        this.props.updatePainting_add_image({
          image: event.target.files[0],
          paintingID: this.props.paintingID,
        })
    }

    recursiveApplyChanges = (actionNum = 0) => {
        // This function first saves all images in state.files.
        // It does this by recursively calling itself, incrementing actionNum with each call.
        // Once actionNum gets higher than files length, it deletes files in state.delete.
        const addFiles = this.state.files;
        const deleteFiles = this.state.delete;
        if (actionNum < addFiles.length){
            this.props.addImage(addFiles[actionNum], this.props.paintingID);
        } else if ( actionNum < (addFiles.length + deleteFiles.length)){
            this.props.deleteImage(deleteFiles[actionNum - addFiles.length], this.props.paintingID);
        } else {
            return
        }
        this.recursiveApplyChanges(actionNum + 1);
    }


}

PhotoCollectionEditor.propTypes = {
    updatePainting_add_image: PropTypes.func.isRequired,
    updatePainting_delete_filename: PropTypes.func.isRequired,

    filenames: PropTypes.array.isRequired,
    paintingID: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, {updatePainting_add_image, updatePainting_delete_filename})(PhotoCollectionEditor);



//https://programmingwithmosh.com/javascript/react-file-upload-proper-server-side-nodejs-easy/
