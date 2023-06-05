import axios from 'axios';

const getCSRFToken = async () => {
    const {data} = await axios.get('/api/csrf-token');
    axios.defaults.headers['X-CSRF-Token'] = data.csrfToken;
}

export default getCSRFToken;