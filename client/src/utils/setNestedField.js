

// Sets a field in a dictionary to a value. Uses list of keys to reference field.
// Recursive
// const setNestedField_r = (prevObject, keyStack, value) => {
//     if (keyStack.length === 0){
//         return value; // Instead of prevObject
//     }
//     let nestedObject = prevObject[keyStack[0]];
//     // Remove the key used for next iteraation
//     let removed = keyStack.shift() 
//     // Get modified internal nested object
//     let modifiedNested = setNestedField_r(nestedObject, keyStack, value)
//     prevObject[removed] = modifiedNested

//     // Returned current level of nesting with changes implemented
//     return prevObject
// }

// Sets a field in a dictionary to a value. Uses list of keys to reference field.
const setNestedField = (obj, keyStack, value) => {
    // Stack of objects that nest others - saves them
    let objList = [obj];
    try{
        for (let i=0; i<keyStack.length; i++){
            // Add nested objects to list till you arrive at final value to change
            objList.push(objList[i][keyStack[i]])
            // value to be changed also addded
        }
        // Change value
        objList[-1] = value;
        let topLevel_current = value;
        for (let i=keyStack.length-1; i>=0; i--){
            // Recombine into top level object
            objList[i][keyStack[i]] = topLevel_current
            topLevel_current = objList[i]
        }
        return topLevel_current;
    } catch(e) {
        // Probably key error
        // So return original object
        return obj;
    }
}

export default setNestedField;