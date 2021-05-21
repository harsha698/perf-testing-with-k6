import {httpGet, httpPost} from "./httpHelper.js";
import {Counter} from "k6/metrics";
import {randomIntBetween} from "https://jslib.k6.io/k6-utils/1.1.0/index.js";
import http from "k6/http";

export const usersData = JSON.parse(open('../test-data/users.json'))

const resource = new Counter('get-resource');
const users = new Counter('create-users');
const existingUser = new Counter('get-user');
const delayInResponse = new Counter('delay-response');

let param = {
    headers: {
        'Content-Type': 'application/json'
    }
}

export function createUser() {
    param.tags = {'type': 'extra-create-user-tag'}
    usersData.ids.forEach(user => {
        httpPost('https://reqres.in/api/users', JSON.stringify({
            "name": user,
            "job": "leader"
        }), param)
    })
    users.add(1)
}

export function getResource() {
    param.tags = {'type': 'get-resource'}
    const response = httpGet('https://reqres.in/api/unknown/2', param)
    // console.log(JSON.parse(response.body).data.name);
    resource.add(1)
}

export function getUser() {
    param.tags = {'type': 'get-user'}
    httpGet('https://reqres.in/api/users/2', param)
    existingUser.add(1)
}

export function delayResponse() {
    const delay = randomIntBetween(1, 4)
    const url = `https://reqres.in/api/users?delay=${delay}`
    param.tags = {'type': 'delay-response'}
    const res = httpGet(url, param)
    delayInResponse.add(1)
    return res
}

export function getContact() {
    httpGet('https://test.k6.io/contacts.php')
}

export function triggerMultipleCalls() {
    let res
    res = httpGet('https://reqres.in/api/users?page=2')
    res = httpGet('https://reqres.in/api/users/2')
    res = httpGet('https://reqres.in/api/unknown/2')
    return res
}

export function userNotFound() {
    const resp = http.get('https://reqres.in/api/users/23')
    return resp
}

export function getAllResources() {
    const resp = httpGet('https://reqres.in/api/unknown')
    return resp
}

export function register() {
    // param.tags = {'type': 'test-life-cycle'}
    const resp = httpPost('https://reqres.in/api/register', JSON.stringify({
        "email": `eve.holt@reqres.in`,
        "password": "pistol"
    }), param)
    return resp.json().token;
    // return JSON.parse(resp.json()).token;
}
