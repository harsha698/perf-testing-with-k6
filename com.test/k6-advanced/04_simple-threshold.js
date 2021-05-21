import http from 'k6/http';

export let options = {
    scenarios: {
        sc_one: {
            executor: 'constant-vus',
            vus: 2,
            duration: '15s',
            exec: 'test'
        }
    },
    thresholds: {
        http_req_failed: ['rate<0.01'],   // http errors should be less than 1%
        http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
    },
};

export function test() {
    http.get('https://test-api.k6.io/public/crocodiles/1/');
}
