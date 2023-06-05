import React from 'react';
import {useSelector} from 'react-redux';

const Loader = () => {
  const num_loaders = useSelector((state) => (state.num_loaders))
  if (num_loaders > 0){
    return (
      <div className='loadSign'>
        <div className='circle-loader'></div>
      </div>
    )
  } else {
    return ('')
  }
}

export default Loader;
