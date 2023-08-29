'use strict';
const dotenv = require('dotenv')
dotenv.config();
const express = require('express');
const axios = require('axios');
const schedule = require('node-schedule-tz');
const timeOptions = { timeZone: 'Asia/Kolkata', timeZoneName: 'short' };
const ChannelService = require('./dbservice');
const { getClient, hasClient, disconnectAll, createClient, deleteClient } = require('./telegramManager');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var cors = require('cors');

const app = express();
const port = 8000;

fetchWithTimeout('https://api.db-ip.com/v2/free/self')
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
const userMap = new Map();

let count = 0;
let botCount = 0
const ppplbot = () => {
  let token;
  if (botCount % 2 == 1) {
    token = `bot6624618034:AAHoM3GYaw3_uRadOWYzT7c2OEp6a7A61mY`
  } else {
    token = `bot6607225097:AAG6DJg9Ll5XVxy24Nr449LTZgRb5bgshUA`
  }

  return `https://api.telegram.org/${token}/sendMessage?chat_id=-1001801844217`
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
  users.forEach(user => {
    userMap.set(user.userName.toLowerCase(), { url: `${user.repl}/`, timeStamp: Date.now(), deployKey: user.deployKey, downTime: 0, lastPingTime: Date.now(), clientId: user.clientId })
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
      await fetchWithTimeout(`${value.url}promote`);
      if (hour && hour % 3 === 0) {
        await fetchWithTimeout(`${value.url}calltopaid`);
      }
      await sleep(2000)
    }
  })

  schedule.scheduleJob('test1', ' 2 6,10,16,20,3 * * * ', 'Asia/Kolkata', async () => {
    Array.from(userMap.values()).map(async (value) => {
      await fetchWithTimeout(`${value.url}assureppl`);
    })
  })

  schedule.scheduleJob('test2', '*/10 * * * *', 'Asia/Kolkata', async () => {
    Array.from(userMap.values()).map(async (value) => {
      await fetchWithTimeout(`${value.url}markasread`);
    })
  })

  schedule.scheduleJob('test3', ' 0 7,13,20,23 * * * ', 'Asia/Kolkata', async () => {
    Array.from(userMap.values()).map(async (value) => {
      await fetchWithTimeout(`${value.url}asktopay`);
    })
  })

  schedule.scheduleJob('test3', ' 25 2 * * * ', 'Asia/Kolkata', async () => {
    for (const value of userMap.values()) {
      try {
        const now = new Date();
        if (now.getUTCDate() % 3 === 1) {
          await fetchWithTimeout(`${value.url}leavechannels`);
        }
        let resp = await fetchWithTimeout(`${value.url}channelinfo`, { timeout: 200000 });
        await fetchWithTimeout(`${(ppplbot())}&text=ChannelCount SendTrue - ${value.clientId}: ${resp.data.canSendTrueCount}`)
        // if (resp?.data?.canSendTrueCount && resp?.data?.canSendTrueCount < 300) {
        //   await fetchWithTimeout(`${ppplbot()}&text=Started Joining Channels- ${value.clientId}`)
        //   // joinchannels(value.url);
        // }
      } catch (error) {
        console.log(error);
      }
    }
    await fetchWithTimeout(`https://mychatgpt-pg6w.onrender.com/deletefiles`);
  })

  schedule.scheduleJob('test3', ' 25 0 * * * ', 'Asia/Kolkata', async () => {
    for (const value of userMap.values()) {
      await sleep(1000);
      await fetchWithTimeout(`${value.url}resetunpaid`);
      // await fetchWithTimeout(`${value.url}resetunppl`);
      await fetchWithTimeout(`${value.url}getuserstats2`);

      const now = new Date();
      if (now.getUTCDate() % 3 === 1) {
        setTimeout(async () => {
          await fetchWithTimeout(`${value.url}getchannels`);
        }, 30000);
      }
      setTimeout(async () => {
        await fetchWithTimeout(`${value.url}asktopay`);
      }, 300000);
      await sleep(1000)
    }

    await fetchWithTimeout(`${ppplbot()}&text=${encodeURIComponent(await getPromotionStats())}`);
    const db = ChannelService.getInstance();
    await db.updateActiveChannels();
    await db.clearStats2();
    await db.clearPromotionStats();
    await db.initPromoteStats();
    try {
      const resp = await axios.get(`https://mychatgpt-pg6w.onrender.com/getstats`, { timeout: 55000 });
      const resp2 = await axios.get(`https://mychatgpt-pg6w.onrender.com/clearstats`, { timeout: 55000 });
    } catch (error) {
      console.log(error)
    }
  })
} catch (error) {
  console.log(error);
}

async function fetchWithTimeout(resource, options = {}) {
  const timeout = options?.timeout || 15000;

  const source = axios.CancelToken.source();
  const id = setTimeout(() => source.cancel(), timeout);
  try {
    const response = await axios({
      ...options,
      url: resource,
      cancelToken: source.token
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message, resource);
    } else {
      console.log('Error:', error.message);
    }
    return undefined;
  }
}

async function assure() {
  Array.from(userMap.values()).map(async (value) => {
    await fetchWithTimeout(`${value.url}resptopaid?msg=Hey...Dont worry!! I will Call you before night ok!!`);
    setTimeout(async () => {
      await fetchWithTimeout(`${value.url}markasread?all=true`);
    }, 20000)
  })
}

// async function createTempClient() {
//   const db = await ChannelService.getInstance();
//   const user = await db.getTempUser();
//   console.log(user);
//   console.log(await createClient(user.mobile, user.session))
// }
// setTimeout(async () => {
//   await createTempClient()
// }, 3000);

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
    const cli = await createClient(document.mobile, document.session);
    const client = await getClient(document.mobile);
    if (cli) {
      console.log(document.mobile, " :  true");
      await db.updateUser(document, { msgs: cli.msgs, totalChats: cli.total });
    } else {
      console.log(document.mobile, " :  false");
      await db.deleteUser(document, { msgs: cli });
    }
    if (client) {
      await client?.disconnect(document.mobile);
      deleteClient()
    }
  }
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
  channels.forEach((channel) => {
    resp = resp + `${channel.username}|`
  })
  res.send(resp);
});

app.get('/activechannels/:limit/:skip', async (req, res, next) => {
  const limit = req.params.limit ? req.params.limit : 30
  const skip = req.params.skip ? req.params.skip : 20
  const k = req.query?.k
  const db = ChannelService.getInstance();
  const result = await db.getActiveChannels(parseInt(limit), parseInt(skip), k);
  let resp = 'joinchannel:'
  result.forEach((channel) => {
    resp = resp + `@${channel.username}|`
  })
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
              }, 30000);
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

app.get('/joinchannel', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
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
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const queries = req.query
  let newQuery = '';
  Object.keys(req.query).map((key) => {
    newQuery += `${queries[key]}/`
  });
  console.log(newQuery);
  for (const value of userMap.values()) {
    const url = `${value.url}${newQuery}`;
    console.log(url);
    await sleep(1000);
    await fetchWithTimeout(url);
  }
});

app.get('/usermap', async (req, res) => {
  checkerclass.getinstance()
  res.json(Array.from(userMap.values()));
});

app.get('/clients', async (req, res) => {
  checkerclass.getinstance();
  const db = ChannelService.getInstance();
  const users = await db.getAllUserClients();
  res.json(users)
});

app.get('/keepready2', async (req, res, next) => {
  checkerclass.getinstance()
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
  checkerclass.getinstance()
  const dnsMsg = encodeURIComponent(`Dont Speak Okay!!\n**I am in Bathroom**\n\nMute yourself!!\n\nI will show you Okay..!!`)
  const msg = req.query.msg.toLowerCase() == 'dns' ? dnsMsg : req.query.msg;
  Array.from(userMap.values()).map(async (value) => {
    await fetchWithTimeout(`${value.url}resptopaid?msg=${msg ? msg : "Oye..."}`);
  });
  const db = ChannelService.getInstance();
  await db.clearStats();
  res.send(`Responding!!\nMsg = ${msg}`);
});

app.get('/asktopay', async (req, res, next) => {
  checkerclass.getinstance()
  res.send(`Asking Pppl`);
  next();
}, async (req, res) => {
  const msg = req.query.msg;
  console.log("Msg = ", msg);
  Array.from(userMap.values()).map(async (value) => {
    await fetchWithTimeout(`${value.url}asktopay`)
  })
});


app.get('/calltopaid', async (req, res, next) => {
  checkerclass.getinstance()
  res.send(`Asking Pppl`);
  next();
}, async (req, res) => {
  const msg = req.query.msg;
  console.log("Msg = ", msg);
  Array.from(userMap.values()).map(async (value) => {
    await fetchWithTimeout(`${value.url}calltopaid`)
  })
});


app.get('/markasread', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const all = req.query.all;
  console.log("all = ", all);
  Array.from(userMap.values()).map(async (value) => {
    await fetchWithTimeout(`${value.url}markasread?${all ? "all=true" : ''}`);
  })
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

app.get('/getUpiId', async (req, res) => {
  checkerclass.getinstance();
  const app = req.query.app ? req.query.app : "paytm3"
  const db = ChannelService.getInstance();
  const upiId = await db.getupi(app);
  res.send(upiId);
});

app.get('/getAllUpiIds', async (req, res) => {
  checkerclass.getinstance();
  const db = ChannelService.getInstance();
  const upiIds = await db.getAllUpis()
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

app.post('/getUserConfig', async (req, res) => {
  const filter = req.query
  const data = req.body
  checkerclass.getinstance();
  const db = ChannelService.getInstance();
  const upiIds = await db.updateUserConfig(filter, data);
  await setUserMap();
  res.json(upiIds);
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

app.get('/connectclient/:number', async (req, res) => {
  const number = req.params?.number;
  const db = ChannelService.getInstance();
  const user = await db.getUser({ mobile: number });
  if (!hasClient(user.mobile)) {
    const cli = await createClient(user.mobile, user.session);
    if (cli) {
      res.send("client created");
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
    console.log(error);
  }
});

app.get('/tgclientoff/:num', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  try {
    const userName = req.query.userName;
    const processId = req.params.num;
    console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), 'Req receved from: ', userName, ' - ', processId)
    // try {
    //   //await axios.get(`${val.url}exit`, { timeout: 7000 });
    //   console.log('Other Instance Exist');
    // } catch (e) {
    //   console.log('No Other Instance Exist');
    // }
    // await axios.get(`${ppplbot()}&text=${userName.toUpperCase()}:  TG_CLIENT Seems OFF`);
    //console.log(`userName.toUpperCase()}:  TG_CLIENT Seems OFF`,'\nRestarting Service')
    // const checker = checkerclass.getinstance()
    // checker.restart(userName, processId);
    const data = userMap.get(userName.toLowerCase());
    userMap.set(userName.toLowerCase(), { ...data, timeStamp: Date.now(), downTime: 0, lastPingTime: Date.now() });
    connetionQueue.push({ userName, processId });
    // try {
    //   const data = userMap.get(userName.toLowerCase());
    //   const url = data?.url;
    //   if (url) {
    //     const connectResp = await axios.get(`${url}tryToConnect/${processId}`, { timeout: 10000 });
    //   }
    // } catch (error) {
    //   console.log(error)
    // }

  } catch (error) {
    console.log(error);
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
      console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), userName, 'Ping!! Received!!')
    } else {
      console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), `User ${userName} Not exist`);
    }
  } catch (error) {
    console.log(error);
  }
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
      setTimeout(async () => {
        try {
          const data = await axios.get(`${user.url}requestcall/${chatId}`, { timeout: 7000 });
          if (data.data) {
            // await fetchWithTimeout(`${ppplbot()}&text=Call Request Sent: ${userName} | ${chatId}`);
            console.log(`Call Request Sent: ${userName} | ${chatId}`)
            setTimeout(async () => {
              await axios.get(`${user.url}sendMessage/${chatId}?msg=Some Network Issue I guess, DOnt worry I will try again in sometime!! okay!!`, { timeout: 7000 });
            }, 45 * 1000);
          } else {
            console.log(`Call Request Sent Not Sucess: ${userName} | ${chatId}`);
            // await fetchWithTimeout(`${ppplbot()}&text=Call Request Sent Not Sucess: ${userName} | ${chatId}`);
          }
        } catch (error) {
          console.log("Failed", user);
        }

      }, 5 * 60 * 1000);
    } else {
      console.log("USer not exist!!")
    }
  } catch (error) {
    console.log(error);
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
              const connectResp = await axios.get(`${url}promote`);
              const connectResp2 = await axios.get(`${url}markasread`);
            }, 35000);
          } catch (error) {
            console.log(error)
          }
          await sleep(18000);
        }
      }

      const db = ChannelService.getInstance();
      userMap.forEach(async (val, key) => {
        const userPromoteStats = await db.readSinglePromoteStats(val.clientId);
        // console.log(userPromoteStats)
        if (val.downTime > 2) {
          console.log(val.clientId, " - ", val.downTime)
        }
        try {
          const resp = await axios.get(`${val.url}`, { timeout: 120000 });
          userMap.set(key, { ...val, downTime: 0 })
        }
        catch (e) {
          userMap.set(key, { ...val, downTime: val.downTime + 1 })
          console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), val.url, ` NOT Reachable - ${val.downTime}`);
          // await fetchWithTimeout(`${ppplbot()}&text=${key} is  NOT Reachable - ${val.downTime}`);
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
        if (userPromoteStats?.isActive && (Date.now() - userPromoteStats?.lastUpdatedTimeStamp) / (1000 * 60) > 12) {
          try {
            const resp = await axios.get(`${val.url}promote`, { timeout: 120000 });
          } catch (error) {
            console.log(error);
          }
        }
        if (Date.now() - val.lastPingTime > (3 * 60 * 1000)) {
          try {
            const data = userMap.get(key);
            if (Date.now() - val.lastPingTime > (7 * 60 * 1000)) {
              userMap.set(key, { ...data, timeStamp: Date.now(), downTime: 0, lastPingTime: Date.now() });
              await fetchWithTimeout(`${ppplbot()}&text=${val.clientId} : Trying to Exit as not responding `);
              const resp = await axios.get(`${val.url}exit`, { timeout: 120000 });
            } else {
              const url = val.url.includes('glitch') ? `${val.url}exec/refresh` : val.url;
              await fetchWithTimeout(`${ppplbot()}&text=${val.clientId} : Not responding | url = ${url}`);
              const resp = await axios.get(url, { timeout: 200000 });
            }
          } catch (error) {
            await fetchWithTimeout(`${ppplbot()}&text=${val.clientId} : Url not responding`);
            console.log(error);
          }
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
    }, 60000);

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
                const connectResp = await axios.get(`${url} tryToConnect / ${processId} `, { timeout: 10000 });
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
    if (extractNumberFromString(user.clientId) === 1)
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

async function joinchannels(url) {
  const keys = ['wife', 'adult', 'lanj', 'randi', 'bhabhi', 'telugu', 'tamil', 'friends', 'family', 'chatting', 'boys', 'girls'];
  const randomElement = keys[Math.floor(Math.random() * keys.length)];
  const db = ChannelService.getInstance();
  const channels = await db.getChannels(40, 0, randomElement);
  for (const channel of channels) {
    try {
      console.log(channel.username);
      const username = channel?.username?.replace("@", '');
      if (username) {
        await fetchWithTimeout(`${url}joinchannel?username=${username}`);
        await sleep(180000);
      }
    } catch (error) {
      console.log(error)
    }
  }
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

