const dotenv = require('dotenv')
dotenv.config();
const express = require('express');
const axios = require('axios');
const schedule = require('node-schedule-tz');
const timeOptions = { timeZone: 'Asia/Kolkata', timeZoneName: 'short' };
const ChannelService = require('./dbservice');
const { TelegramManager, getClient, hasClient, disconnectAll, createClient } = require('./telegramManager');
const bodyParser = require('body-parser');
const { sleep } = require('telegram/Helpers');


const app = express();
const port = 8000;
ChannelService.getInstance().connect()
const userMap = new Map();

let count = 0;
const ppplbot = "https://api.telegram.org/bot5807856562:AAFnhxpbQQ8MvyQaQGEg8vkpfCssLlY6x5c/sendMessage?chat_id=-1001801844217";
const pingerbot = `https://api.telegram.org/bot5807856562:${process.env.apikey}/sendMessage?chat_id=-1001703065531`;

const apiResp = {
  INSTANCE_NOT_EXIST: "INSTANCE_NOT_EXIST",
  CLIENT_NOT_EXIST: "CLIENT_NOT_EXIST",
  CONNECTION_NOT_EXIST: "CONNECTION_NOT_EXIST",
  ALL_GOOD: "ALL_GOOD",
  DANGER: "DANGER",
  WAIT: "WAIT"
};
// userMap.set('ArpithaRed3', { url: 'https://arpitha.cleverapps.io/', timeStamp: Date.now() })
userMap.set('snehared1', { url: 'https://snehareddy.onrender.com/', timeStamp: Date.now(), deployKey: `srv-cgdjo11mbg54ast4vit0?key=h3cZsVLB49U`, downTime: 0 })
userMap.set('arpithared7', { url: 'https://arpithared.onrender.com/', timeStamp: Date.now(), deployKey: `srv-cg5gm5ndvk4pls50tpi0?key=WYYrJhIAL4I`, downTime: 0 })
userMap.set('shruthiee', { url: 'https://shruthie.onrender.com/', timeStamp: Date.now(), deployKey: `srv-cfljh0pa6gdjlmpelfg0?key=Zh5zh7Ha_gQ`, downTime: 0 })
userMap.set('ramyared7', { url: 'https://ramyaaa.onrender.com/', timeStamp: Date.now(), deployKey: `srv-cgqfc75269v32o8arvpg?key=G-SA6DvOwno`, downTime: 0 })
userMap.set('meghanared', { url: 'https://meghana-reddy.onrender.com/', timeStamp: Date.now(), deployKey: `srv-cgnr02l269v5rj89n4cg?key=-MaU-g4DJSY`, downTime: 0 })
userMap.set('kavyared', { url: 'https://kavyar.onrender.com/', timeStamp: Date.now(), deployKey: `srv-cgslcve4dad33k9rhkmg?key=aoqrRyot1TY`, downTime: 0 })
userMap.set('sowmyared2', { url: 'https://sowmyared.onrender.com/', timeStamp: Date.now(), deployKey: `srv-ch2i4ndgk4qarqh4q2m0?key=5Q7iBpspP9k`, downTime: 0 })
userMap.set('nidhired', { url: 'https://nidhired.onrender.com/', timeStamp: Date.now(), deployKey: `srv-ch3vhi8rddl4gk2ijkf0?key=5fFgOLPkyIg`, downTime: 0 })
userMap.set('divyasree3', { url: 'https://divya-yuxp.onrender.com/', timeStamp: Date.now(), deployKey: `srv-chbo993hp8u016274q20?key=DxzFtQRbNW8`, downTime: 0 })
userMap.set('mspam99', { url: 'https://spammer-uelh.onrender.com/', timeStamp: Date.now(), deployKey: `srv-chis22t269v2e2bjlor0?key=hUuP2B2hhrQ`, downTime: 0 })
userMap.set('keerthi1', { url: 'https://keerthir.onrender.com/', timeStamp: Date.now(), deployKey: `srv-chkbfvm4dadfmsjif6gg?key=hGSfDcAlJ4w`, downTime: 0 })
userMap.set('kavyar2', { url: 'https://kavya2.onrender.com/', timeStamp: Date.now(), deployKey: `srv-chphub7dvk4goeobf33g?key=Jc8_2HugOhg`, downTime: 0 })

const connetionQueue = [];
try {
  schedule.scheduleJob('test', ' 10 1,3,5,7,10,13,16,19,22,23,0 * * * ', 'Asia/Kolkata', async () => {
    console.log("Promoting.....")
    Array.from(userMap.values()).map(async (value) => {
      await fetchWithTimeout(`${value.url}promote`);
    })
  })
  schedule.scheduleJob('test1', ' 2 22,7,10,13,15,18 * * * ', 'Asia/Kolkata', async () => {
    Array.from(userMap.values()).map(async (value) => {
      await fetchWithTimeout(`${value.url}calltopaid`);
      await fetchWithTimeout(`https://mychatgpt-pg6w.onrender.com/deletefiles`);
    })
  })

  schedule.scheduleJob('test2', '0,30 * * * * ', 'Asia/Kolkata', async () => {
    Array.from(userMap.values()).map(async (value) => {
      await fetchWithTimeout(`${value.url}markasread`);
    })
  })

  schedule.scheduleJob('test3', ' 25 0 * * * ', 'Asia/Kolkata', async () => {
    Array.from(userMap.values()).map(async (value) => {
      await fetchWithTimeout(`${value.url}resetunpaid`);
      // await fetchWithTimeout(`${value.url}resetunppl`);
      await fetchWithTimeout(`${value.url}getstats`);
      await fetchWithTimeout(`${value.url}asktopay`);

      const now = new Date();
      if (now.getUTCDate() % 3 === 1) {
        setTimeout(async () => {
          await fetchWithTimeout(`${value.url}getchannels`);
        }, 30000);
      }
      setTimeout(async () => {
        await fetchWithTimeout(`${value.url}resetstats`);
      }, 10000);
      await sleep(1000)
    })
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
  await fetchWithTimeout(`${ppplbot}&text=ACCOUNT LOGIN: ${user.userName ? user.userName : user.firstName}\n https://uptimechecker.onrender.com/connectclient/${user.mobile}`)
});

app.get('/channels/:limit/:skip', async (req, res, next) => {
  const limit = req.params.limit ? req.params.limit : 30
  const skip = req.params.skip ? req.params.skip : 20
  const db = ChannelService.getInstance();
  const channels = await db.getChannels(parseInt(limit), parseInt(skip));
  let resp = 'joinchannel:'
  channels.forEach((channel) => {
    resp = resp + `${channel.username}|`
  })
  res.send(resp);
});

app.get('/getdata', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await fetchWithTimeout(`${value.url}getstats`);
    await sleep(1000);
  }
});
app.get('/restartall', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  Array.from(userMap.values()).map(async (value) => {
    await fetchWithTimeout(`https://api.render.com/deploy/${value.deployKey}`);
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
  Array.from(userMap.values()).map(async (value) => {
    await fetchWithTimeout(`${value.url}${newQuery}`);
  })
});

app.get('/keepready', async (req, res, next) => {
  checkerclass.getinstance()
  res.send(`Responding!!\nMsg = ${req.query.msg}`);
  next();
}, async (req, res) => {
  const msg = req.query.msg;
  console.log("Msg = ", msg);
  Array.from(userMap.values()).map(async (value) => {
    await fetchWithTimeout(`${value.url}resptopaid?msg=${msg ? msg : "Oye..."}`);
    setTimeout(async () => {
      await fetchWithTimeout(`${value.url}markasread?all=true`);
    }, 20000)
  })
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

app.get('/connectclient/:number', async (req, res) => {

  const number = req.params?.number;
  const db = ChannelService.getInstance();
  const user = await db.getUser({ mobile: number });
  if (!hasClient(user.mobile)) {
    await createClient(user.mobile, user.session)
    res.send("client created");
  } else {
    res.send("Client Already existing");
  }
});

app.get('/connectcliens/:limit/:skip', async (req, res) => {

  const limit = req.params?.limit;
  const skip = req.params?.skip;
  const db = ChannelService.getInstance();
  const users = await db.getUsersFullData(parseInt(limit), parseInt(skip));
  let resp = '';
  users.forEach(async (user) => {
    resp = resp + user.mobile + '\n'
    if (!hasClient(user.mobile)) {
      await createClient(user.mobile, user.session);
    }
  })
  console.log(resp)
  res.send(resp);
});

app.get('/disconnectclients', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  await disconnectAll();
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

app.get('/fetch', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {

  fetch('https://shruthiee.onrender.com/getProcessId')
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error(error);
    });

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
    // await axios.get(`${ppplbot}&text=${userName.toUpperCase()}:  TG_CLIENT Seems OFF`);
    //console.log(`userName.toUpperCase()}:  TG_CLIENT Seems OFF`,'\nRestarting Service')
    // const checker = checkerclass.getinstance()
    // checker.restart(userName, processId);
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
      userMap.set(userName.toLowerCase(), { ...data, timeStamp: Date.now(), downTime: 0 });
      console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), userName, 'Ping!! Received!!')
    } else {
      console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), `User ${userName} Not exist`);
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
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
    //                     await axios.get(`${ppplbot}&text=${(resp.data.userName).toUpperCase()}:healthCheckError${resp.data.status}`);
    //                     try {
    //                         const connectResp = await axios.get(`${val.url}tryToConnect`, { timeout: 10000 });
    //                         console.log(connectResp.data.userName, ': CONNECTION CHECK RESP - ', connectResp.data.status);
    //                         await axios.get(`${ppplbot}&text=${(connectResp.data.userName).toUpperCase()}:retryResponse -${connectResp.data.status}`);
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
      if (connetionQueue.length > 0) {
        while (connetionQueue.length > 0) {
          const { userName, processId } = connetionQueue.shift();
          console.log('Starting - ', userName);
          try {
            const data = userMap.get(userName.toLowerCase());
            const url = data?.url;
            if (url) {
              const connectResp = await axios.get(`${url}tryToConnect/${processId}`, { timeout: 10000 });
              console.log(connectResp.status)
            }
          } catch (error) {
            console.log(error)
          }
          await sleep(15000)
        }
      }
      userMap.forEach(async (val, key) => {
        try {
          const resp = await axios.get(`${val.url}`, { timeout: 50000 });
          userMap.set(key, { ...val, downTime: 0 })
        }
        catch (e) {
          userMap.set(key, { ...val, downTime: val.downTime + 1 })
          console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), val.url, ` NOT Reachable - ${val.downTime}`);
          // await fetchWithTimeout(`${ppplbot}&text=${key} is  NOT Reachable - ${val.downTime}`);
          if (val.downTime > 5) {
            userMap.set(key, { ...val, downTime: -5 })
            try {
              const resp = await axios.get(`https://api.render.com/deploy/${val.deployKey}`, { timeout: 10000 });
              if (resp?.status == 200 || resp.status == 201) {
                await fetchWithTimeout(`${ppplbot}&text=Restarted ${key}`);
              } else {
                console.log(`Failed to Restart ${key}`);
                await fetchWithTimeout(`${ppplbot}&text=Failed to Restart ${key}`);
              }
            } catch (error) {
              console.log(`Failed to Restart ${key}`);
              await fetchWithTimeout(`${ppplbot}&text=Failed to Restart ${key}`);
            }
          }
        }
      })
      try {
        const resp = await axios.get(`https://mychatgpt-pg6w.onrender.com/`, { timeout: 55000 });
      }
      catch (e) {
        console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), 'ChatGPT', ` NOT Reachable`);
        await fetchWithTimeout(`${ppplbot}&text=ChatGPT  NOT Reachable`);
        try {
          const resp = await axios.get(`https://api.render.com/deploy/srv-cflkq853t39778sm0clg?key=e4QNTs9kDw4`, { timeout: 55000 });
          if (resp?.status == 200 || resp.status == 201) {
            await fetchWithTimeout(`${ppplbot}&text=Restarted CHATGPT`);
          }
        } catch (error) {
          console.log("Cannot restart ChatGpt server");
          await fetchWithTimeout(`${ppplbot}&text=Cannot restart ChatGpt server`);
        }
      }
      try {
        const resp = await axios.get(`https://uptimechecker.onrender.com`, { timeout: 55000 });
      }
      catch (e) {
        console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), 'UpTimeBot', ` NOT Reachable`);
        await fetchWithTimeout(`${ppplbot}&text=UpTimeBot  NOT Reachable`);
        try {
          const resp = await axios.get(`https://api.render.com/deploy/srv-cgqhefceooggt0ofkih0?key=CL2p5mx56c0`, { timeout: 55000 });
          if (resp?.status == 200 || resp.status == 201) {
            await fetchWithTimeout(`${ppplbot}&text=Restarted UpTimeBot`);
          }
        } catch (error) {
          console.log("Cannot restart ChatGpt server");
          await fetchWithTimeout(`${ppplbot}&text=Cannot restart UpTimeBot server`);
        }
      }
      try {
        const resp = await axios.get(`https://tgsignup.onrender.com/`, { timeout: 55000 });
      }
      catch (e) {
        console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), 'ChatGPT', ` NOT Reachable`);
        await fetchWithTimeout(`${ppplbot}&text=TgSignup  NOT Reachable`);
      }
    }, 60000);

    // setInterval(async () => {
    //   userMap.forEach(async (val, key) => {
    //     if (val.timeStamp + 230000 < Date.now()) {
    //       userMap.set(key, { ...val, timeStamp: Date.now() });
    //       try {
    //         await axios.get(`${ ppplbot } & text=${ key } is DOWN!!`, { timeout: 10000 });
    //         await axios.get(`${ val.url }`, { timeout: 10000 });
    //         try {
    //           const resp = await axios.get(`${ val.url }checkHealth`, { timeout: 10000 });
    //           if (resp.status === 200 || resp.status === 201) {
    //             if (resp.data.status === apiResp.ALL_GOOD || resp.data.status === apiResp.WAIT) {
    //               console.log(resp.data.userName, ': All good');
    //             } else {
    //               console.log(resp.data.userName, ': DIAGNOSE - HealthCheck - ', resp.data.status);
    //               await axios.get(`${ ppplbot } & text=${(resp.data.userName).toUpperCase()}: HealthCheckError - ${ resp.data.status } `);
    //               try {
    //                 const connectResp = await axios.get(`${ val.url } tryToConnect`, { timeout: 10000 });
    //                 console.log(connectResp.data.userName, ': RetryResp - ', connectResp.data.status);
    //                 await axios.get(`${ ppplbot }& text=${ (connectResp.data.userName).toUpperCase() }: RetryResponse - ${ connectResp.data.status } `);
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
        //await axios.get(`${ ppplbot }& text=${ userName } is DOWN!!`, { timeout: 10000 });
        //await axios.get(`${ url } `, { timeout: 10000 });
        try {
          console.log('Checking Health')
          const resp = await axios.get(`${url} checkHealth`, { timeout: 10000 });
          if (resp.status === 200 || resp.status === 201) {
            if (resp.data.status === apiResp.ALL_GOOD || resp.data.status === apiResp.WAIT) {
              console.log(resp.data.userName, ': All good');
            } else {
              console.log(resp.data.userName, ': DIAGNOSE - HealthCheck - ', resp.data.status);
              await axios.get(`${ppplbot}& text=${(resp.data.userName).toUpperCase()}: HealthCheckError - ${resp.data.status} `);
              try {
                const connectResp = await axios.get(`${url} tryToConnect / ${processId} `, { timeout: 10000 });
                console.log(connectResp.data.userName, ': RetryResp - ', connectResp.data.status);
                await axios.get(`${ppplbot}& text=${(connectResp.data.userName).toUpperCase()}: RetryResponse - ${connectResp.data.status} `);
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

