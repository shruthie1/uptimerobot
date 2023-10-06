const Imap = require('imap');
console.log("Started Mail Reader")
let isReady = false;

function isMailReady() {
    return isReady;
}

const imap = new Imap({
    user: process.env.GMAIL_ADD,
    password: process.env.GMAIL_PASS,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: {
        rejectUnauthorized: false
    }

});

async function openInbox(cb) {
    imap.openBox('INBOX', false, cb);
}

imap.once('ready', function () {
    console.log("ready")
    isReady = true;
    return true
});

imap.once('error', (err) => {
    console.error("SomeError :", err);
});

imap.once('end', () => {
    console.log('Connection ended');
});
let result = ''
async function getcode() {
    await openInbox(() => {
        const searchCriteria = [['FROM', 'noreply@telegram.org']];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: true,
        };
        imap.search(searchCriteria, (err, results) => {
            if (err) throw err;
            console.log(results)
            if (results.length > 0) {
                const fetch = imap.fetch([results[results.length - 1]], fetchOptions);
                fetch.on('message', (msg, seqno) => {
                    const emailData = [];

                    msg.on('body', (stream, info) => {
                        let buffer = '';

                        stream.on('data', (chunk) => {
                            buffer += chunk.toString('utf8');
                        });

                        stream.on('end', () => {
                            if (info.which === 'TEXT') {
                                emailData.push(buffer);
                            }
                        });
                    });

                    msg.once('end', () => {
                        console.log(`Email #${seqno}, Latest${results[results.length - 1]}`);
                        console.log("EmailDataLength: ", emailData.length);
                        console.log("Mail:", emailData[emailData.length - 1].split('.'));
                        result = fetchNumbersFromString(emailData[emailData.length - 1].split('.')[0])
                    });
                });
                fetch.once('end', () => {
                    console.log("fetched mails")
                });
            }
        });
    });
    console.log("Returning from mail Reader:", result);
    if (result.length > 4) {
        imap.end();
    }
    return result
}

function fetchNumbersFromString(inputString) {
    const regex = /\d+/g;
    const matches = inputString.match(regex);
    if (matches) {
        const result = matches.join('');
        return result;
    } else {
        return '';
    }
}
function connectToMail() {
    result = '';
    imap.connect();
}
function disconnectfromMail() {
    result = '';
    imap.end();
}
module.exports = { getcode, isMailReady, connectToMail, disconnectfromMail }
