import axios from 'axios';
import http from 'http';
import listen from 'test-listen';

import * as SessionService from '../../services/fauna/services/session.service';
import closeServer from '../../test/close-server';
import createTestLambda from '../../test/create-test-lambda';
import lambda from './lambda.util';
import withSession from './with-session.util';

describe('withSession', () => {
  describe('with invalid session', () => {
    let server: http.Server;
    let url: string;

    beforeAll(async () => {
      server = createTestLambda(
        lambda(
          withSession(async (_req, res) => {
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
      const { status, data } = await axios.get(url, {
        validateStatus: () => true,
      });

      expect(status).toEqual(403);
      expect(data).toEqual({ message: 'Invalid session' });
    });
  });

  describe('with valid session', () => {
    let server: http.Server;
    let url: string;

    beforeAll(async () => {
      server = createTestLambda(
        lambda(
          withSession(async (_req, res) => {
            res.status(200).send(null);
          }),
        ),
      );

      url = await listen(server);
    });

    beforeEach(() => {
      jest
        .spyOn(SessionService, 'findSessionByID')
        .mockImplementationOnce(async () => ({
          name: 'John Smith',
          expires_at: new Date().getTime() + 1000,
          token: 'access-token',
          id: 'sess_01DY49R4RBSET4H39RX7JKR0AG',
        }));
    });

    afterAll(async () => {
      await closeServer(server);
    });

    it('returns 200', async () => {
      const { status } = await axios.get(url, {
        headers: {
          cookie: 'sid=sess_01DY49R4RBSET4H39RX7JKR0AG',
        },
      });

      expect(status).toEqual(200);
    });
  });
});
