const envSample = require('fs').readFileSync('.env', { encoding: 'utf8' })

console.log(envSample, process.env)