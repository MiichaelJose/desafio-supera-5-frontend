import axios from 'axios';

// http://10.0.2.2:8080

const api = axios.create({
    baseURL:'http://localhost:8080',
    headers: {
        'Content-Type':'application/json' 
    }
})

export default api;