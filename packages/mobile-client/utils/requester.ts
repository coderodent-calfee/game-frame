import { environment } from '@/utils/environment';

const PORT = environment['SERVER_PORT'] || 3000;
const URL = environment['SERVER_URL'] || '192.168.0.249';


async function makeRequest<T>(url : string, requestOptions: object ) : Promise<T>{
    console.log("url:",url)
    console.log("requestOptions:",requestOptions)
    return fetch(url, requestOptions)
        .then((response) => {
            console.log(response)
            return response.json();
        }).catch((error) => {
            console.log(error)
            return ({ok:false, error});
        });
}

export async function makeGetRequest<T>(path : string, params: URLSearchParams = new URLSearchParams() ) : Promise<T>{
    const requestOptions = {
        method: 'GET'
    };
    const url = `http://${URL}:${PORT}/${path}${( params.size > 0)?`?${params.toString()}`:''}`;
    return makeRequest<T>(url, requestOptions);
}

export async function makePostRequest<T>(path : string, body:string, params: URLSearchParams = new URLSearchParams() ) : Promise<T>{
    const requestOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body
    };
    const url = `http://${URL}:${PORT}/${path}${( params.size > 0)?`?${params.toString()}`:''}`;
    return makeRequest<T>(url, requestOptions);
}