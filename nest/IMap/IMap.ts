import Imap from 'imap';

export class MailReader {
    private static instance: MailReader;
    private imap: Imap;
    private isReady: boolean = false;
    private result: string = '';

    private constructor() {
        this.imap = new Imap({
            user: process.env.GMAIL_ADD,
            password: process.env.GMAIL_PASS,
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            tlsOptions: {
                rejectUnauthorized: false,
            },
        });

        this.imap.once('ready', () => {
            console.log('Ready');
            this.isReady = true;
        });

        this.imap.once('error', (err) => {
            console.error('SomeError:', err);
        });

        this.imap.once('end', () => {
            console.log('Connection ended');
        });
    }

    public static getInstance(): MailReader {
        if (!MailReader.instance) {
            MailReader.instance = new MailReader();
        }

        return MailReader.instance;
    }

    public async connectToMail(): Promise<void> {
        this.result = '';
        await new Promise<void>((resolve, reject) => {
            this.imap.connect((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                console.log('Connected to mail server');
                resolve();
            });
        });
    }

    public async disconnectFromMail(): Promise<void> {
        this.result = '';
        await new Promise<void>((resolve, reject) => {
            this.imap.end((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                console.log('Disconnected from mail server');
                resolve();
            });
        });
    }

    public async isMailReady(): Promise<boolean> {
        return this.isReady;
    }

    public async getCode(): Promise<string> {
        if (!this.isReady) {
            throw new Error('Mail reader is not ready. Call connectToMail() first.');
        }

        await this.openInbox();

        const searchCriteria = [['FROM', 'noreply@telegram.org']];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: true,
        };

        try {
            const results: any = await new Promise((resolve, reject) => {
                this.imap.search(searchCriteria, (err, results) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(results);
                });
            });

            if (results.length > 0) {
                const fetch = this.imap.fetch([results[results.length - 1]], fetchOptions);
                await new Promise<void>((resolve, reject) => {
                    fetch.on('message', (msg, seqno) => {
                        const emailData: string[] = [];

                        msg.on('body', (stream, info) => {
                            let buffer = '';
                            stream.on('data', (chunk) => {
                                buffer += chunk.toString('utf8');
                            });

                            stream.on('end', () => {
                                if (info.which === 'TEXT') {
                                    emailData.push(buffer);
                                }
                                this.imap.seq.addFlags([seqno], '\\Deleted', (err) => {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    this.imap.expunge((err) => {
                                        if (err) {
                                            reject(err);
                                            return;
                                        }
                                        console.log(`Deleted message`);
                                    });
                                });
                            });
                        });

                        msg.once('end', () => {
                            console.log(`Email #${seqno}, Latest ${results[length - 1]}`);
                            console.log('EmailDataLength:', emailData.length);
                            console.log('Mail:', emailData[emailData.length - 1].split('.'));
                            this.result = this.fetchNumbersFromString(
                                emailData[emailData.length - 1].split('.')[0]
                            );
                            resolve();
                        });
                    });

                    fetch.once('end', () => {
                        console.log('Fetched mails');
                        resolve();
                    });
                });
            } else {
                console.log('No new emails found');
            }
        } catch (err) {
            console.error('Error:', err);
            throw err; // Re-throw the error for caller to handle
        } finally {
            if (this.result.length > 4) {
                await this.disconnectFromMail();
            }
        }

        return this.result;
    }

    private async openInbox(): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            this.imap.openBox('INBOX', false, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                console.log('Inbox opened');
                resolve();
            });
        });
    }

    private fetchNumbersFromString(inputString: string): string {
        const regex = /\d+/g;
        const matches = inputString.match(regex);
        if (matches) {
            return matches.join('');
        } else {
            return '';
        }
    }
}