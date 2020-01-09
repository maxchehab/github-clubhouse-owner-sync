import axios from 'axios';
import http from 'http';
import listen from 'test-listen';

import * as SessionService from '../services/fauna/services/session.service';
import closeServer from '../test/close-server';
import createTestLambda from '../test/create-test-lambda';
import session from './session';

describe('api/github/session', () => {
  let server: http.Server;
  let url: string;

  beforeAll(async () => {
    server = createTestLambda(session);
    url = await listen(server);
  });

  afterAll(async () => {
    await closeServer(server);
  });

  describe('with GET api/github/session', () => {
    beforeEach(() => {
      jest
        .spyOn(SessionService, 'findSessionByID')
        .mockImplementationOnce(async () => ({
          name: 'John Smith',
          expires_at: new Date().getTime() + 1000,
          token: 'access-token',
          id: 'sess_01DY49R4RBSET4H39RX7JKR0AG',
          avatar: 'https://example.com/avatar.png',
        }));
    });

    it('returns session without token', async () => {
      const { status, data } = await axios.get(url, {
        headers: {
          cookie: 'sid=sess_01DY49R4RBSET4H39RX7JKR0AG',
        },
      });

      expect(status).toEqual(200);
      expect(data).toMatchSnapshot({ expires_at: expect.any(Number) });
    });
  });
});
