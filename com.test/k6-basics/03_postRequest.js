import http from "k6/http";
import {checkIfRequestSucceeded} from "./helpers.js";

export const options = {
    vus: 5,
    duration: '2s'
}

export default function run() {
    const reqBody = JSON.stringify({
        redir:1,
        csrftoken:'NDMyMTgzMTUz',
        login:'admin',
        password:'123'
    })
    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
        tags: {'type': 'post-call'}

    }
    checkIfRequestSucceeded(http.post('http://test.k6.io/login.php', reqBody, params))
}