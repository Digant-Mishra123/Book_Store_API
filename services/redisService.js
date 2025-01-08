const mockRedisService = {
  getAsync: async () => null,
  setAsync: async () => null
};
let redisService = mockRedisService;
if (typeof window === 'undefined') {
  try {
    const Redis = require('ioredis');
    const { promisify } = require('util');
    const redis = new Redis({
      maxRetriesPerRequest: 0,
      retryStrategy: () => null,
      enableOfflineQueue: false,
      lazyConnect: true
    });
    redis.on('error', () => {
      redisService = mockRedisService;
    });

    redisService = {
      getAsync: promisify(redis.get).bind(redis),
      setAsync: promisify(redis.set).bind(redis)
    };
  } catch (error) {
    console.log('Redis not available, using mock service');
  }
}
export default redisService;