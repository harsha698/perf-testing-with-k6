import {Counter, Gauge, Rate, Trend} from "k6/metrics";
import * as config from './config.js'
import http from "k6/http";
import {check, fail} from "k6";

const counters = new Counter('my_counter');
const rates = new Rate('error_rate');
const trends = new Trend('my_trend');
const gauges = new Gauge('my_gauge');

const testUsers = JSON.parse(open('../test-data/users.json'))
const userType = config.userType

const param = {
    headers: {
        'Content-Type': 'application/json'
    }
}

export let options = {
    scenarios: {
        sc_shared_iterations: {
            executor: 'shared-iterations',
            vus: config.parallel_thread_counts,
            iterations: config.no_of_users,
            maxDuration: '1h',
            exec: 'create_users',
            tags: {'testType': 'create-users'}
        },
        sc_constant_vus: {
            executor: 'constant-vus',
            vus: config.parallel_thread_counts,
            duration: config.test_duration,
            exec: 'get_users'
        },
        sc_per_vu_iterations: {
            executor: 'per-vu-iterations',
            vus: config.parallel_thread_counts,
            iterations: config.iters_per_vu,
            maxDuration: '1h',
            exec: 'get_resources'
        },
        sc_ramping_vus: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                {target: 10, duration: '10s'},
                {target: 10, duration: '1m'},
                {target: 0, duration: '5s'}
            ],
            exec: 'delay_response'
        }
    },
    thresholds: {
        //tags in test
        // tags in scenarios
        // normal metrics
        // custom metrics threshold
    },
    discardResponseBodies: true
}

export function setup(){
    if(userType==='reqres'){
        const res = http.post(`https://reqres.in/api/register`, JSON.stringify({
            "email": "eve.holt@reqres.in",
            "password": "pistol"
        }), param)
        return res.json().token
    }
    else{
        fail(`Un-authorised user`)
    }
}

export function create_users(token) {
    param.tags = {'testType': 'create_users_method'}
    testUsers.ids.forEach(user => {
        const res = http.post(`https://reqres.in/api/users`, JSON.stringify({
            "name": user,
            "job": "leader"
        }), param)
        check(res, {
            'resp-check': (r) => r.json().name === user,
            'status-check': (r) => r.status < 400
        })
    })
}

export function get_users() {
    param.tags = {'testType': 'get_users'}
    const res = http.get('https://reqres.in/api/users?page=2', param)
    check(res, {
        'response-check': (r) => {
            r.json().data.forEach(element => {
                element.avatar.contains('https://reqres.in/img/faces/')
            })
        },
        'status-check': (r) => r.status < 400
    })
}

export function get_resources() {
    const res = http.batch([
        ['GET', 'https://reqres.in/api/unknown', null, buildParams({'testType': 'get-all-resources'})],
        ['GET', 'https://reqres.in/api/unknown/2', null, buildParams({'testType': 'get-single-resource'})],
        ['GET', 'https://reqres.in/api/unknown/23', null, buildParams({'testType': 'get-unknown-resource'})]
    ])
    check(res[2], {
        'status-check': (r) => r.status === '404'
    })
}

export function delay_response() {
    const delayTime = config.delayTime
    const delayTimeInMs = delayTime * 1000
    param.tags = {'testType': 'delay-response'}
    const url = `https://reqres.in/api/users?delay=${delayTime}`
    const res = http.get(url, param)
    check(res, {
        'response-time-check': (r) => r.timings.duration >= delayTimeInMs
    })
}

function buildParams(tag) {
    return {
        headers: {
            'Content-Type': 'application/json'
        },
        tags: {tag}
    }
}