import {environment} from '@/utils/environment';

const PORT = environment['SERVER_PORT'] || 3035;
const URL = environment['SERVER_URL'] || '192.168.0.249';

export class MakeRequestError extends Error {
    public readonly response: any;
    constructor(message, response) {
        super(message);
        this.name = 'MakeRequestError';
        this.response = response;
    }
}


async function makeRequest<T>(url: string, requestOptions: object): Promise<T> {
    return fetch(url, requestOptions)
        .then((response) => {
            // todo: check for status code 
           if (!response.ok) {
               if(response.status !== 404){
                   console.warn('MakeRequestError: ', response);
               }
               throw new MakeRequestError(`${response.status} - ${response.statusText}`, response);
           }
           return response.json();
        }).catch((error)=>{
            console.log("url:", url)
            console.log("requestOptions:", requestOptions)
            throw error;
        });
}


function objectToRecord(obj: object): Record<string, string> {
    const record: Record<string, string> = {};

    for (const [key, value] of Object.entries(obj)) {
        record[key] = String(value); // Convert each value to a string
    }

    return record;
}
export interface GetRequestOptions {
    path: string;
    token?: string;
    params?: URLSearchParams | object;
}

export async function makeGetRequest<T>(
    {
        path,
        token,
        params = new URLSearchParams(),
    }: GetRequestOptions): Promise<T>
{
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const searchParams =
        params instanceof URLSearchParams
            ? params
            : new URLSearchParams(objectToRecord(params));

    const url = `http://${URL}:${PORT}/${path}${( searchParams.size > 0)?`?${searchParams.toString()}`:''}`;

    const requestOptions = {
        method: 'GET',
        headers,
    };
    return makeRequest<T>(url, requestOptions);

}

interface PostRequestOptions {
    path: string;                 
    token?: string;            
    body?: object | string;        
    params?: URLSearchParams | object; 
}

export async function makePostRequest<T>(
    {
        path,
        token,
        body = {},
        params = new URLSearchParams(),
    }: PostRequestOptions): Promise<T>
{
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