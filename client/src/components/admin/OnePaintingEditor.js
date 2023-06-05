import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getPainting } from "../../actions/paintingsActions";
import { updatePainting, deletePainting} from '../../actions/adminActions';

import PaintingPopup from "../../components/PaintingPopup_functional";
import Slideshow from '../../components/Slideshow';
import PhotoCollectionEditor from '../../components/admin/PhotoCollectionEditor';



class OnePaintingEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshPreview: false, // Flip switch
      editPhotos: false,
      deleteDialogOpen: false
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.painting) {
      const paintingId = props.paintingId;

      if (paintingId) {
        const availableIds = Object.keys(props.paintingDict);
        if (!availableIds.includes(paintingId)) {
          if (!props.allLoading) {
            // Only does this if all paintings are not loading
            props.getPainting(paintingId);
            state = { ...state };
          }
        } else {
          // Includes id needed
          var painting = props.paintingDict[paintingId];
          state = { ...state, painting: { ...painting } };
        }
      }
    }

    return state; //Must return something.
  }

  render() {
    if (this.state.painting && this.state.painting !== {}) {
      return (
        <div id="ADMIN-PAINTING-EDITOR">

          <form method="POST" onSubmit={this.onSubmit} className='formA'>
            <h3 className='heading-medium'>Change what you want to</h3>
            <div className="twoColumns APE">
              <div className="painting">

                <button type='button' className='ADMIN-button' onClick={this.togglePhotoEditMode}>
                  {(this.state.editPhotos)
                    ?(<>Cancel</>)
                    :(<>Change photos</>)
                  }
                </button>
                {(this.state.editPhotos)
                  ?(<PhotoCollectionEditor
                      filenames={this.state.painting.filename}
                      paintingID = {this.props.paintingId}
                    ></PhotoCollectionEditor>)
                  :(<Slideshow filenames={this.state.painting.filename}></Slideshow>)
                }

              </div>
              <div className="meta">
                <label>
                  <p>Name</p>
                  <input
                    type="text"
                    minLength="1"
                    required={true}
                    value={this.state.painting.name}
                    name="name"
                    onChange={this.handleChange("name")}
                  />
                </label>

                <label>
                  <p>Date</p>
                  <input
                    type="date"
                    name="date"
                    value={this.getFormDate()}
                    onChange={this.editPaintingDate}
                  />
                </label>

                <label>
                  <p>Status</p>
                  <select
                    value={this.state.painting.status}
                    name="status"
                    onChange={this.handleChange("status")}
                  >
                    <option>Available</option>
                    <option>Draft</option>
                    <option>Sold</option>
                    <option>Requested</option>
                    <option>Reserved</option>
                  </select>
                </label>

                <label>
                  <p>Price (£)</p>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={this.state.painting.price}
                    name="price"
                    onChange={this.handleChange("price")}
                  />
                </label>

                <label>
                  <p>Description</p>
                  <textarea
                    rows="4"
                    value={this.state.painting.description}
                    name="description"
                    onChange={this.handleChange("description")}
                  />
                </label>

                <label>
                  <p>Size</p>
                  <input
                    type='text'
                    value={this.state.painting.size}
                    name="size"
                    onChange={this.handleChange("size")}
                  />
                </label>

                <label>
                  <p>Materials</p>
                  <input
                    type='text'
                    value={this.state.painting.materials}
                    name="materials"
                    onChange={this.handleChange("materials")}
                  />
                </label>

                <input
                  type="submit"
                  value="Confirm Changes"
                  className="ADMIN-button"
                />
                <div className="controls">

                  <button
                    onClick={this.refreshPreview}
                    type="button"
                    className="ADMIN-button"
                  >
                    Generate Preview
                  </button>

                  <button
                    onClick={this.resetFields}
                    type="button"
                    className="ADMIN-button"
                  >
                    Reset Painting
                  </button>

                  <button
                    onClick={this.toggleDeleteDialog}
                    type="button"
                    className="ADMIN-button ADMIN-button-delete"
                  >
                    Delete Painting
                  </button>

                  <div style={{visibility:this.state.deleteDialogOpen?'visible':'hidden'}} id='deleteDialog' className='popup-message'>
                    <h3>Delete painting?</h3>
                    <p>Are you sure you want to delete this painting forever?</p>
                    <p>If you want to hide it from users, you can set its status to Draft instead.</p>
                    <button
                      type="button"
                      className="ADMIN-button ADMIN-button-cancel"
                      onClick={this.toggleDeleteDialog}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="ADMIN-button ADMIN-button-delete"
                      onClick={this.onDeleteClick(this.props.paintingId)}
                    >
                      Delete Permanently
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div id="preview-painting">
            <div id="preview-painting-container">
              <PaintingPopup
                paintingId={this.props.paintingId}
                painting={this.state.painting}
                refreshPreview={this.state.refreshPreview}
              />
            </div>
          </div>
        </div>
      );
    } else {
      return "Loading";
    }
  }

  handleChange = (name) => (event) => {
    let painting = this.state.painting;
    painting[name] = event.target.value;
    this.setState({ painting });
  };

  editPaintingDate = event => {
    let newDate = new Date(event.target.value);

    console.log(new Date(newDate.toUTCString()))
    this.setState({
      painting: {...this.state.painting, date: newDate.toUTCString()}
    })
  }

  resetFields = () => {
    this.setState({
      painting: { ...this.props.paintingDict[this.props.paintingId] },
    });
  };

  refreshPreview = () => {
    this.setState({ refreshPreview: !this.state.refreshPreview });
  };

  onSubmit = e => {
    e.preventDefault();

    const painting = this.state.painting;

    let newPainting = {};
    for (let key in painting){
      // Omit if not specified
      if(painting[key]!==null){
        newPainting[key] = painting[key];
      }
    }

    this.props.updatePainting({
      id: this.props.paintingId,
      newPainting: newPainting,
    });

    this.props.getPainting(this.props.paintingId);
  }

  toggleDeleteDialog = () => {
    this.setState({
      deleteDialogOpen: !this.state.deleteDialogOpen
    });
  }
  getFormDate = () => {
    if(this.state.formDate){
      return this.state.formDate
    } else {
      let dbDate = this.state.painting.date;
      if(dbDate){
        dbDate = new Date(dbDate);
        let y = dbDate.getFullYear().toString();
        let m = dbDate.getMonth()+1;
        m = m.toString();
        if(m.length === 1){
          m = '0' + m;
        }
        let d = dbDate.getDate().toString();
        if(d.length === 1){
          d = '0' + d;
        }
        let string = `${y}-${m}-${d}`;
        return string;
      } else {
        return undefined;
      }
    }
  }

  dbDateToFormDate = () => {
    let dbDate = this.state.date;
    return dbDate;
  }

  onDeleteClick = (id) => () => {
    this.props.deletePainting(id);
    this.toggleDeleteDialog();
    window.location.href = '/admin/';
  }

  togglePhotoEditMode = () => {
    this.setState({
      editPhotos: !this.state.editPhotos
    })
  }

}







OnePaintingEditor.propTypes = {
  paintingDict: PropTypes.object.isRequired,
  allLoading: PropTypes.bool.isRequired,

  getPainting: PropTypes.func.isRequired,
  updatePainting: PropTypes.func.isRequired,
  deletePainting: PropTypes.func.isRequired,

  paintingId: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  paintingDict: state.paintings.paintingDict,
  allLoading: state.paintings.allLoading,
});

const myActions = { getPainting, updatePainting, deletePainting};

export default connect(mapStateToProps, myActions)(OnePaintingEditor);
