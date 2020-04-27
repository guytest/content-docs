const mdx = require('@mdx-js/mdx');
const http = require('http')

async function parseMDX(file) {
    const contents = await readFile(file, 'utf8');
    parsed = await mdx(contents)
    console.log("parsed successfully!")
}

function requestHandler(req, res) {
    // console.log(req)
    if (req.method != 'POST') {
        res.statusCode = 405
        res.end('Only POST is supported')
    }
    let body = ''
    req.setEncoding('utf8');
    req.on('data', function (data) {
        body += data
    })
    req.on('end', async function () {
        //   console.log('Body length: ' + body.length)
        try {
            parsed = await mdx(body)
            res.end('Successfully parsed mdx')
        } catch (error) {
            res.statusCode = 500
            res.end("MDX parse failure: " + error)   
        }
    })
}

const server = http.createServer(requestHandler);

server.listen(6060, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`MDS server is listening on port: 6060`)
});

