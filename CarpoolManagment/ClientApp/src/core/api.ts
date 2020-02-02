import axios, { AxiosResponse, AxiosError } from 'axios';
import * as notificationService from './notifications';

const API_HOST = 'https://localhost:44316/api';

const fetchingInstance = axios.create({
    baseURL: API_HOST,
    timeout: 10000,
    responseType: 'json',
});

const postingInstance = axios.create({
    baseURL: API_HOST,
    timeout: 10000,
    responseType: 'text',
});

// TODO Error handling
fetchingInstance.interceptors.response.use((response) => response, (error) => { 
    if (error.response && error.response.data && error.response.data.message) {
        notificationService.error(error.response.data.message)
    } else {
        notificationService.error();
    }
});

postingInstance.interceptors.response.use((response) => { 
    console.log(response);
    if(response.data) {
        notificationService.success(response.data);
    }
    return response;
}, (error: AxiosError) => { 
    if (error.response && error.response.data) {
        notificationService.error(error.response.data)
    } else {
        notificationService.error();
    }
});

const get = async <T>(url: string): Promise<T> => {
    const res = await fetchingInstance.get<T>(
        url,
        {
            transformResponse: (response: T) => response,
        },
    );
    return res.data;
};

const del = async (url: string): Promise<AxiosResponse> => {
    const res = await postingInstance.delete(url);
    return res;
};

const post = async (url: string, data: string): Promise<AxiosResponse> => {
    const res = await postingInstance.post(
        url,
        data,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    )
    return res;
};

const put = async (url: string, data: string): Promise<AxiosResponse> => {
    const res = await postingInstance.put(
        url,
        data,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    )
    return res;
};

export default {
    get,
    del,
    post,
    put,
};
