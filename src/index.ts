import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import helmet from 'koa-helmet';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { router } from './routes';
import dotenv from 'dotenv';

dotenv.config();
createConnection().then(() => {
  const app = new Koa();
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      ctx.status = error.statusCode;
      ctx.body = { error: error.message };
    }
  });
  app.use(cors());
  app.use(helmet());
  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.allowedMethods());
  app.listen(process.env.PORT);
  console.log('App is running');
}).catch(error => console.log(`TypeORM connection error: + ${error}`));
