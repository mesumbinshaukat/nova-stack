import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Application } from 'express';
import { User } from './models/User';

export default function mountAdmin(app: Application) {
  const adminJs = new AdminJS({
    resources: [
      { resource: User, options: { parent: { name: 'Users' } } },
      // You can add other models here later
    ],
    rootPath: '/admin',
  });

  const ADMIN = {
    email: 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'changeme',
  };

  const router = AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      authenticate: async (email, password) => {
        if (email === ADMIN.email && password === ADMIN.password) {
          return ADMIN;
        }
        return null;
      },
      cookiePassword: process.env.COOKIE_SECRET || 'cookie-secret',
    },
    null,
    {
      resave: false,
      saveUninitialized: true,
      name: 'admin-session',
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      },
    }
  );

  app.use(adminJs.options.rootPath, router);
} 