
const axios = require('axios');

const logAPI = async (stack, level, pkg, message) => {
  try {
    await axios.post('http://20.244.56.144/evaluation-service/logs', {
      stack,
      level,
      package: pkg,
      message
    });
  } catch (err) {
   
    console.error("Logging failed:", err.message);
  }
};

module.exports = logAPI;
