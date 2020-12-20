#!/usr/bin/node

const
    email = require('./emailcoolmule'),
    httpcoolmule = require('./httpcoolmule'),

    port = process.env.NOTA_PORT || 6682, // N O T A
    to = 'stefan.sassenberg@gmx.de',
    subject = 'Benachrichtigung';

function sendEmail(body) {
    email.send({subject: body, body});
}

httpcoolmule.start({
    port,
    POST: (postEvent) => { sendEmail(postEvent.postData); }
});

