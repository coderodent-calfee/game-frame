import { environment } from '@/utils/environment';

const PORT = environment['SERVER_PORT'] || 3035;
const URL = environment['SERVER_URL'] || '192.168.0.249';


async function makeRequest<T>(url: string, requestOptions: object): Promise<T> {
    console.log("url:", url)
    console.log("requestOptions:", requestOptions)
    return fetch(url, requestOptions)
        .then((response) => {
            // todo: check for status code 
           if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
           }
           return response.json();
        });
}

export async function makeGetRequest<T>(path : string, params: URLSearchParams = new URLSearchParams() ) : Promise<T>{
    const requestOptions = {
        method: 'GET',
    };
    const url = `http://${URL}:${PORT}/${path}${( params.size > 0)?`?${params.toString()}`:''}`;
    return makeRequest<T>(url, requestOptions);
}

interface PostRequestOptions {
    path: string;                 
    jwtToken?: string;            
    body?: object | string;        
    params?: URLSearchParams | object; 
}

function objectToRecord(obj: object): Record<string, string> {
    const record: Record<string, string> = {};

    for (const [key, value] of Object.entries(obj)) {
        record[key] = String(value); // Convert each value to a string
    }

    return record;
}

export async function makePostRequest<T>({
                                             path,
                                             token,
                                             body = {},
                                             params = new URLSearchParams(),
                                         }: PostRequestOptions): Promise<T>{
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    // Convert plain object to URLSearchParams if necessary
    const searchParams =
        params instanceof URLSearchParams
            ? params
            : new URLSearchParams(objectToRecord(params));

    const url = `http://${URL}:${PORT}/${path}${( searchParams.size > 0)?`?${searchParams.toString()}`:''}`;
    
    const requestOptions = {
        method: 'POST',
        headers,
        body : typeof body === 'string' ? body : JSON.stringify(body)
    };
    return makeRequest<T>(url, requestOptions);
}

export const url = `http://${URL}:${PORT}`;