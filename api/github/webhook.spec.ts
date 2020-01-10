import axios from 'axios';
import http from 'http';
import listen from 'test-listen';

import * as ClubhouseService from '../../services/clubhouse/clubhouse.service';
import * as GitHubMembersService from '../../services/fauna/services/github-members.service';
import closeServer from '../../test/close-server';
import ClubhouseMember from '../../common/interfaces/clubhouse-member.interface';
import createTestLambda from '../../test/create-test-lambda';
import generateHMAC from '../../common/util/generate-hmac.util';
import INVALID_BRANCH_EVENT from '../../test/fixtures/github/invalid-clubhouse-branch.json';
import VALID_BRANCH_EVENT from '../../test/fixtures/github/valid-clubhouse-branch.json';
import webhook from './webhook';

describe('api/github/webhook', () => {
  let server: http.Server;
  let url: string;

  beforeAll(async () => {
    server = createTestLambda(webhook);
    url = await listen(server);
  });

  afterAll(async () => {
    await closeServer(server);
  });

  const SECRET = process.env.GITHUB_ORG_HOOK_SECRET as string;

  describe('with POST api/github/webhook', () => {
    describe('with invalid story ID', () => {
      it('returns invalid story id message', async () => {
        const hmac = generateHMAC(JSON.stringify(INVALID_BRANCH_EVENT), SECRET);

        const { status, data } = await axios.post(url, INVALID_BRANCH_EVENT, {
          headers: {
            'X-Hub-Signature': `sha1=${hmac}`,
          },
        });

        expect(status).toEqual(200);
        expect(data).toMatchSnapshot();
      });
    });

    describe('with invalid GitHub member', () => {
      beforeEach(() => {
        jest
          .spyOn(GitHubMembersService, 'findGitHubMemberByID')
          .mockImplementationOnce(async () => null);
      });

      it('returns invalid GitHub member message', async () => {
        const hmac = generateHMAC(JSON.stringify(VALID_BRANCH_EVENT), SECRET);

        const { status, data } = await axios.post(url, VALID_BRANCH_EVENT, {
          headers: {
            'X-Hub-Signature': `sha1=${hmac}`,
          },
        });

        expect(status).toEqual(200);
        expect(data).toMatchSnapshot();
      });
    });

    describe('with unlinked Clubhouse account', () => {
      beforeEach(() => {
        jest
          .spyOn(GitHubMembersService, 'findGitHubMemberByID')
          .mockImplementationOnce(async () => ({
            id: 'johnsmith',
            avatar: 'https://example.com/avatar.png',
          }));
      });

      it('returns unlinked Clubhouse account message', async () => {
        const hmac = generateHMAC(JSON.stringify(VALID_BRANCH_EVENT), SECRET);

        const { status, data } = await axios.post(url, VALID_BRANCH_EVENT, {
          headers: {
            'X-Hub-Signature': `sha1=${hmac}`,
          },
        });

        expect(status).toEqual(200);
        expect(data).toMatchSnapshot();
      });
    });

    describe('with valid story and GitHub member', () => {
      let updateClubhouseStoryOwner: jest.MockInstance<
        Promise<any>,
        [string, ClubhouseMember, string]
      >;

      beforeEach(() => {
        jest
          .spyOn(GitHubMembersService, 'findGitHubMemberByID')
          .mockImplementationOnce(async () => ({
            id: 'johnsmith',
            avatar: 'https://example.com/avatar.png',
            clubhouseMember: {
              id: '123',
              name: 'John Smith',
            },
          }));

        updateClubhouseStoryOwner = jest
          .spyOn(ClubhouseService, 'updateClubhouseStoryOwner')
          .mockImplementationOnce(async () => null);
      });

      it(`updates story's owner`, async () => {
        const hmac = generateHMAC(JSON.stringify(VALID_BRANCH_EVENT), SECRET);

        const { status, data } = await axios.post(url, VALID_BRANCH_EVENT, {
          headers: {
            'X-Hub-Signature': `sha1=${hmac}`,
          },
        });

        expect(updateClubhouseStoryOwner).toBeCalledTimes(1);
        expect(updateClubhouseStoryOwner.mock.calls[0]).toMatchSnapshot();

        expect(status).toEqual(200);
        expect(data).toMatchSnapshot();
      });
    });
  });
});
