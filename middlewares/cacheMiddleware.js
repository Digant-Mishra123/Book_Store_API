import redisService from '../services/redisService.js';
const { getAsync, setAsync } = redisService;
export const cacheMiddleware = async (req, res, next) => {
  try {
    const cacheKey = req.originalUrl; 
    const cachedData = await getAsync(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData)); 
    }
    res.sendResponse = res.json; 
    res.json = async (data) => {
      await setAsync(cacheKey, JSON.stringify(data), 'EX', 60); 
      res.sendResponse(data); 
    };
  } catch (error) {
    console.log('Cache error, skipping cache');
  }
  next();
};