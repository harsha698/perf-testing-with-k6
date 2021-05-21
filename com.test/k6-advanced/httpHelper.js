import {checkIfRequestSucceeded} from "../k6-basics/helpers.js";
import http from "k6/http";

export function httpGet(url, param = null) {
    const response = http.get(url, param)
    checkIfRequestSucceeded(response)
    return response
}

export function httpPost(url, body = null, param = null) {
    const res = http.post(url, body, param)
    checkIfRequestSucceeded(res)
    return res
}