import  axios from 'axios';
let botCount = 0

export function contains(str, arr) {
  return (arr.some(element => {
      if (str?.includes(element)) {
          return true;
      }
      return false;
  }))
};

export const ppplbot = (chatId, botToken) => {
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

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export function parseError(
  err,
  prefix = 'ShruthieRed',
) {
  let status = 'UNKNOWN';
  let message = 'An unknown error occurred';
  let error = 'UnknownError';

  const extractMessage = (data) => {
    if (Array.isArray(data)) {
      const messages = data.map((item) => extractMessage(item));
      return messages.filter((message) => message !== undefined).join(', ');
    } else if (typeof data === 'string') {
      return data;
    } else if (typeof data === 'object' && data !== null) {
      let resultString = ''
      for (const key in data) {
        const value = data[key]
        if (Array.isArray(data[key]) && data[key].every(item => typeof item === 'string')) {
          resultString = resultString + data[key].join(', ');
        } else {
          const result = extractMessage(value);
          if (result) {
            resultString = resultString + result;
          }
        }
      }
      return resultString
    }
    return JSON.stringify(data);
  };

  if (err.response) {
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
    status = err.status || 'NO_RESPONSE';
    message = err.data?.message ||
      err.data?.errors ||
      err.message ||
      err.statusText ||
      err.data ||
      err.message || 'The request was triggered but no response was received';
    error = err.name || err.code || 'NoResponseError';
  } else if (err.message) {
    status = err.status || 'UNKNOWN';
    message = err.message;
    error = err.name || err.code || 'Error';
  }

  const msg = `${prefix ? `${prefix} ::` : ""} ${extractMessage(message)} `

  const resp = { status, message: msg, error };
  console.log(resp);
  return resp
}
export async function fetchWithTimeout(resource, options = {}, maxRetries = 1) {
  const timeout = options?.timeout || 25000;
  const source = axios.CancelToken.source();
  const id = setTimeout(() => source.cancel(), timeout);

  for (let retryCount = 0; retryCount <= maxRetries; retryCount++) {
    if (retryCount > 0) {
      try {
        await axios.get(`${ppplbot()}&text=${encodeURIComponent(`Retrying: ${resource}`)}`);
        console.log("details :", options, resource); 
      } catch (error) {
        console.log(parseError(error))
      }
    }
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
      } else if (error.response && error.response.status === 403) {
        console.log(error)
        // await fetchWithTimeout(`${ppplbot()}&text=${encodeURIComponent("Glitch DOwn")}`);
        console.log("Asking Replit");
        return await tryWithReplit(resource)
      } else {
        parseError(error, "here ::")
        return undefined;
      }

      if (retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay before retrying
      } else {
        console.error(`All ${maxRetries + 1} retries failed for ${resource}`);
        try {
          await axios.get(`${ppplbot()}&text=${encodeURIComponent(`| Failed | url: ${resource}\n${retryCount + 1}/${maxRetries + 1}\n${parseError(error).message}`)}`)
        } catch (er) {
          console.log(parseError(er))
        }
        return undefined;
      }
    }
  }
}
export async function tryWithReplit(url) {
  const payload = { url: url, method: "GET" }
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(payload),
  };
  try {
    const result = await axios({ ...options, url: "https://execuor-production.up.railway.app/check" });
    console.log("Replit result:", result.status, result.data);
    return result
  } catch (error) {
    console.log(parseError(error))
  }
}
const keys = ['wife', 'adult', 'lanj', 'lesb', 'paid', 'coupl', 'cpl', 'randi', 'bhab', 'boy', 'girl', 'friend', 'frnd', 'boob', 'pussy', 'dating', 'swap', 'gay', 'sex', 'bitch', 'love', 'video', 'service', 'real', 'call', 'desi'];
const pattern = new RegExp(keys.join('|'), 'i');
const notPattern = new RegExp('online|board|class|PROFIT|@wholesale|retail|topper|exam|medico|traini|cms|cma|subject|color|amity|game|gamin|like|earn|popcorn|TANISHUV|bitcoin|crypto|mall|work|folio|health|civil|win|casino|shop|promot|english|fix|money|book|anim|angime|support|cinema|bet|predic|study|youtube|sub|open|trad|cric|exch|movie|search|film|offer|ott|deal|quiz|academ|insti|talkies|screen|series|webser', "i")

export function isMatchingChatEntity(chatEntity) {

  const usernameOrTitleMatch = chatEntity?.username.match(pattern) ||
    chatEntity?.title.match(pattern);

  const excludedPatternMatch = chatEntity?.username.match(notPattern) ||
    chatEntity?.title.match(notPattern);

  const restrictedMessages = chatEntity?.sendMessages || chatEntity?.broadcast || chatEntity?.restricted;

  return usernameOrTitleMatch && !excludedPatternMatch && !restrictedMessages;
}
