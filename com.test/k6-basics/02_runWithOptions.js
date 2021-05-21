import http from "k6/http";
import {checkIfRequestSucceeded} from "./helpers.js";

export const options = {
    //executor: 'constant-vus'
    vus: 10,
    duration: '2s'
}

export default function runK6() {
    // checkIfRequestSucceeded(http.get('http://test.k6.io/'));
    checkIfRequestSucceeded(http.get('https://httpbin.org/'));
}