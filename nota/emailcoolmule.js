#!/usr/bin/node

const
    { exec } = require('child_process'),
    to = 'stefan.sassenberg@gmx.de',
    from = 'coolmule.de <stefan.sassenberg@gmx.de>';

function sanitize(text) {
    return text && text.replace(/[^A-Za-z0-9 ,.-;:_!Â§$%&/()=]/, '_');
}

function send(config) {
    exec(
        'send_email' +
            ' "' + (sanitize(config.subject) || 'Kein Betreff') + '"' +
            ' "' + (sanitize(config.body) || 'Kein Text') + '"' +
            ' "' + (sanitize(config.to) || to) + '"',
        (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        }
    );
}

module.exports = {
    send
};

