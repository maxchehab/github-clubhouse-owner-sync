import axios from 'axios';
import http from 'http';
import listen from 'test-listen';

import * as SessionService from '../services/fauna/services/session.service';
import closeServer from '../test/close-server';
import createTestLambda from '../test/create-test-lambda';
import logout from './logout';

describe('api/logout', () => {
  let server: http.Server;
  let url: string;

  beforeAll(async () => {
    server = createTestLambda(logout);
    url = await listen(server);
  });

  afterAll(async () => {
    await closeServer(server);
  });

  describe('with GET api/logout', () => {
    let deleteSessionByID: jest.MockInstance<Promise<any>, [string]>;

    beforeEach(() => {
      deleteSessionByID = jest
        .spyOn(SessionService, 'deleteSessionByID')
        .mockImplementationOnce(async () => null);

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

    it('deletes session', async () => {
      const { status, headers } = await axios.get(url, {
        headers: {
          cookie: 'sid=sess_01DY49R4RBSET4H39RX7JKR0AG',
        },
        validateStatus: () => true,
        maxRedirects: 0,
      });

      expect(deleteSessionByID).toBeCalledTimes(1);
      expect(status).toEqual(302);
      expect(headers.location).toEqual('/login');
      expect(headers['set-cookie']).toMatchSnapshot();
    });
  });
});
