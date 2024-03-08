const axios = require('axios');
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithTimeout(resource, options = {}, maxRetries = 1) {
  const timeout = options?.timeout || 15000;
  const source = axios.CancelToken.source();
  const id = setTimeout(() => source.cancel(), timeout);

  for (let retryCount = 0; retryCount <= maxRetries; retryCount++) {
    if (retryCount > 0) {
      await fetchWithTimeout(`${ppplbot()}&text=${encodeURIComponent("Retrying")}`);
      console.log("details :", options, resource);
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
        await fetchWithTimeout(`${ppplbot()}&text=${encodeURIComponent("Glitch DOwn")}`);
        return await tryWithReplit(resource)
      } else {
        console.error('Error:', error.message);
        return undefined;
      }

      if (retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay before retrying
      } else {
        console.error(`All ${maxRetries + 1} retries failed for ${resource}`);
        return undefined;
      }
    }
  }
}


async function tryWithReplit(url) {
  const payload = { url: url, method: "GET" }
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(payload),
  };
  try {
    const result = await axios({ ...options, url: "https://054ee21e-d619-4708-bbbf-5ff3a6f04d3e-00-3ksn52c08p4vu.janeway.replit.dev/check" });
    console.log("Replit result:", result.status, result.data);
    return result.data
  } catch (error) {
    console.log(error)
  }
}
module.exports = { sleep, fetchWithTimeout }