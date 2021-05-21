/*
* Trend
* Counter
* Gauge
* Rate
* */

import {Gauge, Rate, Trend} from 'k6/metrics';
import {sleep} from 'k6';
import {getAllResources, triggerMultipleCalls, userNotFound} from "./httpClient.js";

let myTrend = new Trend('my-trend');
let errorRate = new Rate('error-rate');
let sizeGauge = new Gauge('size-gauge')

export let options = {
    scenarios: {
        sc_one: {
            executor: 'per-vu-iterations',
            vus: 1,
            iterations: 1,
            maxDuration: '1m',
            exec: 'my_trend'
        },
        sc_two: {
            executor: 'constant-vus',
            vus: 5,
            duration: '10s',
            exec: 'my_rate'
        },
        sc_three: {
            executor: 'per-vu-iterations',
            vus: 2,
            iterations: 2,
            exec: 'my_gauge'
        }
    },
    thresholds: {
        'my-trend': ['p(95) > 500'],
        'error-rate': [
            // more than 10% of errors will abort the test
            'rate < 0.1'
        ],
        //http_req_failed: ['rate < 0.1']
        'size-gauge': ['value<1000'] //4000 bytes = 4Kb
    }
};

export function my_trend() {
    const resp = triggerMultipleCalls()
    myTrend.add(resp.timings.waiting);
    sleep(1);
}

export function my_rate() {
    const res = userNotFound();
    errorRate.add(res.status >= 400)
}

export function my_gauge() {
    const res = getAllResources()
    sizeGauge.add(res.body.length)
}