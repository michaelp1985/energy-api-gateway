import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';
import { AppModule } from './src/app.module';
import * as firebaseAdmin from 'firebase-admin';
import * as cors from 'cors';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const grecaptcha = require('grecaptcha');

firebaseAdmin.initializeApp();
const app = express();

async function appCheckVerification(req, res) {
  const token = req.header('x-firebase-appcheck');

  if (!token) {
    console.log('No token provided');
    res.status(401);
    return false;
  }

  console.log('verify token');
  try {
    const client = new grecaptcha(process.env.RECAPTCHAKEY);

    if (await client.verify(token)) {
      console.log('Token verified');
      return true;
    } else {
      console.log('No claims provided');
      return false;
    }
  } catch (err) {
    console.log('Error verifying token', err);
    return false;
  }
}

const createFunction = async (expressInstance): Promise<void> => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  await app.init();
};

export const api = functions
  .runWith({
    secrets: ['RECAPTCHAKEY', 'ENERGYAPIKEY'],
    maxInstances: 5,
  })
  .https.onRequest(async (request, response) => {
    cors({ origin: true, allowedHeaders: ['x-firebase-appcheck'] })(
      request,
      response,
      async () => {
        await createFunction(app);
        if (
          !process.env.LOCALENVIRONMENT ||
          process.env.LOCALENVIRONMENT != 'dev'
        ) {
          const isValidRequest = await appCheckVerification(request, response);
          if (!isValidRequest) {
            return response.status(401).send('Unauthorized');
          }
        }

        return await handleRequest(request, response);
      },
    );
  });

async function handleRequest(request, response) {
  return app(request, response);
}
