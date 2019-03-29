//Load HTTP module
const http = require("http")
const https = require('https')
const url = require("url")
var fs = require('fs')
var path = require('path')
const hostname = '127.0.0.1'
const port = 3000;

// thse shouldn't be here, it is not safe to keep there exposed to git history in plain text
// I would store them as env variables (i.e. in case of k8s deployment, i'd set them in k8s secret and export them in the pod env variables
const username = 'admin'
const password = 'password'
const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64')

//Create HTTP server and listen on port 3000 for requests
http.createServer(function (req, response) {
    var filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }
    const urlParts = url.parse(req.url)
    const pathname = urlParts.pathname

    switch (pathname) {
        case '/product-details':
            const pid = url.parse(req.url).query.split('=')[1]
            const opts = {
                host: 'interview-tech-testing.herokuapp.com',
                path: '/product-details/' + pid,
                method: 'GET',
                headers: {'Authorization': auth}}
            var body = ''
            https.request(opts, (function (res) {
                res.on('data', (function (data) {
                    body += data.toString()
                }))
                res.on('end', function() {
                    console.log('returning body', body)
                    response.end(body)
                })
            })).on('error', (function (e) {
                console.log('Error:', e)
            })).end()
            break
    }

    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml'
    }

    var contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function (error, content) {
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile('./404.html', function (error, content) {
                    response.writeHead(200, {'Content-Type': contentType});
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                response.end();
            }
        }
        else {
            response.writeHead(200, {'Content-Type': contentType})
            response.end(content, 'utf-8')
        }
    })
}).listen(port, hostname, function () {
    console.log('Server running at http://' + hostname + ':' + port + '/')
})
