const chai = require('chai');
const expect = chai.expect;
const assertArrays = require('chai-arrays');
const LocalCache = require('../lib/localCache.js');
const config = require('../config.json').client1;
const async = require('async');
chai.use(assertArrays);


describe('========= Series Calls Test ==========', () => {
  var client1;
  var client2;
  before('Create client instance', (done) => {
    client1 = new LocalCache(config);
    client2 = new LocalCache(config);
    done();
  });

  it('Should set values to backing redis', () => {
    return new Promise(async (resolve) => {
      await client1.setBackingRedis('foo', 'bar');
      await client2.setBackingRedis('zoo', 'car');
      resolve();
    });
  });

  it('Should make concurrent calls in series if not in Local Cache', () => {
    return new Promise(async (resolve) => {
      async.series([
        async function() {
          return await client1.get('foo');
        },
        async function() {
          return await client2.get('zoo');
        }
      ], function(err, results) {
        if(err) {
          console.error(err);
        } else {
          console.log(results);
          expect(results).to.be.equalTo(['bar', 'car']);
        }
      });
      resolve();
    });
  });
});
