import React, {Fragment} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import up_and_down from './small/up_and_down';
import {basket_item_more, basket_item_less, basket_close} from '../actions/basketActions.js';

// A popup component with access to paintings in basket.
function Basket(){
  const basket = useSelector((state) => state.basket);
  const items = basket.items;
  const paintingDict = useSelector((state) => state.paintings.paintingDict)

  const dispatch = useDispatch();

  return (<>
    <div className={`basket-dropdown ${basket.DropdownOpen?(''):('closed')}`}>
      <h3 className='heading-big'> Basket </h3>
      <h4 className='heading-sub'>  Add paintings and cards here to request to buy them. </h4>
      {
        get_item_list_JSX(paintingDict)
      }
      <p className='heading-sub'>   Number of items in basket: {basket.numItems} </p>
      <button className='basket-dropdown--up' onClick={()=>{dispatch(basket_close())}}>Up</button>
    </div>
  </>);

  // Produces renderable item list
  // TEST what happens if itemID not in itemDict.
  // Not tested yet.
  function get_item_list_JSX(itemDict){
    let JSX_list = [];
    for (let itemInfo of items){
      let item = itemDict[itemInfo.id];

      let link = `/paintings/${item._id}`;

      let JSX_to_add = (<Fragment key={itemInfo.id}>
        <div className='basket-item'>
          <div className='basket-item--col-1'>
            <div className='basket-item--image'>
              <img src={`/images/${item.filename[0]}`}/>
            </div>
          </div>
          <div className='basket-item--col-2'>
            <div className='basket-item--name'>{item.name}</div>
            <div className='basket-item--price'>£{item.price}</div>
            <div className='basket-item--link'>
              <Link to={link} onClick={() => dispatch(basket_close())} >
                Item Details (click)
              </Link>
            </div>
          </div>
          <div className='basket-item--col-3'>
            <div className='basket-item--count'>x{itemInfo.count}</div>
          </div>
          <div className='basket-item--col-4'>
            <div className='basket-item--up_and_down'>
            {up_and_down(
              () => { on_increase_amount(itemInfo, item.stock_amount) } ,
              () => { on_decrease_amount(itemInfo, 0)                 } ,
            )}
            </div>
          </div>
        </div>
      </Fragment>)

      JSX_list.push(JSX_to_add);
    }
    return JSX_list;
  }

  function on_increase_amount(itemInfo, max){
    if (itemInfo.count <= max){
      dispatch(basket_item_more(itemInfo.id))
    }
  }

  function on_decrease_amount(itemInfo, min){
    if (itemInfo.count >= min){
      dispatch(basket_item_less(itemInfo.id))
    }
  }

}



export default Basket;
