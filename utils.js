const axios = require('axios');
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
        return undefined;
      }
    }
  }
}

module.exports = { sleep, fetchWithTimeout }