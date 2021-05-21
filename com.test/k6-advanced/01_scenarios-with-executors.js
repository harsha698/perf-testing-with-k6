import {getResource, createUser, usersData, getUser, delayResponse, getContact} from "./httpClient.js";
import {fail} from "k6";

export const options = {
    scenarios: {
        sc_shared_iterations: {
            executor: 'shared-iterations',
            tags: {'type': 'create-user'},
            vus: 5,
            iterations: usersData.ids.length,
            maxDuration: '1h',
            exec: 'test1'
        },
        sc_per_vu_iterations: {
            executor: 'per-vu-iterations',
            vus: 10,
            iterations: 5,
            maxDuration: '1h',
            exec: 'test2'
        },
        sc_constant_vus: {
            executor: 'constant-vus',
            env: {USER_TYPE: 'employee'},
            vus: 1,
            duration: '5s',
            exec: 'test3'
        },
        sc_ramping_vus: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                {duration: '1s', target: 5},
                {duration: '5s', target: 5},
                {duration: '1s', target: 0}
            ],
            gracefulRampDown: '5s',
            exec: 'test4'
        },
        // sc_constant_arrival_rates: {
        //     executor: 'constant-arrival-rate',
        //     rate: 10,
        //     duration: '1m',
        //     preAllocatedVUs: 10,
        //     maxVUs: 50,
        //     exec: 'test5',
        //     tags: {'type': 'get_contacts'}
        // }
    },
    thresholds: {
        'http_req_duration{type:create-user}': ['p(95)<1000'],
        'http_req_duration{type:extra-create-user-tag}': ['max<2000'],
        'http_req_duration{type:get-resource}': ['avg<1000'],
        'http_req_duration{type:get-user}': ['min<500'],
        'http_req_duration{type:delay-response}': ['max<5000'],
        'http_req_duration{scenario:get_contacts}': ['p(95)<1500', 'max<2000']
    }
}

/*
* Don't use min and max in thresholds
We don't recommend using min and max for specifying thresholds because these values represent outliers. Use percentiles instead.
* */

export function test1() {
    createUser()
}

export function test2() {
    getResource()
}

export function test3() {
    if (__ENV.USER_TYPE != 'employee') {
        fail(`User ${__ENV.USER_TYPE} is not authorised`)
    }
    getUser()
}

export function test4() {
    delayResponse()
}

export function test5() {
    getContact()
}