// const express = require('express');
// const fetch = require('node-fetch');
import fetch from 'node-fetch';
import express from 'express'

const app = express();

const port = 8080;
const userMap = new Map();

userMap.set('ArpithaRed', { url: 'https://arpitha.saishetty.repl.co/', timeStamp: Date.now() })
userMap.set('SnehaRed', { url: 'https://teleNde-Sneha.saishetty.repl.co/', timeStamp: Date.now() })
userMap.set('Shruthiee', { url: 'https://teleNde3.saishetty.repl.co/', timeStamp: Date.now() })
userMap.set('RamyaRed3', { url: 'https://teleNde-Ramya.saishetty.repl.co/', timeStamp: Date.now() })
userMap.set('LasyaRed', { url: 'https://lasya.saishetty.repl.co/', timeStamp: Date.now() })


async function fetchWithTimeout(resource, options = {}) {
    const timeout = options?.timeout | 15000;

    // console.log(timeout);
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        return undefined
    }
}
const sites = [
    'https://teleNde3.saishetty.repl.co/',
    'https://arpitha.saishetty.repl.co/',
    'https://teleNde-Sneha.saishetty.repl.co/',
    'https://teleNde-Ramya.saishetty.repl.co/',
    'https://lasya.saishetty.repl.co/'
]

app.get('/', async (req, res, next) => {
    console.log("REQ")
    checkerclass.getinstance()
    res.send('Hello World!');
    next();
}, async (req, res) => {

    //
});

app.get('/receive', async (req, res) => {
    const userName = req.query.userName;
    const { url } = userMap.get(userName);
    userMap.set(userName, { url: url, timeStamp: Date.now() });
    console.log(userName, 'Ping!! Received!!')
    res.send('Hello World!');
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
const ppplbot = "https://api.telegram.org/bot5807856562:AAHaYJo1TnEPHWw8BUdQJzc-YUOOJKyc8EM/sendMessage?chat_id=-1001877978683"
const pingerbot = "https://api.telegram.org/bot5807856562:AAHaYJo1TnEPHWw8BUdQJzc-YUOOJKyc8EM/sendMessage?chat_id=-1001703065531"

class checkerclass {
    static instance = undefined;

    constructor() {
        this.main();
    };

    static getinstance() {
        if (!checkerclass.instance) {
            console.log('creating instance-------')
            checkerclass.instance = new checkerclass();
        }
        return checkerclass.instance;
    }
    main() {
        setInterval(async () => {
            userMap.forEach(async (val, key) => {
                try {
                    const resp = await fetchWithTimeout(`${val.url}`);
                    if (!resp) {
                        console.log(val.url, `is unreachable!!`);
                    }
                } catch (e) {
                    console.log(e)
                }
            })
        }, 30000);
        setInterval(async () => {
            await fetch(`${pingerbot}&text=ping`);
            userMap.forEach(async (val, key) => {
                if (val.timeStamp + 230000 < Date.now()) {
                    try {
                        await fetchWithTimeout(`${ppplbot}&text=${key} is DOWN!!`);
                        await fetchWithTimeout(`${val.url}`);
                        await fetchWithTimeout(`${val.url}star`);
                    } catch (e) {
                        console.log(e)
                    }
                }
            })
        }, 50000);
        setInterval(async () => {
            userMap.forEach(async (val, key) => {
                if (val.timeStamp + 230000 < Date.now()) {
                    console.log(key, val.timeStamp + 230000, Date.now())
                    try {
                        await fetchWithTimeout(`${val.url}`)
                        await fetchWithTimeout(`${ppplbot}&text=${key} is DOWN!!`);
                        await fetchWithTimeout(`${val.url}star`);
                    } catch (e) {
                        console.log(e)
                    }
                }
            })
        }, 120000);
    }
}


