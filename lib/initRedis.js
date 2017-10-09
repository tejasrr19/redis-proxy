const redis = require('redis');
const Promise = require('bluebird');

Promise.promisifyAll(redis.RedisClient.prototype);

module.exports = function(port, host) {
  console.log('PORT AND HOST', port, host);
  const client = redis.createClient(port, host);
  client.on('error', (err) => {
    console.error('Error ----->', err);
  });
  client.on('ready', (err) => {
    console.log('Backing Redis connected :) !!');
  });
  return client;
};
