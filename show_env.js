const envSample = fs.readFileSync('.env', { encoding: 'utf8' })

console.log(envSample, process.env)