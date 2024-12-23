import {makePostRequest} from './requester'

function clientLog<T>(message : string) : void {
    console.log("clientLog message:",message);
    const body = JSON.stringify({
        message: message
    });
    makePostRequest<T>('api/log/info', body).then((response)=>{
            console.log("clientLog response:", response.message);
    }).catch((error) => {
        console.log("logging failed:", error)
    });
    return;
}

export default clientLog;
