
import React from 'react';

const SideButton = ({props:{ text, href, background_color, text_color }}) => {
  // Color like '#fefe3c'
  return (
    <a href={href}>
      <div className='button-side' style={{'color': text_color, 'background': background_color}}>
       {text}
      </div>
    </a>
  )
}

/*
text_color: 'rgb(220,255,200)',
background_color: 'rgb(50, 100, 50)'
*/

export default SideButton;
