import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import phpInstance from '@nova/wasm-engine/phpRunner';
import { jwtAuth } from './middleware/jwtAuth';
import { errorHandler } from './middleware/errorHandler';
import mountAdmin from './admin';

const app = express();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(csurf({ cookie: true }));

// Routes
app.get('/api/ping', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/api/php-test', async (req: Request, res: Response) => {
  try {
    const result = await phpInstance.exports.php_run('test.php', {
      GET: {},
      SERVER: {
        REQUEST_URI: '/api/php-test',
        REQUEST_METHOD: 'GET'
      }
    });
    res.send(result.html);
  } catch (error) {
    next(error);
  }
});

app.get('/api/protected', jwtAuth, (req: Request, res: Response) => {
  res.json({ message: 'You have access', user: req.user });
});

// Global error handler
app.use(errorHandler);

// Mount admin panel
mountAdmin(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 