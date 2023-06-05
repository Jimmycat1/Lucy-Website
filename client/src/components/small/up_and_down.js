import React, {useCallback} from 'react';

function up_and_down(on_up, on_down){
  return (<>
    <div className='up_and_down'>
      <button onClick={on_up}> &#x25B2; </button>
      <button onClick={on_down}> &#x25BC; </button>
    </div>
  </>)
}

export default up_and_down;
