/*
* Step. 1
* create a default function and export it
* with function name is optional
* During run time we pass the no. of vus and execution time
* k6 run/cloud script.js --vus 10 duration 30s
**** docker run -i loadimpact/k6 run --vus 10 --duration 30s - <script.js
* */

import http from "k6/http";
import {sleep} from "k6";

export default function runK6 (){
    http.get('http://test.k6.io/')
    sleep(1)
}
