const redis = require('redis');
const Promise = require('bluebird');
const CreateNode = require('./createNode.js');
const config = require('../config.json');
Promise.promisifyAll(redis.RedisClient.prototype);

function redisInit(port, host) {
  console.log('PORT AND HOST', port, host);
  const client = redis.createClient(port, host);
  client.on('error', (err) => {
    console.error('Error ----->', err);
  });
  client.on('ready', (err) => {
    console.log('Backing Redis connected :) !!');
  });
  return client;
}

class LocalCache {
  constructor(config) {
    this.capacity = config.capacity || '5';
    this.expiry = config.expiry;
    this.size = 0;
    this.map = {};
    this.head = null;
    this.tail = null;
    this.backingRedis = redisInit(config.redisPort, config.redisHost);
  }

  _setHead(node) {
    node.next = this.head;
    node.prev = null;
    if(this.head !== null) {
      this.head.prev = node;
    }
    this.head = node;
    if(this.tail === null) {
      this.tail = node;
    }
    this.size++;
    this.map[node.key] = node;
  }

  _remove(key) {
    var node = this.map[key];
    if(node.prev !== null) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }
    if(node.next !== null) {
      node.next.prev = node.next;
    } else {
      this.tail = node.prev;
    }
    delete this.map[key];
    this.size--;
  }

  setLocalCache(key, value) {
    const node = new CreateNode(key, value);

    if(this.map[key]) {
      this.map[key].value = node.value;
      this._remove(node.key);
    } else {
      if(this.size >= this.capacity) {
        delete this.map[this.tail.key];
        console.log(`Key ${key} has been evicted`);
        this.size--;
        this.tail = this.tail.prev;
        this.tail.next = null;
      }
    }
    this._setHead(node);
  }

  async setBackingRedis(key, value) {
    await this.backingRedis.setAsync(key, value);
    console.log(`Key ${key} Inserted in Redis`);
  }

  async get(key) {
    let value;
    if(this.map[key]) {
      console.log(`Key ${key} Found in Local Cache ------>`);
      if(((new Date()).getTime() - this.map[key].time) <= this.expiry ) {
        value = this.map[key].value;
        var node = new CreateNode(key, value);
        return value;
      } else {
        console.log(`${key} Expired`);
        this._remove(key);
        return null;
      }
    } else {
      console.log('Key does not exist in local cache! Checking Redis ------>');
      value = await this.backingRedis.getAsync(key);
      if(value) {
        console.log('Found in Backing Redis');
        this.setLocalCache(key, value);
        console.log(`Key ${key} has been added`);
        return value;
      } else {
        console.log('Value not in LocalCache or Backing Redis!!!');
        return null;
      }
    }
  }

  async deleteAllRedisKeys() {
    await this.backingRedis.flushallAsync();
  }
}

module.exports = LocalCache;
