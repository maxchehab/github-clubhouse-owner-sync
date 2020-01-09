import axios from 'axios';
import http from 'http';
import listen from 'test-listen';

import * as SessionService from '../../services/fauna/services/session.service';
import * as GithHubMembersService from '../../services/fauna/services/github-members.service';
import * as GitHubService from '../../services/github/github.service';
import closeServer from '../../test/close-server';
import createTestLambda from '../../test/create-test-lambda';
import members from './members';
import GitHubMember from '../../common/interfaces/github-member.interface';

describe('api/github/members', () => {
  let server: http.Server;
  let url: string;

  beforeAll(async () => {
    server = createTestLambda(members);
    url = await listen(server);
  });

  afterAll(async () => {
    await closeServer(server);
  });

  describe('with GET api/github/members', () => {
    let bulkUpsertGitHubMembers: jest.MockInstance<
      Promise<GitHubMember[]>,
      [GitHubMember[]]
    >;

    beforeEach(() => {
      bulkUpsertGitHubMembers = jest
        .spyOn(GithHubMembersService, 'bulkUpsertGitHubMembers')
        .mockImplementationOnce(async members => members);

      jest
        .spyOn(SessionService, 'findSessionByID')
        .mockImplementationOnce(async () => ({
          name: 'John Smith',
          expires_at: new Date().getTime() + 1000,
          token: 'access-token',
          id: 'sess_01DY49R4RBSET4H39RX7JKR0AG',
          avatar: 'https://example.com/avatar.png',
        }));

      jest
        .spyOn(GitHubService, 'getGitHubOrgMembers')
        .mockImplementationOnce(async () => [
          {
            login: 'johnsmith',
            name: 'John Smith',
            avatar_url: 'https://example.com/avatar.png',
          },
          {
            login: 'johnsmith1',
            name: 'John Smith1',
            avatar_url: 'https://example.com/avatar1.png',
          },
        ]);
    });

    it('returns session without token', async () => {
      const { status, data } = await axios.get(url, {
        headers: {
          cookie: 'sid=sess_01DY49R4RBSET4H39RX7JKR0AG',
        },
      });

      expect(bulkUpsertGitHubMembers).toBeCalledTimes(1);
      expect(bulkUpsertGitHubMembers.mock.calls[0][0]).toMatchSnapshot();

      expect(status).toEqual(200);
      expect(data).toMatchSnapshot();
    });
  });
});
