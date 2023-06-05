
import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {getPainting} from '../actions/paintingsActions';
import {basket_item_add} from '../actions/basketActions';
import Slideshow from './Slideshow';
import RequestPainting from './RequestPainting';
import {USE_BASKET, contact_email} from '../config.js';

// The painting details page.
// Updated to use hooks.
// Painting can enter through store or through being specified in props (for preview feature).
// refreshToggle can be changed to apply updates to the painting.

function PaintingPopup_functional ({paintingId, painting_is_provided,  painting_that_is_provided, refreshToggle}){

  const dispatch = useDispatch();

  let painting_source = useSelector((state) => {
    let answer = {from_props: false, from_store: false}
    // Determine if you can get painting from store
    let pD = state.paintings.paintingDict;
    if (Object.keys(pD).includes(paintingId)){
      // See if the painting is fully there.
      if (pD[paintingId].filename){
        answer.from_store = true;
      }
    }
    // Determine if you can get painting from props
    if (painting_is_provided === true){
      answer.from_props = true;
    }

    return answer;
  });

  // Get painting from store if already there
  let painting_from_store_maybe = useSelector((state) => {
    let pD = state.paintings.paintingDict;
    return pD[paintingId]
  });

  // The actual painting object as in DB
  let painting = {};
  let painting_was_found = true;
  if (painting_source.from_props === true) {
    painting = painting_that_is_provided;
  } else
  if (painting_source.from_store === true){
    painting = painting_from_store_maybe;
  } else {
    // Nowhere available so get from DB
    painting_was_found = false;
  }

  // Whether load request was already issued
  const allLoading = useSelector((state)=> state.paintings.allLoading);


  // Load painting if not loading and if not already there
  useEffect(()=>{
    if ((painting_was_found !== true) && (allLoading !== true)){
      getPainting(paintingId)(dispatch);
    }
  }, [painting_was_found, paintingId, allLoading])

  // RENDER
  if (painting_was_found === true){
      const {_id,name,filename,description} = painting;
      //const formattedDate = this.formatDate(date);
      return (
          <React.Fragment>
              {/* This is the section that shows when the main painting is clicked. */}
              <div className='painting-photo-popup' id={_id}>
                  <div className='oneColumn'>

                      <Slideshow filenames={filename}></Slideshow>

                      { // Only if basket feature has been enabled
                        (USE_BASKET===true)?
                        (<a onClick={() => {
                          dispatch(basket_item_add(_id))
                        }} className='button-regular'>
                          Request to Buy
                        </a>)
                        :('')
                      }

                      <div className='meta-data'>
                          <h4 className='painting-title'>{name}</h4>
                          <div className='painting-description'>
                              {description}
                          </div>
                          {genFeatures({
                            materials: painting.materials,
                            size: painting.size,
                            price: painting.price,
                            status: painting.status
                          })}
                          <p>You can purchase this artwork by emailing {contact_email} or by writing below.</p>
                          <a className='button-regular'> Request painting below </a>
                      </div>
                  </div>
              </div>
              {/* Form to order this painting (by message) */}
              <RequestPainting paintingID={_id} paintingName={name}/>

          </React.Fragment>
      )
  }
  else {
      return '';
  }
}

const formatDate = date => {
  if (date){
      const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      const month = parseInt(date.substring(5,7)-1);
      const formattedMonth = MONTHS[month];
      const year = date.substring(0,4);
      const formattedDate = `${formattedMonth} ${year}`;
      return formattedDate;
  } else {
      return '';
  }
}

// Generates icons for price, materials, and so on.
const  genFeatures = ({ materials, size, price, status }) =>{
  const featureList = [];
  if (materials){
      let value = materials;
      let insert = (
          <>
              <i className='fas fa-palette'></i><p>{value}</p>
          </>
      );
      featureList.push(['#ffee99', insert]);
  }

  if (status==='Available'){
      if (price){
          let value = '£'+parseFloat(price).toFixed(2).toString()
          let insert = (
              <>
                  <i className='fas fa-money-bill-wave'></i><p>{value}</p>
              </>
          );
          featureList.push(['#cceebb', insert]);
      }
  }


  if (size){
      let value = size;
      let insert = (
          <>
              <i className='fas fa-pencil-ruler'></i><p>{value}</p>
          </>
      )
      featureList.push(['#ccdde0', insert]);
  }

  // Display if features present
  if (featureList.length > 0){
      const insert = (
          <div className='painting-features'>
              <ul>
                  {featureList.map((feature, index) => {
                      return (<li style={{'color':feature[0]}} key={index}>{feature[1]}</li>);
                  })}
              </ul>
          </div>
      );

      return insert;
  } else {
      return '';
  }
}

const genButton = status => {
  if (status){

      switch(status){
          /*case 'Available':
              const price = this.props.painting.price;
              if(price){
                  return (<button type='button'>Add to Cart - {'£'+price.toString()}</button>);
              } else {
                  return (<button type='button'>Request this Painting</button>);
              }
          */
          case 'Available':
              return (<button type='button'>Request this Painting</button>);

          case 'Reserved':
              return (<button type='button' disabled>This Painting is Reserved.</button>);

          case 'Sold':
              return (<button type='button' disabled>This Painting Already has a Home</button>);

          default:
              return '';
      }


  } else {
    return '';
  }
}

export default PaintingPopup_functional;
