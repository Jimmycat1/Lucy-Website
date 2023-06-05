
// Returns date as DD Mmmm YYYY (e.g. 14 June 2008)
// As a string
function getDateNaturalString(){
    let months = ['January', 'February','March','April','May','June','July','August','September','October','November','December'];
    // current timestamp in milliseconds
    let ts = Date.now();

    let date_ob = new Date(ts);
    let day = date_ob.getDate();
    let month = months[date_ob.getMonth()]; // Alright as alreay 0 indexed
    let year = date_ob.getFullYear();

    // The formatted string
    return `${day} ${month} ${year}`;
}

// Returns hh:mm as string.
function getTimeNaturalString(){
    let ts = Date.now();

    let date_ob = new Date(ts);
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();

    return `${hours}:${minutes}`;
}

// Combines date and time into hh:mm DD Mmmm YYYY
function getDateTimeNaturalString(){
    return `${getTimeNaturalString()} ${getDateNaturalString()}`;
}

module.exports = {getDateNaturalString, getTimeNaturalString, getDateTimeNaturalString};