import axios from 'axios';
import http from 'http';
import listen from 'test-listen';

import { HttpException } from '../../common/exceptions/http.exception';
import * as GitHubService from '../../services/github/github.service';
import callback from './callback';
import closeServer from '../../test/close-server';
import createTestLambda from '../../test/create-test-lambda';

describe('api/github/callback', () => {
  let server: http.Server;
  let url: string;

  beforeAll(async () => {
    server = createTestLambda(callback);
    url = await listen(server);
  });

  afterAll(async () => {
    await closeServer(server);
  });

  describe('with GET api/github/callback', () => {
    describe('with valid user', () => {
      it('creates a session', () => {});
    });

    describe('with invalid user', () => {
      describe('with an error from GitHub during authentication', () => {
        beforeEach(() => {
          jest
            .spyOn(GitHubService, 'getAccessToken')
            .mockImplementationOnce(() => {
              throw new HttpException(
                500,
                `GitHub responded with error code 'bad_verification_code'.`,
              );
            });
        });

        it('returns a 500', async () => {
          const { status, data } = await axios.get(url, {
            validateStatus: () => true,
          });

          expect(status).toEqual(500);
          expect(data).toMatchSnapshot();
        });
      });

      describe('with no read:org scope', () => {
        beforeEach(() => {
          jest
            .spyOn(GitHubService, 'getAccessToken')
            .mockImplementationOnce(() => {
              throw new HttpException(
                400,
                `Invalid scope. Received 'undefined'. Requires 'read:org'.`,
              );
            });
        });

        it('returns a 400', async () => {
          const { status, data } = await axios.get(url, {
            validateStatus: () => true,
          });

          expect(status).toEqual(400);
          expect(data).toMatchSnapshot();
        });
      });

      describe('with token_type other than bearer', () => {
        beforeEach(() => {
          jest
            .spyOn(GitHubService, 'getAccessToken')
            .mockImplementationOnce(() => {
              throw new HttpException(
                400,
                `Invalid token type. Received 'undefined'. Requires 'bearer'.`,
              );
            });
        });

        it('returns a 400', async () => {
          const { status, data } = await axios.get(url, {
            validateStatus: () => true,
          });

          expect(status).toEqual(400);
          expect(data).toMatchSnapshot();
        });
      });

      describe('with user not a member of the allow-listed org', () => {
        beforeEach(() => {
          jest
            .spyOn(GitHubService, 'getAccessToken')
            .mockImplementationOnce(async () => 'access-token');

          jest
            .spyOn(GitHubService, 'isMemberOfOrg')
            .mockImplementationOnce(async () => false);
        });

        it('returns a 403', async () => {
          const { status, data } = await axios.get(url, {
            validateStatus: () => true,
          });

          expect(status).toEqual(403);
          expect(data).toMatchSnapshot();
        });
      });
    });
  });
});
