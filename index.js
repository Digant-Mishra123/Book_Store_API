import express from 'express';
import { rateLimiter } from './middlewares/rateLimiter.js';
import bookRoutes from './routes/bookRoutes.js';
const app = express();
const port = 3000;
app.use(express.json());
app.use(rateLimiter);
app.use(express.static('public'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-user-id, x-role');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETEs');
  next();
});
app.use('/books', bookRoutes);
app.listen(port, () => {
  console.log(`Book Store API running at http://localhost:${port}`);
});

export default app;