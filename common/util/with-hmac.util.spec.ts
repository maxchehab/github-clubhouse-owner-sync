import axios from 'axios';
import http from 'http';
import listen from 'test-listen';

import closeServer from '../../test/close-server';
import createTestLambda from '../../test/create-test-lambda';
import generateHMAC from './generate-hmac.util';
import lambda from './lambda.util';
import withHMAC, { SigParser } from './with-hmac.util';

const parser: SigParser = ({ headers }, err) => {
  const sig = headers['x-hmac'] as string;

  if (!sig) {
    err();
  }

  return sig.substring('sha1='.length);
};

describe('withHMAC', () => {
  describe('with invalid HMAC header', () => {
    let server: http.Server;
    let url: string;

    beforeAll(async () => {
      server = createTestLambda(
        lambda(
          withHMAC('secret', parser, async (_req, res) => {
            res.status(200).send(null);
          }),
        ),
      );
      url = await listen(server);
    });

    afterAll(async () => {
      await closeServer(server);
    });

    it('returns 403', async () => {
      const body = { hello: 'world' };

      const { status, data } = await axios.post(url, body, {
        headers: { 'X-HMAC': 'sha1=invalid hmac' },
        validateStatus: () => true,
      });

      expect(status).toEqual(403);
      expect(data).toEqual({ message: 'Invalid HMAC' });
    });
  });

  describe('with valid HMAC header', () => {
    let server: http.Server;
    let url: string;

    beforeAll(async () => {
      server = createTestLambda(
        lambda(
          withHMAC('secret', parser, async (_req, res) => {
            res.status(200).send(null);
          }),
        ),
      );
      url = await listen(server);
    });

    afterAll(async () => {
      await closeServer(server);
    });

    it('returns 200', async () => {
      const data = { hello: 'world' };
      const hmac = generateHMAC(JSON.stringify(data), 'secret');

      const { status } = await axios.post(url, data, {
        headers: {
          'X-HMAC': `sha1=${hmac}`,
        },
      });

      expect(status).toEqual(200);
    });
  });
});
