import React, { useState } from 'react';

function Checkbox(props) {
    const {check, setCheck} = props;
    return  (
        <div className='custom-checkbox'>
            <div className='custom-checkbox--check'>
                <button onClick={()=>setCheck(!check)} type='button' className='custom-checkbox--button'></button>
                <div className='custom-checkbox--back'></div>
                <div className='custom-checkbox--tick' ticked={check?'true':''}></div>
            </div>
            <div className='custom-checkbox--text'>{props.children}</div>
        </div>
    );
}

export default Checkbox;