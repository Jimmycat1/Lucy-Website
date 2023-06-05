import axios from 'axios';
import Bottleneck from 'bottleneck';

const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 5*1000
});

const axiosBN = limiter.wrap(axios);


export default axiosBN;
