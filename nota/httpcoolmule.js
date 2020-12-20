#!/usr/bin/node

const
    fs = require('fs'),
    http = require('http'),
    email = require('./emailcoolmule'),

    //port = process.env.SHOP_PORT || 54783, // L I S T E
    to = 'stefan.sassenberg@gmx.de';
    //subject = 'Einkaufen';

function onPostData(postEvent, data = '') {
    console.log('onPostData', data && data.length);
    //fs.appendFile('onPostData.txt', postEvent.postData, function() {});
    postEvent.postData = (postEvent.postData || '') + data;
}

function onPostEnd(postEvent) {
    //console.log('onPostEnd');
    try {
        JSON.parse(postEvent.postData);
    } catch (err) {
        //fs.writeFile('onPostEnd.txt', postEvent.postData, function() {});
        respond(postEvent.response, {httpCode: 501, content: 'parse error'});
    }

    const
        respondOk = (content) => {
            respond(
                postEvent.response,
                {
                    httpCode: 200,
                    contentType: 'application/json',
                    content: content || '{}'
                }
            );
        },
        respondFailure = () => {
            respond(postEvent.response, {httpCode: 501});
        };

    switch (postEvent.service) {
        case '':
            persistList(postEvent.postData)
                .then(
                    respondOk.bind(this, postEvent.postData),
                    respondFailure
                );
            break;
        case 'email':
            sendEmail(JSON.parse(postEvent.postData).list)
                .then(respondOk, respondFailure);
            break;
        default:
            console.log('Unknown service', postEvent.service);
            exit;
    }
}

function respond(response, config = {}) {
    //console.log('respond');
    let httpCode = config.httpCode || 200;
    let headers = {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': 'http://shop.coolmule.de',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS'
    };
    if (httpCode === 200 && config.content) {
        headers['Content-Type'] = config.contentType || 'text/html';
    }

    if (httpCode > 0) {
        //console.log('respond: headers:', headers);
        response.writeHead(httpCode, headers);
    }

    if (config.content) {
        //console.log('respond:', config.content);
        response.write(config.content);
    }

    if (config.endResponse === undefined || config.endResponse === true) {
        response.end();
    }
}

function sendAnswer(response) {
    //console.log('sendAnswer');
    createAnswer()
        .then((answer) => {
            respond(response, {httpCode: 200, contentType: 'application/json', content: answer});
        })
        .catch((err) => {
            console.error('sendAnswer', err);
            respond(response, {httpCode: 501});
        });
}

function sendEmail(body) {
    console.log('sendEmail');
    return new Promise((resolve, reject) => {
        new email.send({to, subject, body})
            .send(function(err) {
                if (err) {
                    console.log('sendEmail', err);
                    reject(err);
                } else {
                    resolve();
                }
            });
    });
}

function start(config) {
    console.log('port', config.port);
    http.createServer((request, response) => {
        let params, postData, responder = respond.bind(this, response);
        if (
            'GET' === request.method &&
            config.referer !== request.headers.referer
        ) {
            console.log('wrong referer', request.headers.referer);
            responder({httpCode: 400});
            return;
        }
        console.log('incoming', request.method);

        if (!config[request.method]) {
            console.log('unhandled request method', request.method);
            return;
        }
        switch (request.method) {
            case 'GET':
            case 'PUT':
                respond(response, {content: config[request.method](request)});
                break;
            case 'POST':
                let postEvent = {response, service: request.url.slice(1)};
                fs.appendFile('onPostData.txt', '', function() {});
                request.on('data', onPostData.bind(this, postEvent));
                request.on(
                    'end',
                    () => {
                        respond(response, {content: config.POST(postEvent)});
                    }
                );
                break;
            case 'OPTIONS':
                respond(response, {});
                break;
            default:
                respond(response, {httpCode: 400});
        }
}).listen(config.port);
}

module.exports = {
    start
};

