import {register} from "./httpClient.js";
import {fail} from "k6";

export let options = {
    scenarios: {
        sc_one: {
            executor: 'per-vu-iterations',
            vus: 5,
            iterations: 2,
            maxDuration: '5m',
            exec: 'test1'
        },
        // sc_two: {
        //     executor: 'per-vu-iterations',
        //     vus: 1,
        //     iterations: 2,
        //     maxDuration: '5m',
        //     exec: 'test2'
        // }
    },
    thresholds: {
        http_req_duration: ['p(95)>1000'],
    }

}

export function setup() {
    const res = register()
    return {token: res}
}

export function test1(authToken) {
    console.log(JSON.stringify(authToken))
}

// export function test2(token) {
//     console.log('*********')
//     console.log(JSON.stringify(token))
// }

export function teardown() {
    console.log('done')
}