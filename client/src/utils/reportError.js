import axios from 'axios';
import PROXY from '../actions/PROXY';

function reportError(error, errorInfo){
    // Headers
    const headers = {
        "Content-Type": "application/json",
    };

    // Request
    axios.post(`${PROXY}/api/errors/report`, {error: error.toString(), where: errorInfo.componentStack.toString()})
}

export default reportError;