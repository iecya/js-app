const express = require('express')
const path = require('path')
const request = require('request')
const app = express()
const port = 3000

// thse shouldn't be here, it is not safe to keep there exposed to git history in plain text
// I would store them as env variables (i.e. in case of k8s deployment, i'd set them in k8s secret and export them in the pod env variables
const username = 'admin'
const password = 'password'
const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64')

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/*.js', function(req, res) {
    res.sendFile(path.join(__dirname + req.url))
})

app.get('/*.css', function(req, res) {
    res.sendFile(path.join(__dirname + req.url))
})

app.get('/product-details', function(req, res) {
    const pid = req.query.pid
    const opts = {
        uri: 'https://interview-tech-testing.herokuapp.com/product-details/' + pid,
        headers: {'Authorization': auth}}
    request.get(opts).pipe(res)
})

app.listen(port, (function() {
    console.log('Server running at http://localhost:' + port + '/')
}))