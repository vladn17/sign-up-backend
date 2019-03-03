import Router from 'koa-router';
import jwt from 'koa-jwt';
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { User } from '../entities/User';

const secretKey:string = String(process.env.SECRET_KEY);
const koaJwt = jwt({ secret: secretKey });
const router = new Router();

router.post('/account/registration', async (ctx) => {
  const { username, password, email, firstName, lastName } = ctx.request.body;
  const userRepository = getRepository(User);
  const existedUsername = await userRepository.findOne({ username });
  const existedEmail = await userRepository.findOne({ email });
  if (!existedUsername && !existedEmail) {
    const hash = await bcrypt.hash(password, 8);
    const user = userRepository.create({
      username,
      email,
      password: hash,
      firstname: firstName,
      lastname: lastName,
    });
    const errors = await validate(user);
    if (errors.length > 0) {
      ctx.throw(400, 'Validation error');
    } else {
      await userRepository.save(user);
      ctx.status = 201;
      ctx.body = { status: 'success' };
    }
  } else {
    const message = existedUsername ? 'Username is already taken' : 'This email already exists';
    ctx.throw(400, message);
  }
});

router.post('/account/auth', async (ctx) => {
  const { username, password } = ctx.request.body;
  const userRepository = getRepository(User);
  const user = await userRepository.findOne({ username });
  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = jsonwebtoken.sign({ data: user.id, exp: Math.floor(Date.now() / 1000) + (60 * 10) }, secretKey);
      ctx.body = { token };
    } else {
      ctx.throw(400, 'Incorrect username or password');
    }
  } else {
    ctx.throw(400, 'Incorrect username or password');
  }
});

router.get('/account/', koaJwt, async (ctx) => {
  const userRepository = getRepository(User);
  const user = await userRepository.findOne(ctx.state.data);
  if (user) {
    ctx.body = { data: user };
  } else {
    ctx.throw(400, 'This account does not exist');
  }
});

export { router };
