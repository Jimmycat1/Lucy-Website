function sanitise_from_html (textString){
  if (typeof textString !== 'string'){return 'INVALID DATA'}
  // remove < and >
  new_textString = ''
  for (let char of textString){
    if ((char!=='<')&&(char!=='>')){
      new_textString = new_textString + char;
    }
  }
  return new_textString;
}

module.exports =  sanitise_from_html;

//   if (typeof textString !== 'string'){return 'INVALID DATA'} //
