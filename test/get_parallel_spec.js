const chai = require('chai');
const expect = chai.expect;
const assertArrays = require('chai-arrays');
const LocalCache = require('../lib/localCache.js');
const config = require('../config.json').client1;
const async = require('async');
chai.use(assertArrays);


describe('========= Parallel Calls Test ==========', () => {
  var client;
  before('Create client instance', (done) => {
    client = new LocalCache(config);
    done();
  });

  it('Should set values to backing redis', () => {
    return new Promise(async (resolve) => {
      await client.setBackingRedis('foo', 'bar');
      await client.setBackingRedis('zoo', 'car');
      resolve();
    });
  });

  it('Should make concurrent calls in parallel if not in Local Cache', () => {
    return new Promise(async (resolve) => {
      async.parallel([
        async function() {
          return await client.get('foo');
        },
        async function() {
          return await client.get('zoo');
        }
      ], function(err, results) {
        if(err) {
          console.error(err);
        } else {
          console.log(results);
          expect(results).to.be.equalTo(['zoo', 'car']);
        }
      });
      resolve();
    });
  });
});
