const { v4: uuidv4 } = require('uuid');

module.exports = () => {
  return uuidv4().slice(0, 6);
};
