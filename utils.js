const axios = require('axios');
const ppplbot = "https://api.telegram.org/bot6877935636:AAGsHAU-O2B2klPMwDrr0PfkBHXib74K1Nc/sendMessage";
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function parseError(
  err,
  prefix = 'UptimeChecker',
) {
  const status =
    err.response?.data?.status || err.response?.status || err.status;
  const message =
    err.response?.data?.message ||
    err.response?.message ||
    err.response?.statusText ||
    err.message ||
    err.response?.data;
  const error = err.response?.data?.error || err.response?.error || err.name;
  const msg = prefix
    ? `${prefix}::${message}` : message;
  return { status, message: msg, error };
}
async function fetchWithTimeout(url, config = {}, sendErr = true, maxRetries = 1) {
  const timeout = config?.timeout || 10000;

  for (let retryCount = 0; retryCount <= maxRetries; retryCount++) {
      try {
          const response = await axios({
              url,
              ...config,
              timeout,
          });
          return response;
      } catch (error) {
          if (sendErr) {
              console.log(`Error (${retryCount + 1}/${maxRetries + 1}): ${error} - ${url}`);
              if (error.code !== "ECONNABORTED" && !axios.isCancel(error)) {
                  await fetchWithTimeout(`https://uptimechecker.onrender.com/sendtochannel?chatId=-1001823103248&msg=${encodeURIComponent(`VideoCall: Failed | url: ${url}\n${retryCount + 1}/${maxRetries + 1}\nMethod:${config.method || "get"}\n${parseError(error).message}\nCode:${error.code}`)}`)
              }
          }

          if (retryCount < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
          } else {
              console.error(`All ${maxRetries + 1} retries failed for ${url}`);
              if (error.code !== "ECONNABORTED" && !axios.isCancel(error)) {
                  await fetchWithTimeout(`https://uptimechecker.onrender.com/sendtochannel?chatId=-1001823103248&msg=${encodeURIComponent(`All ${maxRetries + 1} retries failed for ${url}\n${parseError(error).message}\nCode:${error.code}`)}`)
              }
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


module.exports = { sleep, fetchWithTimeout, isMatchingChatEntity }