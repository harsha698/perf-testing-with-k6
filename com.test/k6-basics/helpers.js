import {check, fail} from "k6";

export function checkIfRequestSucceeded(res) {
    /**check function takes 2 arguments:
     response, an object
     object has a key and value is a fat function
     **/
    check(res, {'Request succeeded': r => r.status < 400})
    if (res.status >= 400) {
        fail(`Request ${res.request.method} - ${res.request.url} failed with status code ${res.status}`)
    }
}