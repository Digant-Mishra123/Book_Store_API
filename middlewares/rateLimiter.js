import rateLimit from 'express-rate-limit'; 
export const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.headers['x-user-id'] || 'anonymous',
  handler: (req, res) => {
    res.status(429).json({ error: 'Too many requests, please try again later.' });
  },
});