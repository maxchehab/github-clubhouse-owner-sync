import axios from 'axios';
import http from 'http';
import listen from 'test-listen';

import closeServer from '../../test/close-server';
import createTestLambda from '../../test/create-test-lambda';
import login from './login';

describe('api/github/login', () => {
  let server: http.Server;
  let url: string;

  beforeAll(async () => {
    server = createTestLambda(login);
    url = await listen(server);
  });

  afterAll(async () => {
    await closeServer(server);
  });

  describe('with GET api/github/login', () => {
    it('returns 302, redirect to GitHub', async () => {
      const { status, headers } = await axios.get(url, {
        maxRedirects: 0,
        validateStatus: () => true,
      });

      expect(status).toEqual(302);
      expect(headers.location).toMatchSnapshot();
    });
  });
});
