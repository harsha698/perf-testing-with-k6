import {fail} from "k6";

export let options = {
    scenarios: {
        sc_one: {
            executor: 'shared-iterations',
            vus: 1,
            iterations: 2,
            maxDuration: '2m',
            exec: 'test1'
        },
        sc_two: {
            executor: 'shared-iterations',
            vus: 1,
            iterations: 2,
            maxDuration: '2m',
            exec: 'test2'
        }
    }
}

export function setup() {
    if (__ENV.SET_UP) {
        console.log(`setup vu is ${__VU}`)
    } else {
        fail(`Setup is not required`)
    }

}

export function test1() {
    console.log(`sc_one vu is ${__VU}`)
    console.log(`sc_one iter is ${__ITER}`)
}

export function test2() {
    console.log(`sc_two vu is ${__VU}`)
    console.log(`sc_two iter is ${__ITER}`)
}

export function teardown() {
    if (__ENV.TEAR_DOWN) {
        console.log(`teardown vu is ${__VU}`)
    } else {
        fail(`Tear down is not required`)
    }
}