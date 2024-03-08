const axios = require('axios');

async function fetchWithTimeout(resource, options = {}, maxRetries = 0) {
  const timeout = options?.timeout || 15000;
  console.log(proxies.length);
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
      } else if (error.response && error.response.status === 403) {
        options = {
          url: resource,
          method: options.method ? options.method : "GET",
          data: options.data
        }
        resource = `https://054ee21e-d619-4708-bbbf-5ff3a6f04d3e-00-3ksn52c08p4vu.janeway.replit.dev/execute`;
        console.log(options, resource);
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

module.exports = { sleep, fetchWithTimeout }