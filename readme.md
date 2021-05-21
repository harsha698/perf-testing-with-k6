# Performance testing with k6

## How to run
1. [Install k6](https://k6.io/docs/getting-started/installation/) in your machine
2. cd to this repo.
3. Run `npm install`
4. cd to `com.test`
5. Run any test script using below command
```
k6 run <name of the script.js>
```
In case want to run any script by passing env variables then use below command
```
k6 run <name of the script.js> --env ENV_VARIABLE1=value1 --env ENV_VARIABLE2=value2
```
