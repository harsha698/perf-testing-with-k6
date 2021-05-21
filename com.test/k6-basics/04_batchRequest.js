import http from "k6/http";
import {checkIfRequestSucceeded} from "./helpers.js";

export const options = {
    vus: 1,
    duration: '1s'
}

export default function runK6() {
    let responses = http.batch([
        /*method type, url, body, params*/
        ['GET', 'https://reqres.in/api/users?page=2', null, {tags: {'type': 'get-users-of-page-2'}}],
        ['POST', 'https://reqres.in/api/users', JSON.stringify({
            "name": "morpheus",
            "job": "leader"
        }), {tags: {'type':'create-user'}}],
        ['PUT', 'https://reqres.in/api/users/2', JSON.stringify({
            "name": "morpheus",
            "job": "zion resident"
        }), {tags: {'type': 'update-user'}}],
        ['PATCH', 'https://reqres.in/api/users/2', JSON.stringify({
            "name": "morpheus",
            "job": "zion resident"
        }), {tags: {'type': 'patch-user'}}]
    ])
    responses.forEach(response=>{
        checkIfRequestSucceeded(response)
    })
    console.log(responses[0].body.toString())
    const jsonResponse = JSON.parse(responses[0].body)
    jsonResponse.data.forEach(dataElement=>{
        console.log(dataElement.email)
    })

}