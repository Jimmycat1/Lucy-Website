import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { getPainting } from "../../actions/paintingsActions";
import { updatePainting, deletePainting } from '../../actions/adminActions';

import PaintingPopup_functional from "../../components/PaintingPopup_functional";
import Slideshow from '../../components/Slideshow';
import PhotoCollectionEditor from '../../components/admin/PhotoCollectionEditor';


function convert_date_from_UTC_to_yymmdd(date){
  let the_Date = new Date(date)
  let y = the_Date.getFullYear().toString()
  let m = the_Date.getMonth()+1
  m = m.toString();
  if(m.length === 1){
    m = '0' + m
  }
  let d = the_Date.getDate().toString()
  if(d.length === 1){
    d = '0' + d
  }
  let string = `${y}-${m}-${d}`
  return string
}

const OnePaintingEditor = ({paintingId}) => {
  const dispatch = useDispatch()

  // FROM GLOBAL DATA STORE //
  // The original painting before changes made by the artist
  const original_painting = useSelector(state => state.paintings.paintingDict[paintingId] || {})

  // STATE //
  // Whether original painting is not loaded (yet)
  const [paintingEmpty, set_paintingEmpty] = useState(Object.keys(original_painting).length === 0)
  // The updated painting after changes made by the artist
  const [updated_painting, set_painting] = useState(original_painting);
  // Whether photo edit mode is on
  const [photo_edit_mode_on, change_photo_edit_mode_on] = useState(false)
  // Whether delete dialog is open
  const [deleteDialogOpen, set_deleteDialogOpen ] = useState(false)
  // Whether to show original or updated painting in preview
  const [Preview_shows_updated, set_Preview_shows_updated] = useState(true);

  // HELPER FUNCTIONS //
  const set_painting_key = (name, value) => {
    set_painting({...updated_painting, [name]:value})
  }
  const on_painting_value_change = (name) => (e) => {
    let value = e.target.value
    set_painting_key(name, value)
  }

  // WHAT HAPPENS WHEN THINGS UPDATE //
  // One-time action to get painting
  useEffect(()=>{
    if (paintingEmpty){
      // Painting is not in dictionary, so get it
      getPainting(paintingId)(dispatch)
    }
  }, [paintingEmpty])
  // Update updated_painting when original painting changes.
  useEffect(()=>{
    set_painting(original_painting)
  }, [original_painting])
  // Update whether painting is empty or not after this.
  useEffect(()=>{
    set_paintingEmpty(Object.keys(original_painting).length === 0)
  }, [original_painting])

  // OUTPUT HTML //
  if (paintingEmpty === true){
    return ('Loading...')
  } else {
  // Painting is available //
  return (
        <div id="ADMIN-PAINTING-EDITOR">
          <form method="POST" onSubmit={e => {
            e.preventDefault();
            updatePainting({id: paintingId, newPainting: updated_painting})(dispatch)
          }} className='formA'>
            <h3 className='heading-medium'>Change what you want to</h3>
            <div className="twoColumns APE">
              <div className="painting">

                <button type='button' className='ADMIN-button' onClick={()=>{change_photo_edit_mode_on(!photo_edit_mode_on)}}>
                  {(photo_edit_mode_on)
                    ?(<>Done</>)
                    :(<>Change photos</>)}
                </button>
                <h5> Changes made to photos come into effect immediately. </h5>
                {(photo_edit_mode_on)
                  ?(<PhotoCollectionEditor
                      filenames={updated_painting.filename}
                      paintingID={paintingId}
                    ></PhotoCollectionEditor>)
                  :(<Slideshow filenames={updated_painting.filename}></Slideshow>)
                }

              </div>
              <div className="meta">
                <label>
                  <p> Painting id: {updated_painting._id}</p>
                </label>
                <label>
                  <p> Check how it looks {' '}
                    <a style={{'color':'cyan'}} href='/paintings/gallery' target='_blank'>
                    here
                    </a>
                  </p>
                </label>
                <label>
                  <p>Name *</p>
                  <input
                    type="text"
                    minLength="1"
                    required={true}
                    value={updated_painting.name}
                    name="name"
                    onChange={on_painting_value_change("name")}
                  />
                </label>

                <label>
                  <p>Date *</p>
                  <input
                    type="date"
                    name="date"
                    value={convert_date_from_UTC_to_yymmdd(updated_painting.date)}
                    onChange={(event)=>{
                      let newDate = new Date(event.target.value);
                      set_painting_key("date", newDate.toUTCString())
                    }}
                  />
                </label>

                <label>
                  <p>Status *</p>
                  <select
                    value={updated_painting.status}
                    name="status"
                    onChange={on_painting_value_change("status")}
                  >
                    <option>Available</option>
                    <option>Draft</option>
                    <option>Sold</option>
                    <option>Requested</option>
                    <option>Reserved</option>
                  </select>
                </label>

                <label>
                  <p>Price (£)(Just enter a number, no pound sign.)</p>
                  <input
                    type="text"
                    value={updated_painting.price||''}
                    name="price"
                    onChange={on_painting_value_change("price")}
                  />
                </label>

                <label>
                  <p>Description</p>
                  <textarea
                    rows="4"
                    value={updated_painting.description||''}
                    name="description"
                    onChange={on_painting_value_change("description")}
                  />
                </label>

                <label>
                  <p>Size</p>
                  <input
                    type='text'
                    value={updated_painting.size||''}
                    name="size"
                    onChange={on_painting_value_change("size")}
                  />
                </label>

                <label>
                  <p>Materials</p>
                  <input
                    type='text'
                    value={updated_painting.materials||''}
                    name="materials"
                    onChange={on_painting_value_change("materials")}
                  />
                </label>

                <input
                  type="submit"
                  value="Confirm Changes"
                  className="ADMIN-button"
                />
                <div className="controls">

                  <button
                    onClick = {() => {set_Preview_shows_updated(true)}}
                    type="button"
                    className="ADMIN-button"
                    disabled = {Preview_shows_updated}
                  >
                    Preview: updated painting
                  </button>
                  <button
                    onClick = {() => {set_Preview_shows_updated(false)}}
                    type="button"
                    className="ADMIN-button"
                    disabled={!Preview_shows_updated}
                  >
                    Preview: original painting
                  </button>


                  <button
                    onClick={()=> {set_painting(original_painting)}}
                    type="button"
                    className="ADMIN-button"
                  >
                    Reset Painting
                  </button>

                  <button
                    onClick={() => {set_deleteDialogOpen(true)}}
                    type="button"
                    className="ADMIN-button ADMIN-button-delete"
                  >
                    Delete Painting
                  </button>

                  <div style={{visibility: deleteDialogOpen?'visible':'hidden'}} id='deleteDialog' className='popup-message'>
                    <h3>Delete painting?</h3>
                    <p>Are you sure you want to delete this painting forever?</p>
                    <p>If you want to hide it from users, you can set its status to Draft instead.</p>
                    <button
                      type="button"
                      className="ADMIN-button ADMIN-button-cancel"
                      onClick={() => {set_deleteDialogOpen(false)}}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="ADMIN-button ADMIN-button-delete"
                      onClick={() => {
                        deletePainting(paintingId)(dispatch)
                        set_deleteDialogOpen(false)
                      }}
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
             {(Preview_shows_updated)
              ?(<PaintingPopup_functional
                paintingId={paintingId}
                painting_is_provided={true}
                painting_that_is_provided={updated_painting}
              />)
              :(<PaintingPopup_functional
                paintingId={paintingId}
                painting_is_provided={true}
                painting_that_is_provided={original_painting}
              />)}
            </div>
          </div>
        </div>
      );
    }
}

export default OnePaintingEditor;
