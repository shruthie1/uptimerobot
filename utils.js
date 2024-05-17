const axios = require('axios');
const ppplbot = "https://api.telegram.org/bot6877935636:AAGsHAU-O2B2klPMwDrr0PfkBHXib74K1Nc/sendMessage";
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function parseError(
  err,
  prefix = 'UptimeChecker',
) {
  let status = 'UNKNOWN';
  let message = 'An unknown error occurred';
  let error = 'UnknownError';

  const extractMessage = (data) => {
    console.log(typeof data);
    if (Array.isArray(data)) {
      const messages = data.map((item) => extractMessage(item));
      return messages.filter((message) => message !== undefined).join(', ');
    } else if (typeof data === 'string') {
      return data;
    } else if (typeof data === 'object' && data !== null) {
      for (const key in data) {
        if (
          Array.isArray(data[key]) &&
          data[key].every((item) => typeof item === 'string')
        ) {
          return data[key].join(', ');
        }
      }
    }
    return undefined;
  };

  if (err.response) {
    console.log("Checking in response")
    const response = err.response;
    status =
      response.data?.status ||
      response.status ||
      err.status ||
      'UNKNOWN';
    message =
      response.data?.message ||
      response.data?.errors ||
      response.message ||
      response.statusText ||
      response.data ||
      err.message ||
      'An error occurred';
    error =
      response.data?.error ||
      response.error ||
      err.name ||
      err.code ||
      'Error';
  } else if (err.request) {
    console.log("Checking in request")
    status = err.status || 'NO_RESPONSE';
    message = err.data?.message ||
      err.data?.errors ||
      err.message ||
      err.statusText ||
      err.data ||
      err.message || 'The request was triggered but no response was received';
    error = err.name || err.code || 'NoResponseError';
  } else if (err.message) {
    console.log("Checking in error")
    status = err.status || 'UNKNOWN';
    message = err.message;
    error = err.name || err.code || 'Error';
  }

  const msg = `${prefix ? `${prefix} ::` : ""} ${extractMessage(message)} `

  const resp = { status, message: msg, error };
  console.log(resp);
  return resp
}
async function fetchWithTimeout(resource, options = {}, maxRetries = 0) {
  const timeout = options?.timeout || 20000;

  const source = axios.CancelToken.source();
  const id = setTimeout(() => source.cancel(), timeout);
  for (let retryCount = 0; retryCount <= maxRetries; retryCount++) {
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
      if (retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // 1 second delay
      } else {
        console.error(`All ${maxRetries + 1} retries failed for ${resource}`);
        await fetchWithTimeout(`${ppplbot}&text=${encodeURIComponent(`| Failed | url: ${resource}\n${retryCount + 1}/${maxRetries + 1}\n${parseError(error).message}`)}`)
        return undefined;
      }
    }
  }
}
const keys = ['wife', 'adult', 'lanj', 'lesb', 'paid', 'coupl', 'cpl', 'randi', 'bhab', 'boy', 'girl', 'friend', 'frnd', 'boob', 'pussy', 'dating', 'swap', 'gay', 'sex', 'bitch', 'love', 'video', 'service', 'real', 'call', 'desi'];
const pattern = new RegExp(keys.join('|'), 'i');
const notPattern = new RegExp('online|board|class|PROFIT|@wholesale|retail|topper|exam|medico|traini|cms|cma|subject|color|amity|game|gamin|like|earn|popcorn|TANISHUV|bitcoin|crypto|mall|work|folio|health|civil|win|casino|shop|promot|english|fix|money|book|anim|angime|support|cinema|bet|predic|study|youtube|sub|open|trad|cric|exch|movie|search|film|offer|ott|deal|quiz|academ|insti|talkies|screen|series|webser', "i")

function isMatchingChatEntity(chatEntity) {

  const usernameOrTitleMatch = chatEntity?.username.match(pattern) ||
    chatEntity?.title.match(pattern);

  const excludedPatternMatch = chatEntity?.username.match(notPattern) ||
    chatEntity?.title.match(notPattern);

  const restrictedMessages = chatEntity?.sendMessages || chatEntity?.broadcast || chatEntity?.restricted;

  return usernameOrTitleMatch && !excludedPatternMatch && !restrictedMessages;
}

let pallySleeptime = Date.now();
async function triggerPallyAPi(query, context) {
  if (pallySleeptime < Date.now()) {
    console.log("tring pally")
    pallySleeptime = Date.now() + 120000
    try {
      const body = {
        "analysis": {
          "readResult": {
            "stringIndexType": "TextElements",
            "content": query,
            "pages": [
              {
                "height": 2532,
                "width": 1170,
                "angle": 0,
                "pageNumber": 1,
                "words": [],
                "spans": [
                  {
                    "offset": 0,
                    "length": 319
                  }
                ],
                "lines": []
              }
            ],
            "styles": [
              {
                "isHandwritten": true,
                "spans": [
                  {
                    "offset": 243,
                    "length": 1
                  }
                ],
                "confidence": 0.5
              }
            ],
            "modelVersion": "2022-04-30"
          },
          "descriptionResult": {
            "values": [
              {
                "text": "screenshot of a payment receipt",
                "confidence": 0.9802417755126953
              }
            ]
          },
          "tagsResult": {
            "values": [
              {
                "name": "text",
                "confidence": 0.9999744892120361
              },
              {
                "name": "screenshot",
                "confidence": 0.9944922924041748
              },
              {
                "name": "font",
                "confidence": 0.8888550996780396
              }
            ]
          }
        },
        "context": context
      }
      const options = {
        method: 'POST',
        url: 'https://pallyy.com/api/images/description',
        headers: {
          'content-type': 'application/json'
        },
        data: body
      };
      const response = await axios.request(options);
      const chatResponse = response?.data[0];
      console.log("PALLY Response:", response?.data[0])
      return chatResponse;
    } catch (error) {
      const err = parseError(error, 'Pally Error');
      if (err.status == '429' || err.status == 429) {
        const sleeptime = getNumber(err.message);
        console.log('PAlly sleepTime :', sleeptime);
        pallySleeptime = Date.now() + (1000 * sleeptime);
      }
      return '0'
    }
  } else {
    console.log("Pally sleeping for :", Math.floor((pallySleeptime - Date.now()) / 1000));
    return '0'
  }
}


module.exports = { sleep, fetchWithTimeout, isMatchingChatEntity, triggerPallyAPi }