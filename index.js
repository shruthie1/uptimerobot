'use strict';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import axios from 'axios';
import schedule from 'node-schedule-tz';
import { timeZone, timeZoneName } from 'node-schedule-tz'; // Assuming timeZone and timeZoneName are exported from node-schedule-tz
import { ChannelService } from './dbservice';
import {
  getClient,
  hasClient,
  disconnectAll,
  createClient,
  deleteClient,
  setActiveClientSetup,
  getActiveClientSetup
} from './telegramManager';
import bodyParser from 'body-parser';
import { sleep, fetchWithTimeout } from './utils';
import { execSync } from 'child_process';
import { CloudinaryService } from './cloudinary';
import fs from 'fs';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './nest/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { parseError } from "./utils";
import mongoose from 'mongoose';
import { TelegramService } from './nest/components/Telegram/Telegram.service';
import { UsersService } from './nest/components/users/users.service';
import { User, UserSchema } from './nest/components/users/schemas/user.schema';

const timeOptions = { timeZone: 'Asia/Kolkata', timeZoneName: 'short' };
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (reason, promise) => {
  console.error(promise, reason);
});

process.on('exit', async () => {
  await ChannelService.getInstance().closeConnection();
  await disconnectAll();
});

var cors = require('cors');
const app = express();
const port = process.env.PORT || 8000;
const userMap = new Map();

let ip;
let clients;
let upiIds;
const pings = {}

fetchWithTimeout('https://ipinfo.io/json')
  .then(result => {
    return result?.data;
  })
  .then((output) => {
    ip = output;
    console.log(ip)
  })
  .then(async () => {
    const db = ChannelService.getInstance()
    await db.connect();
    await db.setEnv();
    setTimeout(async () => {
      checkerclass.getinstance()
      await setUserMap();
    }, 100);
  })
  .catch(err => console.error(err))

let count = 0;
let botCount = 0
const ppplbot = (chatId, botToken) => {
  let token = botToken;
  if (!token) {
    if (botCount % 2 == 1) {
      token = `bot6624618034:AAHoM3GYaw3_uRadOWYzT7c2OEp6a7A61mY`
    } else {
      token = `bot6607225097:AAG6DJg9Ll5XVxy24Nr449LTZgRb5bgshUA`
    }
    botCount++;
  }
  return `https://api.telegram.org/${token}/sendMessage?chat_id=${chatId ? chatId : "-1001801844217"}`
}
const pingerbot = `https://api.telegram.org/bot5807856562:${process.env.apikey}/sendMessage?chat_id=-1001703065531`;

const apiResp = {
  INSTANCE_NOT_EXIST: "INSTANCE_NOT_EXIST",
  CLIENT_NOT_EXIST: "CLIENT_NOT_EXIST",
  CONNECTION_NOT_EXIST: "CONNECTION_NOT_EXIST",
  ALL_GOOD: "ALL_GOOD",
  DANGER: "DANGER",
  WAIT: "WAIT"
};

async function setUserMap() {
  userMap.clear();
  const db = ChannelService.getInstance();
  await fetchWithTimeout(`${ppplbot()}&text=UptimeRobot : Refreshed Map`);
  const users = await db.getAllUserClients();
  clients = users
  upiIds = await db.getAllUpis()
  users.forEach(user => {
    userMap.set(user.username.toLowerCase(), { url: `${user.repl}/`, timeStamp: Date.now(), deployKey: user.deployKey, downTime: 0, lastPingTime: Date.now(), clientId: user.clientId })
    pings[user.username.toLowerCase()] = Date.now();
  })
}

function getClientData(cid) {
  const clients = Array.from(userMap.values())
  return clients.find((value) => {
    return value.clientId == cid
  })
}

function getCurrentHourIST() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset);
  const istHour = istTime.getUTCHours();
  return istHour;
}
const connetionQueue = [];
// try {
//   schedule.scheduleJob('test', ' 0 * * * * ', 'Asia/Kolkata', async () => {
//     console.log("Promoting.....");
//     const hour = getCurrentHourIST();
//     const db = ChannelService.getInstance();
//     // await db.clearChannelStats();

//     const userValues = Array.from(userMap.values());
//     for (let i = 0; i < userValues.length; i++) {
//       const value = userValues[i];
//       await fetchWithTimeout(`${value.url}assureppl`);
//       await sleep(3000);
//       await fetchWithTimeout(`${value.url}promote`);
//       await sleep(2000);
//       if (hour && hour % 3 === 0) {
//         await fetchWithTimeout(`${value.url}calltopaid`);
//       }
//     }

//     await db.clearStats();
//     // await db.calculateAvgStats();
//     // await fetchWithTimeout(`${process.env.uptimeChecker}/processusers/400/0`);
//   })

//   // schedule.scheduleJob('test1', ' 2 3,6,10,16,20,22 * * * ', 'Asia/Kolkata', async () => {
//   //     const userValues = Array.from(userMap.values());
//   // for (let i = 0; i < userValues.length; i++) {
//   //   const value = userValues[i];
//   //   })
//   // })

//   schedule.scheduleJob('test2', '*/10 * * * *', 'Asia/Kolkata', async () => {
//     const userValues = Array.from(userMap.values());
//     for (let i = 0; i < userValues.length; i++) {
//       const value = userValues[i];
//       await fetchWithTimeout(`${value.url}markasread`);
//       await sleep(3000);
//     }
//   })

//   schedule.scheduleJob('test3', ' 15 7,13,16,21,23 * * * ', 'Asia/Kolkata', async () => {
//     const userValues = Array.from(userMap.values());
//     for (let i = 0; i < userValues.length; i++) {
//       const value = userValues[i];
//       await fetchWithTimeout(`${value.url}asktopay`);
//       await sleep(3000);
//     }

//   })

//   schedule.scheduleJob('test3', ' 25 0 * * * ', 'Asia/Kolkata', async () => {
//     const db = ChannelService.getInstance();
//     for (const value of userMap.values()) {
//       await sleep(1000);
//       await fetchWithTimeout(`${value.url}resetunpaid`);
//       // await fetchWithTimeout(`${value.url}resetunppl`);
//       await fetchWithTimeout(`${value.url}getuserstats2`);

//       setTimeout(async () => {
//         await fetchWithTimeout(`${value.url}asktopay`);
//       }, 300000);
//       await sleep(1000)
//     }
//     const now = new Date();
//     if (now.getUTCDate() % 5 === 1) {
//       setTimeout(async () => {
//         await db.resetAvailableMsgs();
//         await db.updateBannedChannels();
//         await db.updateDefaultReactions();
//       }, 30000);
//     }

//     await fetchWithTimeout(`${ppplbot()}&text=${encodeURIComponent(await getPromotionStatsPlain())}`);
//     await db.resetPaidUsers();
//     await db.updateActiveChannels();
//     await db.clearStats2();
//     await db.clearAllStats();
//     await db.reinitPromoteStats();

//     try {
//       const resp = await fetchWithTimeout(`https://mychatgpt-pg6w.onrender.com/getstats`, { timeout: 55000 });
//       const resp2 = await fetchWithTimeout(`https://mychatgpt-pg6w.onrender.com/clearstats`, { timeout: 55000 });
//     } catch (error) {
//       console.log("Some Error: ", parseError(error), error.code)
//     }

//   })
// } catch (error) {
//   console.log("Some Error: ", parseError(error), error.code);
// }

async function assure() {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await fetchWithTimeout(`${value.url}resptopaid?msg=Hey...Dont worry!! I will Call you pakka ok!!`);
    setTimeout(async () => {
      await fetchWithTimeout(`${value.url}markasread?all=true`);
    }, 20000)
    await sleep(3000)
  }
}

app.use(cors());
app.use(bodyParser.json());
app.get('/', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {

  //
});

app.get('/exitacc', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  //
});

app.get('/processUsers/:limit/:skip', async (req, res, next) => {
  res.send("ok")
  next();
}, async (req, res) => {
  const limit = req.params.limit ? req.params.limit : 30
  const skip = req.params.skip ? req.params.skip : 20
  const db = await ChannelService.getInstance();
  const cursor = await db.processUsers(parseInt(limit), parseInt(skip));
  while (await cursor.hasNext()) {
    const document = await cursor.next();
    console.log("In processUsers")
    const cli = await createClient(document.mobile, document.session);
    const client = await getClient(document.mobile);
    if (cli) {
      console.log(document.mobile, " :  true");
      const lastActive = await client.getLastActiveTime();
      const date = new Date(lastActive * 1000).toISOString().split('T')[0];
      const me = await client.getMe()
      const selfMSgInfo = await client.getSelfMSgsInfo();
      let gender = cli.gender;
      if (!gender) {
        const data = await fetchWithTimeout(`https://api.genderize.io/?name=${me.firstName}%20${me.lastName}`);
        gender = data?.data?.gender;
      }
      await db.updateUser(document, { ...selfMSgInfo, gender, firstName: me.firstName, lastName: me.lastName, username: me.username, msgs: cli.msgs, totalChats: cli.total, lastActive, date, tgId: me.id.toString(), lastUpdated: new Date().toISOString().split('T')[0] });
      await client?.disconnect(document.mobile);
      await deleteClient()
    } else {
      console.log(document.mobile, " :  false");
      await db.deleteUser(document);
    }
  }
  console.log("finished")
});

app.get('/refreshMap', async (req, res) => {
  checkerclass.getinstance();
  await setUserMap();
  res.send('Hello World!');
});

app.get('/clearstats2', async (req, res) => {
  checkerclass.getinstance();
  const db = ChannelService.getInstance();
  await db.clearStats2();
  res.send('Hello World!');
});

app.get('/updateBannedChannels', async (req, res) => {
  checkerclass.getinstance();
  const db = ChannelService.getInstance();
  await db.updateBannedChannels();
  res.send('Hello World!');
});
app.get('/resetAvailableMsgs', async (req, res) => {
  checkerclass.getinstance();
  const db = ChannelService.getInstance();
  await db.resetAvailableMsgs();
  res.send('Hello World!');
});

app.get('/exit', async (req, res) => {
  await ChannelService.getInstance().closeConnection();
  process.exit(1)
  res.send('Hello World!');
});

app.post('/channels', async (req, res, next) => {
  res.send('Hello World!');
  // console.log(req.body);
  next();
}, async (req, res) => {
  const channels = req.body?.channels;
  const db = ChannelService.getInstance();
  channels?.forEach(async (channel) => {
    await db.insertChannel(channel);
  })
});

app.post('/contacts', async (req, res, next) => {
  res.send('Hello World!');
  // console.log(req.body);
  next();
}, async (req, res) => {
  const contacts = req.body?.contacts;
  const db = ChannelService.getInstance();
  contacts?.forEach(async (contact) => {
    await db.insertContact(contact);
  })
  console.log('contacts saved', contacts.length);
});

app.get('/getip', (req, res) => {
  res.json(ip);
});

app.post('/users', async (req, res, next) => {
  res.send('Hello World!');
  console.log(req.body);
  next();
}, async (req, res) => {
  const user = req.body;
  const db = ChannelService.getInstance();
  await db.insertUser(user);
  await fetchWithTimeout(`${ppplbot()}&text=ACCOUNT LOGIN: ${user.username ? user.username : user.firstName}:${user.msgs}:${user.totalChats}\n ${process.env.uptimeChecker}/connectclient/${user.mobile}`)
});

app.get('/channels/:limit/:skip', async (req, res, next) => {
  const limit = req.params.limit ? req.params.limit : 30
  const skip = req.params.skip ? req.params.skip : 20
  const k = req.query?.k
  const db = ChannelService.getInstance();
  const channels = await db.getChannels(parseInt(limit), parseInt(skip), k);
  let resp = 'joinchannel:'
  for (const channel of channels) {
    resp = resp + (channel?.username?.startsWith("@") ? channel.username : `@${channel.username}`) + "|";
  }
  res.send(resp);
});

app.get('/activechannels/:limit/:skip', async (req, res, next) => {
  const limit = req.params.limit ? req.params.limit : 30
  const skip = req.params.skip ? req.params.skip : 20
  const k = req.query?.k
  const db = ChannelService.getInstance();
  const result = await db.getActiveChannels(parseInt(limit), parseInt(skip), [k], [], 'channels');
  let resp = 'joinchannel:'
  for (const channel of result) {

    resp = resp + (channel?.username?.startsWith("@") ? channel.username : `@${channel.username}`) + "|";
  }
  res.send(resp);
});

let refresTime = Date.now();
app.get('/getdata', async (req, res, next) => {
  checkerclass.getinstance()
  if (Date.now() > refresTime) {
    refresTime = Date.now() + (5 * 60 * 1000);
  }
  res.setHeader('Content-Type', 'text/html');
  let resp = '<html><head></head><body>';
  resp = resp + await getData();
  resp += '</body></html>';
  resp += `<script>
              console.log("hii");
              setInterval(() => {
                window.location.reload();
              }, 20000);
          </script>`;
  res.send(resp);
});

app.get('/getdata2', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await fetchWithTimeout(`${value.url}getDemostat2`);
    await sleep(1000);
  }
});

app.get('/getAllIps', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    try {
      console.log(value.clientId)
      const res = await fetchWithTimeout(`${value.url}getip`);
      console.log(res.data);
    } catch (error) {

    }
  }
});

app.get('/refreshupis', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await fetchWithTimeout(`${value.url}refreshupis`);
  }
});


app.get('/getviddata', async (req, res, next) => {
  checkerclass.getinstance()
  const chatId = req.query.chatId;
  let profile = req.query.profile;
  if (!profile && req.query.clientId) {
    profile = req.query.clientId?.replace(/\d/g, '')
  }
  const db = ChannelService.getInstance();
  const data = await db.getuserdata({ chatId, profile });
  res.json(data);
});

app.post('/getviddata', async (req, res, next) => {
  checkerclass.getinstance()
  let profile = req.query.profile;
  if (!profile && req.query.clientId) {
    profile = req.query.clientId?.replace(/\d/g, '')
  }
  const body = req.body;
  const chatId = body.chatId;
  const db = ChannelService.getInstance();
  const data = await db.updateUserData({ chatId, profile }, body);
  res.json(data);
});

app.get('/blockUser/:profile/:chatId', async (req, res, next) => {
  checkerclass.getinstance()
  let profile = req.params.profile;
  const chatId = req.params.chatId;
  const db = ChannelService.getInstance();
  const data = await db.updateUserData({ chatId, profile }, { canReply: 0, payAmount: 0 });
  res.json(data);
});

app.get('/sendvclink', async (req, res, next) => {
  checkerclass.getinstance()
  const chatId = req.query.chatId;
  const video = req.query.video;
  const profile = req.query.clientId;
  const client = getClientData(profile);
  const url = `${client?.url}sendvclink/${chatId}?${video ? `video=${video}` : ""}`;
  console.log(url);
  await fetchWithTimeout(url);
  res.send("done");
});

app.get('/sendvclink/:clientId/:chatId', async (req, res, next) => {
  checkerclass.getinstance()
  const clientId = req.params.clientId;
  const chatId = req.params.chatId;
  const video = req.query.video;
  const client = getClientData(clientId);
  const url = `${client?.url}sendvclink/${chatId}?${video ? `video=${video}` : ""}`;
  console.log(url);
  await fetchWithTimeout(url);
  res.send("done");
});

app.get('/blockUserall/:chatId', async (req, res, next) => {
  checkerclass.getinstance()
  const chatId = req.params.chatId;
  const db = ChannelService.getInstance();
  const data = await db.updateUserData({ chatId }, { canReply: 0, payAmount: 0 });
  res.json(data);
});

app.get('/getuserdata', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await fetchWithTimeout(`${value.url}getuserstats`);
    await sleep(1000);
  }
});

app.get('/getuserdata2', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await fetchWithTimeout(`${value.url}getuserstats2`);
    await sleep(1000);
  }
});

app.get('/restartall', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await fetchWithTimeout(`${value.deployKey}`);
    await sleep(1000)
  }
});
app.get('/sendtoall', async (req, res, next) => {
  checkerclass.getinstance();
  console.log('Received sendtoall request');
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const queries = req.query
  let newQuery = '';
  Object.keys(req.query).map((key) => {
    newQuery += `/${queries[key]}`
  });
  console.log(newQuery);
  for (const value of userMap.values()) {
    const url = `${value.url.slice(0, -1)}${newQuery}`;
    console.log(url);
    await sleep(1000);
    await fetchWithTimeout(url);
  }
});

app.get('/usermap', async (req, res) => {
  checkerclass.getinstance()
  console.log('Received Usermap request');
  res.json({ values: Array.from(userMap.values()), keys: userMap.keys() });
});

app.get('/getbufferclients', async (req, res) => {
  const db = ChannelService.getInstance();
  const result = []
  const clients = await db.readBufferClients({});
  clients.forEach((cli) => {
    result.push(cli.mobile);
  })
  res.json(result);
});

app.get('/clients', async (req, res) => {
  checkerclass.getinstance();
  console.log('Received Client request');
  res.json(clients)
});

app.get('/keepready2', async (req, res, next) => {
  checkerclass.getinstance()
  console.log('Received keepready2 request');
  res.send(`Responding!!\nMsg = ${req.query.msg}`);
  next();
}, async (req, res) => {
  const msg = req.query.msg;
  console.log("Msg2 = ", msg);
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await fetchWithTimeout(`${value.url}resptopaid2?msg=${msg ? msg : "Oye..."}`);
    await fetchWithTimeout(`${value.url}getDemostats`);
    await sleep(1000)
  }
  const db = ChannelService.getInstance();
  await db.clearStats()
});

app.get('/keepready', async (req, res, next) => {
  checkerclass.getinstance();
  console.log('Received Keepready request');
  const dnsMsg = encodeURIComponent(`Dont Speak Okay!!\n**I am in Bathroom**\n\nMute yourself!!\n\nI will show you Okay..!!`)
  const msg = req.query.msg.toLowerCase() == 'dns' ? dnsMsg : req.query.msg;
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await fetchWithTimeout(`${value.url}resptopaid?msg=${msg ? msg : "Oye..."}`);
    await sleep(1000)
  }
  const db = ChannelService.getInstance();
  await db.clearStats();
  res.send(`Responding!!\=url:resptopaid?msg=${msg ? msg : "Oye..."}`);
});

app.get('/asktopay', async (req, res, next) => {
  checkerclass.getinstance();
  console.log('Received AsktoPay request');
  res.send(`Asking Pppl`);
  next();
}, async (req, res) => {
  const msg = req.query.msg;
  console.log("Msg = ", msg);
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await fetchWithTimeout(`${value.url}asktopay`)
    await sleep(1000)
  }
});

let callingTime = Date.now();
app.get('/calltopaid', async (req, res, next) => {
  checkerclass.getinstance()
  console.log('Received Call request');
  res.send(`Asking Pppl`);
  next();
}, async (req, res) => {
  const msg = req.query.msg;
  console.log("Msg = ", msg);
  if (Date.now() > callingTime) {
    callingTime = Date.now() + (10 * 60 * 1000)
    const userValues = Array.from(userMap.values());
    for (let i = 0; i < userValues.length; i++) {
      const value = userValues[i];
      await fetchWithTimeout(`${value.url}calltopaid`)
      await sleep(1000)
    }
  }
});


app.get('/markasread', async (req, res, next) => {
  checkerclass.getinstance();
  console.log('Received MarkasRead Req');
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const all = req.query.all;
  if (Date.now() > refresTime) {
    refresTime = Date.now() + (5 * 60 * 1000);
    console.log("proceeding with all = ", all);
    const userValues = Array.from(userMap.values());
    for (let i = 0; i < userValues.length; i++) {
      const value = userValues[i];
      await fetchWithTimeout(`${value.url}markasread?${all ? "all=true" : ''}`);
      await sleep(3000)
    }
  }
});

app.get('/setactiveqr', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const upi = req.query.upi;
  console.log("upi = ", upi);
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await fetchWithTimeout(`${value.url}setactiveqr?upi=${upi}`);
    await sleep(1000)
  }
});

app.get('/joinchannel', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  try {
    const username = req.query.username;
    if (username) {
      const data = userMap.get(username.toLowerCase());
      if (data) {
        joinchannels(data)
      } else {
        console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), `User ${username} Not exist`);
      }
    } else {
      const userValues = Array.from(userMap.values());
      for (let i = 0; i < userValues.length; i++) {
        const value = userValues[i];
        try {
          joinchannels(value);
          await sleep(3000);
        } catch (error) {
          console.log("Some Error: ", parseError(error), error.code);
        }
        await sleep(1000)
      }
    }
  } catch (error) {
    console.log("Some Error: ", parseError(error), error);
  }
});


app.get('/getUpiId', async (req, res) => {
  checkerclass.getinstance();
  const app = req.query.app ? req.query.app : "paytm3"
  const db = ChannelService.getInstance();
  const upiId = await db.getupi(app);
  res.send(upiId);
});

app.get('/getAllUpiIds', async (req, res) => {
  checkerclass.getinstance();
  res.json(upiIds);
});

app.post('/getAllUpiIds', async (req, res, next) => {
  const data = req.body
  checkerclass.getinstance();
  const db = ChannelService.getInstance();
  const upiIds = await db.updateUpis(data);
  res.json(upiIds);
  next();
}, async () => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await fetchWithTimeout(`${value.url}refreshupis`);
  }
})

app.get('/getUserConfig', async (req, res) => {
  const filter = req.query
  checkerclass.getinstance();
  const db = ChannelService.getInstance();
  const userConfig = await db.getUserConfig(filter);
  res.json(userConfig);
});

app.get('/getUserInfo', async (req, res) => {
  const filter = req.query
  checkerclass.getinstance();
  const db = ChannelService.getInstance();
  const userConfig = await db.getUserInfo(filter);
  res.json(userConfig);
});

app.post('/updateUserData/:chatId ', async (req, res) => {
  const data = req.body
  const chatId = req.params.chatId
  const profile = req.query.profile;
  checkerclass.getinstance();
  const filter = { chatId }
  if (profile) {
    filter['profile'] = profile
  }
  const db = ChannelService.getInstance();
  const userConfig = await db.updateUserData(filter, data);
  res.json(userConfig);
});

app.post('/getUserConfig', async (req, res) => {
  const filter = req.query
  const data = req.body
  checkerclass.getinstance();
  const db = ChannelService.getInstance();
  const upiIds = await db.updateUserConfig(filter, data);
  await setUserMap();
  res.json(upiIds);
});

app.get('/builds', async (req, res) => {
  checkerclass.getinstance();
  const db = ChannelService.getInstance();
  const data = await db.getBuilds();
  console.log(data);
  res.json(data);
});

app.post('/builds', async (req, res) => {
  const data = req.body
  checkerclass.getinstance();
  const db = ChannelService.getInstance();
  console.log(data);
  const result = await db.updateBuilds(data);
  res.json(result);
});

app.get('/getAllUserClients', async (req, res) => {
  checkerclass.getinstance();
  const db = ChannelService.getInstance();
  const userConfig = await db.getAllUserClients();
  const resp = []
  userConfig.map((user) => {
    resp.push(user.clientId)
  })
  res.send(resp);
});

app.get('/getTgConfig', async (req, res) => {
  checkerclass.getinstance();
  const db = ChannelService.getInstance();
  const tgConfig = await db.getTgConfig()
  res.json(tgConfig);
});

app.get('/updateActiveChannels', async (req, res) => {
  checkerclass.getinstance();
  const db = ChannelService.getInstance();
  const tgConfig = await db.updateActiveChannels();
  res.send("ok");
});

app.get('/getCurrentActiveUniqueChannels', async (req, res) => {
  checkerclass.getinstance();
  const db = ChannelService.getInstance();
  const result = await db.getCurrentActiveUniqueChannels();
  res.json({ length: result.length, data: result });
});

app.post('/getTgConfig', async (req, res, next) => {
  const data = req.body
  checkerclass.getinstance();
  const db = ChannelService.getInstance();
  const upiIds = await db.updateUpis(data)
  res.json(upiIds);
  next();
}, async () => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await fetchWithTimeout(`${value.url}refreshupis`);
  }
});

app.get('/lastpings', async (req, res, next) => {
  checkerclass.getinstance();
  let resp = '<html><head><style>pre { font-size: 18px; }</style></head><body><pre>';
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    resp = resp + `${value.clientId}  :  ${Number(((Date.now() - value.lastPingTime) / 60000).toFixed(2))}\n`
  }
  resp += '</pre></body></html>';
  res.setHeader('Content-Type', 'text/html');
  res.send(resp);
});

app.get('/lastpingsjson', async (req, res, next) => {
  checkerclass.getinstance();
  let resp = '<html><head><style>pre { font-size: 18px; }</style></head><body><pre>';
  for (const userdata in pings) {
    resp = resp + `${userdata}  :  ${Number(((Date.now() - pings[userdata]) / 60000).toFixed(2))}\n`
  }
  resp += '</pre></body></html>';
  res.setHeader('Content-Type', 'text/html');
  res.send(resp);
});

app.get('/exitglitches', async (req, res, next) => {
  res.send("ok")
  next();
}, async () => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    if (value.url.toLowerCase().includes('glitch'))
      await fetchWithTimeout(`${value.url}exit`);
  }
});

app.get('/exitprimary', async (req, res, next) => {
  res.send("ok")
  next();
}, async () => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    if (value.clientId.toLowerCase().includes('1')) {
      await fetchWithTimeout(`${value.url}exit`);
      await sleep(40000);
    }
  }
});

app.get('/exitsecondary', async (req, res, next) => {
  res.send("ok")
  next();
}, async () => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    if (value.clientId.toLowerCase().includes('2')) {
      await fetchWithTimeout(`${value.url}exit`);
      await sleep(40000)
    }
  }
});

app.get('/connectclient2/:number', async (req, res) => {
  const number = req.params?.number;
  const db = ChannelService.getInstance();
  const user = await db.getUser({ mobile: number });
  if (user) {
    const buttonHtml = `<button id='btn' style="width: 50vw; height: 30vw; border-radius:20px;font-size:4vh"  onclick="triggerHtmlRequest('${user.mobile}', '${user.session}')">Create Client</button>
    <script>
      function triggerHtmlRequest(mobile, session) {
        console.log(${number})
        const button = document.getElementById('btn')
        const request = new XMLHttpRequest();
        request.open('GET', '${process.env.uptimeChecker}/cc/' + ${number}, true);
        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
            button.innerHTML = request.responseText;
          } else {
            console.error('Failed to fetch URL');
          }
        };
        request.send();
        }
    </script>`
    res.send(`<html><body style="justify-content: center; display: flex;align-items:center;font-size:5vh"><b style="display:block"><h6>User Exists</h6>${buttonHtml}</b></body></html>`);
  } else {
    res.send("<html><body style='justify-content: center; display: flex;align-items:center;font-size:5vh'>User Does not exist</body></html>");
  }
});

// Second API to create the client when the button is clicked
app.get('/cc/:number', async (req, res) => {
  const number = req.params?.number;
  console.log("In createclient - ", req.ip);
  const cli = TelegramService.createClient(number)
  if (cli) {
    res.send("client created");
  } else {
    res.send("client EXPIRED");
  }
});


app.get('/connectclient/:number', async (req, res) => {
  const number = req.params?.number;
  const user = (await usersService.search({ mobile: number }))[0]
  console.log(user);
  if (user) {
    console.log("In connectclient - ", req.ip)
    const cli = await TelegramService.createClient(user.mobile, user.session);
    if (cli) {
      res.send("client created");
    } else {
      res.send("client EXPIRED");
    }
  } else {
    res.send("User Does not exist");
  }
});

app.get('/sendToChannel', async (req, res, next) => {
  res.send("sendToChannel");
  next();
}, async (req, res) => {
  try {
    const message = req.query?.msg;
    const chatId = req.query?.chatId;
    const token = req.query?.token;
    await fetchWithTimeout(`${ppplbot(chatId, token)}&text=${decodeURIComponent(message)}`, {}, 3)
  } catch (e) {
    console.log(parseError(e));
  }
})

app.get('/joinchannels/:number/:limit/:skip', async (req, res, next) => {
  res.send("joiningChannels");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const limit = req.params.limit ? req.params.limit : 30
    const skip = req.params.skip ? req.params.skip : 20
    const k = req.query?.k
    const db = ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    if (!hasClient(user.mobile)) {
      console.log("In joinchannels")
      const cli = await createClient(user.mobile, user.session, false);
      if (cli) {
        const client = await getClient(user.mobile);
        const channels = await client.channelInfo(true);
        const keys = ['wife', 'adult', 'lanj', 'lesb', 'paid', 'randi', 'bhab', 'boy', 'girl'];
        const result = await db.getActiveChannels(parseInt(limit), parseInt(skip), k ? [k] : keys, channels.ids, 'channels');
        console.log("DbChannelsLen: ", result.length);
        let resp = '';
        for (const channel of result) {

          resp = resp + (channel?.username?.startsWith("@") ? channel.username : `@${channel.username}`) + "|";
        }
        await client.removeOtherAuths();
        client.joinChannels(resp);
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", parseError(error), error)
  }
});

app.get('/set2fa/:number', async (req, res, next) => {
  res.send("Setting 2FA");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const db = ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    if (!hasClient(user.mobile)) {
      console.log("In set2fa")
      const cli = await createClient(user.mobile, user.session);
      const client = await getClient(user.mobile);
      if (cli) {
        await client.set2fa();
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", parseError(error), error.code)
  }
});

app.get('/setpp/:number/:name', async (req, res, next) => {
  res.send("Setting 2FA");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const name = req.params?.name;
    const db = ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    if (!hasClient(user.mobile)) {
      console.log("In setpp")
      const cli = await createClient(user.mobile, user.session);
      const client = await getClient(user.mobile);
      if (cli) {
        await CloudinaryService.getInstance(name);
        await sleep(2000);
        await client.updateProfilePic('./dp1.jpg');
        await sleep(1000);
        await client.updateProfilePic('./dp2.jpg');
        await sleep(1000);
        await client.updateProfilePic('./dp3.jpg');
        await sleep(1000);
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", parseError(error), error.code)
  }
});


app.get('/SetAsBufferClient/:number', async (req, res, next) => {
  res.send("Updating Name");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const db = ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    console.log(user);
    if (!hasClient(user.mobile)) {
      const cli = await createClient(user.mobile, user.session);
      const client = await getClient(user.mobile);
      if (cli) {
        await client.set2fa();
        await sleep(30000)
        await client.updateUsername();
        await sleep(5000)
        await client.updatePrivacyforDeletedAccount();
        await sleep(5000)
        await client.updateProfile("Deleted Account", "Deleted Account");
        await sleep(5000)
        await client.deleteProfilePhotos();
        await sleep(5000)
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", parseError(error), error)
  }
});

app.get('/updatePrivacy/:number', async (req, res, next) => {
  res.send("Updating Privacy");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const db = ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    console.log(user);
    if (!hasClient(user.mobile)) {
      const cli = await createClient(user.mobile, user.session);
      const client = await getClient(user.mobile);
      if (cli) {
        await client.updatePrivacy();
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", parseError(error), error)
  }
});

app.get('/forward*', async (req, res) => {
  let targetHost = process.env.tgcms;
  if (req.query.host) {
    targetHost = req.query.host;
  }
  try {
    console.log(req.url);
    const finalUrl = `${targetHost}${req.url.replace('/forward', '')}`
    console.log("final:", finalUrl)
    const response = await fetchWithTimeout(finalUrl)
    res.status(response?.status).send(response?.data);
  } catch (error) {
    console.log(parseError(error))
    res.status(500).send('Internal Server Error');
  }
});

app.get('/UpdateUsername/:number', async (req, res, next) => {
  res.send("Updating Privacy");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const username = req.query?.username;
    const db = ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    console.log(user);
    if (!hasClient(user.mobile)) {
      const cli = await createClient(user.mobile, user.session);
      const client = await getClient(user.mobile);
      if (cli) {
        await client.updateUsername(username);
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", parseError(error), error)
  }
});

app.get('/UpdateName/:number', async (req, res, next) => {
  res.send("Updating Name");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const db = ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    console.log(user);
    if (!hasClient(user.mobile)) {
      const cli = await createClient(user.mobile, user.session);
      const client = await getClient(user.mobile);
      if (cli) {
        await client.updateProfile("Deleted Account", "Deleted Account");
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", parseError(error), error)
  }
});


app.get('/deletepp/:number', async (req, res, next) => {
  res.send("Updating Name");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const db = ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    console.log(user);
    if (!hasClient(user.mobile)) {
      const cli = await createClient(user.mobile, user.session);
      const client = await getClient(user.mobile);
      if (cli) {
        await client.deleteProfilePhotos();
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", parseError(error), error)
  }
});

app.get('/removeAuths/:number', async (req, res) => {
  const number = req.params?.number;
  const db = ChannelService.getInstance();
  const user = await db.getUser({ mobile: number });
  if (!hasClient(user.mobile)) {
    const cli = await createClient(user.mobile, user.session);
    const client = await getClient(user.mobile);
    if (client) {
      await client.removeOtherAuths();
      res.send("Auths Removed");
    } else {
      res.send("client EXPIRED");
    }
  } else {
    res.send("Client Already existing");
  }
});

app.get('/exec/:cmd', async (req, res, next) => {
  let cmd = req.params.cmd;
  console.log(`executing: `, cmd);
  try {
    res.send(console.log(execSync(cmd).toString()));
  } catch (error) {
    console.log(parseError(error))
  }
});

app.get('/blockusers/:number', async (req, res) => {
  const number = req.params?.number;
  const db = ChannelService.getInstance();
  const user = await db.getUser({ mobile: number });
  if (!hasClient(user.mobile)) {
    const cli = await createClient(user.mobile, user.session);
    const client = await getClient(user.mobile);
    if (client) {
      await client.blockAllUsers();
      res.send("Blocked Users");
    } else {
      res.send("client EXPIRED");
    }
  } else {
    res.send("Client Already existing");
  }
});

app.get('/getAuths/:number', async (req, res) => {
  const number = req.params?.number;
  const db = ChannelService.getInstance();
  const user = await db.getUser({ mobile: number });
  if (!hasClient(user.mobile)) {
    const cli = await createClient(user.mobile, user.session);
    const client = await getClient(user.mobile);
    if (client) {
      res.json(await client.getAuths());
    } else {
      res.send("client EXPIRED");
    }
  } else {
    res.send("Client Already existing");
  }
});


app.get('/connectcliens/:limit/:skip', async (req, res) => {
  const limit = req.params?.limit;
  const skip = req.params?.skip;
  const db = ChannelService.getInstance();
  const users = await db.getUsersFullData(parseInt(limit), parseInt(skip));
  let resp = '<html><head><style>pre { font-size: 18px; }</style></head><body><pre>';

  for (const user of users) {
    if (!hasClient(user.mobile)) {
      const cli = await createClient(user.mobile, user.session);
      if (cli) {
        resp += `${user.mobile} : true\n\n`;
      } else {
        resp += `${user.mobile} : false\n\n`;
      }
    }
  }

  resp += '</pre></body></html>';

  console.log("data: ", resp);
  res.setHeader('Content-Type', 'text/html');
  res.send(resp);
});

app.get('/disconnectclients', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  await disconnectAll();
});

app.get('/promoteStats', async (req, res, next) => {
  const resp = await getPromotionStatsHtml();
  res.setHeader('Content-Type', 'text/html');
  res.send(resp)
});


app.get('/getusers/:limit/:skip', async (req, res, next) => {
  const limit = parseInt(req.params?.limit ? req.params?.limit : 10);
  const skip = parseInt(req.params?.skip ? req.params?.skip : 10);
  const db = ChannelService.getInstance();
  const users = await db.getUsers(limit, skip);
  res.json(users)
})

app.get('/getlastmsgs/:number/:limit', async (req, res, next) => {
  const limit = parseInt(req.params?.limit ? req.params?.limit : 10);
  const number = req.params?.number;
  console.log(number, limit);
  const clientobj = getClient(number);
  await clientobj.client.connect();
  console.log(clientobj.client.connected);
  if (clientobj) {
    const result = await clientobj?.getLastMsgs(limit, number);
    res.send(result)
  } else {
    res.send("client is undefined");
  }

})

app.get('/getchannels', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await fetchWithTimeout(`${value.url}getchannels`);
    await sleep(1000);
  }
});

app.get('/restart', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const username = req.query.username;
  const checker = checkerclass.getinstance()
  checker.restart(username.toLowerCase());
});

app.get('/receiveNumber/:num', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  try {
    const username = req.query.username;
    const num = parseInt(req.params.num);
    const data = userMap.get(username.toLowerCase());
    if (data) {
      await fetchWithTimeout(`${data.url}receiveNumber/${num}`, { timeout: 7000 });
    }
  } catch (error) {
    console.log("Some Error: ", parseError(error), error.code);
  }
});

app.get('/disconnectUser', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  try {
    const username = req.query.username;
    const data = userMap.get(username.toLowerCase());
    if (data) {
      await fetchWithTimeout(`${data.url}exit`, { timeout: 7000 });
    }
  } catch (error) {
    console.log("Some Error: ", parseError(error), error.code);
  }
});

app.get('/tgclientoff/:num', async (req, res) => {
  try {
    const username = req.query.username;
    const processId = req.params.num;
    console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), 'Req receved from: ', req.ip, req.query.url, " : ", username, ' - ', processId)

    try {
      const data = userMap.get(username.toLowerCase());
      const url = data?.url;
      if (url) {
        const connectResp = await fetchWithTimeout(`${url}getprocessid`, { timeout: 10000 });
        if (connectResp.data.ProcessId === processId) {
          userMap.set(username.toLowerCase(), { ...data, timeStamp: Date.now(), downTime: 0, lastPingTime: Date.now() });
          pushToconnectionQueue(username, processId)
          res.send(true)
        } else {
          console.log(`Actual Process Id from ${url}getprocessid : `, connectResp.data.ProcessId);
          console.log("Request received from Unknown process");
          res.send(false)
        }
      }
    } catch (error) {
      console.log("Some Error here: ", error.code)
      res.send(true)
    }

  } catch (error) {
    console.log("Some Error and here: ", error);
    res.send(true)
  }
});

app.get('/receive', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  try {
    const username = req.query.username;
    const data = userMap.get(username.toLowerCase());
    if (data) {
      userMap.set(username.toLowerCase(), { ...data, timeStamp: Date.now(), downTime: 0, lastPingTime: Date.now() });
      pings[username.toLowerCase()] = Date.now();
      console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), username, 'Ping!! Received!!')
    } else {
      console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), `User ${username} Not exist`);
    }
  } catch (error) {
    console.log("Some Error: ", parseError(error), error.code);
  }
});

const userAccessData = new Map();

app.get('/getenv', async (req, res) => {
  try {
    console.log(process.env)
  } catch (error) {
    console.log(parseError(error))
  }
  res.send("hii");
});


app.get('/isRecentUser', (req, res) => {
  const chatId = req.query.chatId;
  const accessData = userAccessData.get(chatId) || { timestamps: [], videoDetails: {} };
  const currentTime = Date.now();
  const recentAccessData = accessData?.timestamps?.filter(timestamp => currentTime - timestamp <= 15 * 60 * 1000);
  recentAccessData.push(currentTime);
  userAccessData.set(chatId, { videoDetails: accessData.videoDetails, timestamps: recentAccessData });
  res.send({ count: recentAccessData.length, videoDetails: accessData.videoDetails });
});

app.post('/isRecentUser', (req, res) => {
  const chatId = req.query.chatId;
  let videoDetails = req.body;
  const accessData = userAccessData.get(chatId) || { timestamps: [], videoDetails: {} };
  videoDetails = { ...accessData.videoDetails, ...videoDetails }
  userAccessData.set(chatId, { videoDetails, timestamps: accessData.timestamps });
  res.send({ count: accessData.timestamps.length, videoDetails: videoDetails });
});

app.get('/resetRecentUser', (req, res) => {
  const chatId = req.query.chatId;
  userAccessData.delete(chatId);
  res.send({ count: 0 });
});

app.get('/paymentstats', async (req, res) => {
  const chatId = req.query.chatId;
  const profile = req.query.profile;
  const db = ChannelService.getInstance();
  const resp = await db.checkIfPaidToOthers(chatId, profile);
  console.log(resp)
  res.send(resp)
})


const playbackPositions = new Map();

app.get('/video', (req, res) => {
  let vid = req.query.video || 1;
  const chatId = req.query.chatId
  if (playbackPositions.has(chatId)) {
    if ((playbackPositions.get(chatId) + (3 * 60 * 1000)) > Date.now() && vid == '2') {
      vid = "3"
    }
  }
  let filePath = `./video${vid}.mp4`;
  playbackPositions.set(chatId, Date.now());
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;

  const head = {
    'Content-Length': fileSize,
    'Content-Type': 'video/mp4',
  };

  res.writeHead(200, head);
  fs.createReadStream(filePath).pipe(res);

});


app.get('/requestcall', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  try {
    const username = req.query.username;
    const chatId = req.query.chatId;
    const type = req.query.type;
    const user = userMap.get(username.toLowerCase());
    // await fetchWithTimeout(`${ppplbot()}&text=Call Request Recived: ${username} | ${chatId}`);
    console.log(`Call Request Recived: ${username} | ${chatId}`)
    if (user) {
      const payload = { chatId, profile: user.clientId, type }
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(payload),
      };
      const result = await fetchWithTimeout("https://arpithared.onrender.com/events/schedule", options, 3);
      console.log("eventsResponse:", result?.data)
      // setTimeout(async () => {
      //   try {
      //     const data = await fetchWithTimeout(`${user.url}requestcall/${chatId}`, { timeout: 7000 });
      //     if (data.data) {
      //       console.log(`Call Request Sent: ${username} | ${chatId}`)
      //       setTimeout(async () => {
      //         try {
      //           const data = await fetchWithTimeout(`${user.url}requestcall/${chatId}`, { timeout: 7000 });
      //           setTimeout(async () => {
      //             await fetchWithTimeout(`${user.url}sendMessage/${chatId}?msg=Not Connecting!!, Don't worry I will try again in sometime!! okay!!`, { timeout: 7000 });
      //           }, 3 * 60 * 1000);
      //         } catch (error) {
      //           console.log(parseError(error))
      //         }
      //       }, 2 * 60 * 1000);
      //     } else {
      //       console.log(`Call Request Sent Not Sucess: ${username} | ${chatId}`);
      //     }
      //   } catch (error) {
      //     console.log("Failed", user);
      //   }

      // }, 3 * 60 * 1000);
    } else {
      console.log("USer not exist!!")
    }
  } catch (error) {
    console.log("Some Error: ", parseError(error), error.code);
  }
});

const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(app));
const config = new DocumentBuilder()
  .setTitle('NestJS and Express API')
  .setDescription('API documentation')
  .setVersion('1.0')
  .build();
const document = SwaggerModule.createDocument(nestApp, config);
// fs.writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));
SwaggerModule.setup('api', nestApp, document);
mongoose.set('debug', true)
await nestApp.init();
let usersService;
app.listen(port, async () => {
  usersService = new UsersService(mongoose.model(User.name, UserSchema))
  console.log(`Example app listening at http://localhost:${port}`)
});

let startedConnecting = false;
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
    // setInterval(async () => {
    //     console.log('--------------------------------------------');
    //     userMap.forEach(async (val, key) => {
    //         try {
    //             const resp = await fetchWithTimeout(`${val.url}checkHealth`, { timeout: 10000 });
    //             if (resp.status === 200 || resp.status === 201) {
    //                 if (resp.data.status === apiResp.ALL_GOOD || resp.data.status === apiResp.WAIT) {
    //                     console.log(resp.data.username, ': All good');
    //                 } else {
    //                     console.log(resp.data.username, ': DIAGNOSE - Checking Connection - ', resp.data.status);
    //                     await fetchWithTimeout(`${ppplbot()}&text=${(resp.data.username).toUpperCase()}:healthCheckError${resp.data.status}`);
    //                     try {
    //                         const connectResp = await fetchWithTimeout(`${val.url}tryToConnect`, { timeout: 10000 });
    //                         console.log(connectResp.data.username, ': CONNECTION CHECK RESP - ', connectResp.data.status);
    //                         await fetchWithTimeout(`${ppplbot()}&text=${(connectResp.data.username).toUpperCase()}:retryResponse -${connectResp.data.status}`);
    //                     } catch (e) {
    //                         console.log(val.url, `CONNECTION RESTART FAILED!!`);
    //                     }
    //                 }
    //             } else {
    //                 console.log(val.url, `is unreachable!!`);
    //             }
    //         } catch (e) {
    //             console.log(val.url, `is unreachable!!`);
    //             //console.log(parseError(e))
    //         }
    //     })
    // }, 120000);

    setInterval(async () => {
      count++;
      // if (count % 4 == 0) {
      console.log(`-------------------------------------------------------------`)
      if (connetionQueue.length > 0 && !startedConnecting) {
        while (connetionQueue.length > 0) {
          startedConnecting = true;
          if (connetionQueue.length == 1) {
            startedConnecting = false;
          }
          const { username, processId } = connetionQueue.shift();
          console.log('Starting - ', username);
          try {
            const data = userMap.get(username.toLowerCase());
            const url = data?.url;
            if (url) {
              const connectResp = await fetchWithTimeout(`${url}tryToConnect/${processId}`, { timeout: 10000 });
              console.log(connectResp.status)
            }
            setTimeout(async () => {
              try {
                const connectResp = await fetchWithTimeout(`${url}promote`);
              } catch (error) {
                console.log(error.code)
              }
              setTimeout(async () => {
                try {
                  const connectResp2 = await fetchWithTimeout(`${url}markasread`);
                } catch (error) {
                  console.log(error.code)
                }
              }, 35000);
            }, 35000);
          } catch (error) {
            console.log("Some Error at coneect: ", error.code)
          }
          await sleep(5000);
        }
      }

      const db = ChannelService.getInstance();

      for (const key of Array.from(userMap.keys())) {
        const val = userMap.get(key);
        if (val) {
          if ((Date.now() - pings[key]) > (5 * 60 * 1000) && (Date.now() - val.lastPingTime) > (5 * 60 * 1000)) {
            try {
              if ((Date.now() - pings[key]) > (7 * 60 * 1000) && (Date.now() - val.lastPingTime) > (7 * 60 * 1000)) {
                const url = val.url.includes('glitch') ? `${val.url}exit` : val.deployKey;
                console.log("trying url :", url)
                try {
                  await axios.get(val.url);
                } catch (e) {
                  await fetchWithTimeout(url, 3)
                  await fetchWithTimeout(`${ppplbot()}&text=${val.clientId} : Not responding | url = ${url}`);
                }
              } else {
                await fetchWithTimeout(`${ppplbot()}&text=${val.clientId} : not responding - ${(Date.now() - val.lastPingTime) / 60000}`);
              }
            } catch (error) {
              await fetchWithTimeout(`${ppplbot()}&text=${val.clientId} : Url not responding`);
              console.log("Some Error: ", parseError(error), error.code);
            }
          }

          if (val.downTime > 2) {
            console.log(val.clientId, " - ", val.downTime)
          }
          try {
            const resp = await axios.get(`${val.url}`, { timeout: 120000 });
            userMap.set(key, { ...val, downTime: 0 })
          } catch (e) {
            console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), val.url, ` NOT Reachable - ${val.downTime}`);
            userMap.set(key, { ...val, downTime: val.downTime + 1 })
            if (val.downTime > 5) {
              userMap.set(key, { ...val, downTime: -5 })
              try {
                const resp = await fetchWithTimeout(`${val.deployKey}`, { timeout: 120000 });
                if (resp?.status == 200 || resp.status == 201) {
                  await fetchWithTimeout(`${ppplbot()}&text=Restarted ${key}`);
                } else {
                  console.log(`Failed to Restart ${key}`);
                  await fetchWithTimeout(`${ppplbot()}&text=Failed to Restart ${key}`);
                }
              } catch (error) {
                console.log(`Failed to Restart ${key}`);
                await fetchWithTimeout(`${ppplbot()}&text=Failed to Restart ${key}`);
              }
            }
          }

          const userPromoteStats = await db.readSinglePromoteStats(val.clientId);
          if (userPromoteStats?.isActive && (Date.now() - userPromoteStats?.lastUpdatedTimeStamp) / (1000 * 60) > 12) {
            try {
              const resp = await axios.get(`${val.url}promote`, { timeout: 120000 });
            } catch (error) {
              console.log("Some Error: ", parseError(error), error.code);
            }
          }
        } else {
          console.log(key, "- Does not exist");
          userMap.clear();
          await setUserMap()
        }
        await sleep(1000)
      }

      try {
        const resp = await axios.get(`https://mychatgpt-pg6w.onrender.com/`, { timeout: 55000 });
      }
      catch (e) {
        console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), 'ChatGPT', ` NOT Reachable`);
        await fetchWithTimeout(`${ppplbot()}&text=ChatGPT  NOT Reachable`);
        try {
          const resp = await axios.get(`https://api.render.com/deploy/srv-cflkq853t39778sm0clg?key=e4QNTs9kDw4`, { timeout: 55000 });
          if (resp?.status == 200 || resp.status == 201) {
            await fetchWithTimeout(`${ppplbot()}&text=Restarted CHATGPT`);
          }
        } catch (error) {
          console.log("Cannot restart ChatGpt server");
          await fetchWithTimeout(`${ppplbot()}&text=Cannot restart ChatGpt server`);
        }
      }
      try {
        const resp = await axios.get(`${process.env.uptimeChecker}`, { timeout: 55000 });
      }
      catch (e) {
        console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), 'UpTimeBot', ` NOT Reachable`);
        await fetchWithTimeout(`${ppplbot()}&text=${process.env.uptimeChecker}  NOT Reachable `);
        try {
          const resp = await axios.get(`https://api.render.com/deploy/srv-cgqhefceooggt0ofkih0?key=CL2p5mx56c0`, { timeout: 55000 });
          if (resp?.status == 200 || resp.status == 201) {
            await fetchWithTimeout(`${ppplbot()}&text=Restarted ${process.env.uptimeChecker}`);
          }
        } catch (error) {
          console.log("Cannot restart ChatGpt server");
          await fetchWithTimeout(`${ppplbot()}&text=Cannot restart ${process.env.uptimeChecker} server`);
        }
      }
      try {
        const resp = await axios.get(`https://tgsignup.onrender.com/`, { timeout: 55000 });
      }
      catch (e) {
        console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), 'ChatGPT', ` NOT Reachable`);
        await fetchWithTimeout(`${ppplbot()}&text=TgSignup  NOT Reachable`);
      }

      try {
        const resp = await axios.get(process.env.tgcms, { timeout: 55000 });
        console.log(resp.data)
      }
      catch (e) {
        parseError(e)
        console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), process.env.tgcms, ` NOT Reachable`);
        await fetchWithTimeout(`${ppplbot()}&text=${process.env.tgcms}`);
      }
      // }
      try {
        const num = Math.floor(Math.random() * 101);
        const resp2 = await axios.get(`https://execuor-production.up.railway.app/?num=${num}`, { timeout: 55000 });
        console.log(resp2.data)
        if (parseInt(resp2.data?.num || 0) !== num + 3) {
          await fetchWithTimeout(`${ppplbot()}&text=REPLIT Manipulated`);
        }
      } catch (e) {
        console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), 'REPLIT', ` NOT Reachable`);
        await fetchWithTimeout(`${ppplbot()}&text=REPLIT  NOT Reachable`);
      }
    }, 60000);

    // setInterval(async () => {
    //   userMap.forEach(async (val, key) => {
    //     if (val.timeStamp + 230000 < Date.now()) {
    //       userMap.set(key, { ...val, timeStamp: Date.now() });
    //       try {
    //         await fetchWithTimeout(`${ ppplbot() } & text=${ key } is DOWN!!`, { timeout: 10000 });
    //         await fetchWithTimeout(`${ val.url }`, { timeout: 10000 });
    //         try {
    //           const resp = await fetchWithTimeout(`${ val.url }checkHealth`, { timeout: 10000 });
    //           if (resp.status === 200 || resp.status === 201) {
    //             if (resp.data.status === apiResp.ALL_GOOD || resp.data.status === apiResp.WAIT) {
    //               console.log(resp.data.username, ': All good');
    //             } else {
    //               console.log(resp.data.username, ': DIAGNOSE - HealthCheck - ', resp.data.status);
    //               await fetchWithTimeout(`${ ppplbot() } & text=${(resp.data.username).toUpperCase()}: HealthCheckError - ${ resp.data.status } `);
    //               try {
    //                 const connectResp = await fetchWithTimeout(`${ val.url } tryToConnect`, { timeout: 10000 });
    //                 console.log(connectResp.data.username, ': RetryResp - ', connectResp.data.status);
    //                 await fetchWithTimeout(`${ ppplbot() }& text=${ (connectResp.data.username).toUpperCase() }: RetryResponse - ${ connectResp.data.status } `);
    //               } catch (e) {
    //                 s
    //                 console.log(val.url, `CONNECTION RESTART FAILED!!`);
    //               }
    //             }
    //           } else {
    //             console.log(val.url, `is unreachable!!`);
    //           }
    //         } catch (e) {
    //           console.log(val.url, `is unreachable!!`);
    //           //console.log(parseError(e))
    //         }
    //       } catch (e) {
    //         console.log(parseError(e))
    //       }
    //     }
    //   })
    // }, 50000);
  }

  async restart(username, processId) {
    const data = userMap.get(username);
    console.log(data, username);
    const url = data?.url;
    if (url) {
      userMap.set(username, { ...data, timeStamp: Date.now() });
      try {
        //await fetchWithTimeout(`${ ppplbot() }& text=${ username } is DOWN!!`, { timeout: 10000 });
        //await fetchWithTimeout(`${ url } `, { timeout: 10000 });
        try {
          console.log('Checking Health')
          const resp = await fetchWithTimeout(`${url} checkHealth`, { timeout: 10000 });
          if (resp.status === 200 || resp.status === 201) {
            if (resp.data.status === apiResp.ALL_GOOD || resp.data.status === apiResp.WAIT) {
              console.log(resp.data.username, ': All good');
            } else {
              console.log(resp.data.username, ': DIAGNOSE - HealthCheck - ', resp.data.status);
              await fetchWithTimeout(`${ppplbot()}& text=${(resp.data.username).toUpperCase()}: HealthCheckError - ${resp.data.status} `);
              try {
                const connectResp = await fetchWithTimeout(`${url}tryToConnect/${processId} `, { timeout: 10000 });
                console.log(connectResp.data.username, ': RetryResp - ', connectResp.data.status);
                await fetchWithTimeout(`${ppplbot()}& text=${(connectResp.data.username).toUpperCase()}: RetryResponse - ${connectResp.data.status} `);
              } catch (e) {
                console.log(parseError(e))
                console.log(url, `CONNECTION RESTART FAILED!!`);
              }
            }
          } else {
            console.log(url, `is unreachable!!`);
          }
        } catch (e) {
          console.log(url, `is unreachable!!`);
          //console.log(parseError(e))
        }
      }
      catch (e) {
        console.log(parseError(e))
      }
    }
    else {
      console.log('url is undefined');
    }
  }
}

function extractNumberFromString(inputString) {
  const regexPattern = /\d+/;
  const matchResult = inputString?.match(regexPattern);
  if (matchResult && matchResult.length > 0) {
    // Parse the matched string into a number and return it
    return parseInt(matchResult[0], 10);
  }
  // If no number is found, return null
  return null;
}

async function createInitializedObject() {
  const initializedObject = {};
  const db = ChannelService.getInstance();
  const users = await db.getAllUserClients();
  for (const user of users) {
    if (extractNumberFromString(user.clientId))
      initializedObject[user.clientId.toUpperCase()] = {
        profile: user.clientId.toUpperCase(),
        totalCount: 0,
        totalPaid: 0,
        totalOldPaid: 0,
        oldPaidDemo: 0,
        totalpendingDemos: 0,
        oldPendingDemos: 0,
        totalNew: 0,
        totalNewPaid: 0,
        newPaidDemo: 0,
        newPendingDemos: 0,
        names: "",
        fullShowPPl: 0,
        fullShowNames: ""
      }
  }

  return initializedObject;
}

async function getPromotionStatsPlain() {
  let resp = '';
  const db = ChannelService.getInstance();
  const result = await db.readPromoteStats();
  for (const data of result) {
    resp += `${data.client.toUpperCase()} : ${data.totalCount} ${data.totalCount > 0 ? ` | ${Number((Date.now() - data.lastUpdatedTimeStamp) / (1000 * 60)).toFixed(2)}` : ''}`;
  }
  return resp;
}

async function getPromotionStats() {
  let resp = '';
  const db = ChannelService.getInstance();
  const result = await db.readPromoteStats();
  for (const data of result) {
    resp += `${data.client.toUpperCase()} : <b>${data.totalCount}</b>${data.totalCount > 0 ? ` | ${Number((Date.now() - data.lastUpdatedTimeStamp) / (1000 * 60)).toFixed(2)}` : ''}<br>`;
  }
  return resp;
}

async function getPromotionStatsHtml() {
  let resp = '<html><head><style>pre { font-size: 18px; }</style></head><body><pre>';
  resp = resp + await getPromotionStats();
  resp += '</pre></body></html>';
  return resp;
}

async function getData() {
  const profileData = await createInitializedObject();
  const db = await ChannelService.getInstance();
  let entries = await db.readStats();
  // console.log(Object.keys(profileData));
  for (const entry of entries) {
    const { count, newUser, payAmount, demoGivenToday, demoGiven, profile, client, name, secondShow } = entry;

    // console.log(profile.toUpperCase(), profileData[profile.toUpperCase()])
    if (client && profileData[client.toUpperCase()]) {
      const userData = profileData[client.toUpperCase()];
      userData.totalCount += count;
      userData.totalPaid += payAmount > 0 ? 1 : 0;
      userData.totalOldPaid += (payAmount > 0 && !newUser) ? 1 : 0;
      userData.oldPaidDemo += (demoGivenToday && !newUser) ? 1 : 0;
      userData.totalpendingDemos += (payAmount > 25 && !demoGiven) ? 1 : 0;
      userData.oldPendingDemos += (payAmount > 25 && !demoGiven && !newUser) ? 1 : 0;
      if (payAmount > 25 && !demoGiven) {
        userData.names = userData.names + ` ${name} |`
      }

      if (demoGiven && ((payAmount > 90 && !secondShow) || (payAmount > 150 && secondShow))) {
        userData.fullShowPPl++;
        userData.fullShowNames = userData.fullShowNames + ` ${name} |`
      }

      if (newUser) {
        userData.totalNew += 1;
        userData.totalNewPaid += payAmount > 0 ? 1 : 0;
        userData.newPaidDemo += demoGivenToday ? 1 : 0;
        userData.newPendingDemos += (payAmount > 25 && !demoGiven) ? 1 : 0;
      }
    }
  }
  const profileDataArray = Object.entries(profileData);
  profileDataArray.sort((a, b) => b[1].totalpendingDemos - a[1].totalpendingDemos);
  let reply = '';
  for (const [profile, userData] of profileDataArray) {
    reply += `${profile.toUpperCase()} : <b>${userData.totalpendingDemos}</b> | ${userData.names}<br>`;
  }

  profileDataArray.sort((a, b) => b[1].fullShowPPl - a[1].fullShowPPl);
  let reply2 = '';
  for (const [profile, userData] of profileDataArray) {
    reply2 += `${profile.toUpperCase()} : <b>${userData.fullShowPPl}</b> |${userData.fullShowNames}<br>`;
  }

  let reply3 = await getPromotionStats()

  return (
    `<div>
      <div style="display: flex; margin-bottom: 60px">
        <div style="flex: 1;">${reply}</div>
        <div style="flex: 1; ">${reply2}</div>
      </div>
      <div style="display: flex;">
        <div style="flex: 1; " >${reply3}</div>
      </div>
    </div>`
  );
}
function pushToconnectionQueue(username, processId) {
  const existingIndex = connetionQueue.findIndex(entry => entry.username === username);
  if (existingIndex !== -1) {
    connetionQueue[existingIndex].processId = processId;
  } else {
    connetionQueue.push({ username, processId });
  }
}


async function joinchannels(value) {
  try {
    let resp = await fetchWithTimeout(`${value.url}channelinfo`, { timeout: 200000 });
    await fetchWithTimeout(`${(ppplbot())}&text=ChannelCount SendTrue - ${value.clientId}: ${resp.data.canSendTrueCount}`)
    if (resp?.data?.canSendTrueCount && resp?.data?.canSendTrueCount < 300) {
      await fetchWithTimeout(`${ppplbot()}&text=Started Joining Channels- ${value.clientId}`)
      const keys = ['wife', 'adult', 'lanj', 'servic', 'paid', 'randi', 'bhab', 'boy', 'girl'];
      const db = ChannelService.getInstance();
      const channels = await db.getActiveChannels(100, 0, keys, resp.data?.ids, 'activeChannels');
      for (const channel of channels) {
        try {
          console.log(channel.username);
          const username = channel?.username?.replace("@", '');
          if (username) {
            fetchWithTimeout(`${value.url}joinchannel?username=${username}`);
            await sleep(200000);
          }
        } catch (error) {
          console.log("Some Error: ", parseError(error), error)
        }
      }
    }
  } catch (error) {
    console.log(parseError(error))
  }
}
