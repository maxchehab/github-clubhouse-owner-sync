import { NextApiResponse, NextApiRequest } from 'next';
import withSession from '../../common/util/with-session.util';

import { bulkUpsertGitHubMembers } from '../../services/fauna/services/github-members.service';
import { getGitHubOrgMembers } from '../../services/github/github.service';
import GitHubMember from '../../common/interfaces/github-member.interface';
import lambda from '../../common/util/lambda.util';
import Session from '../../common/interfaces/session.interface';

export default lambda(
  withSession(
    async (_req: NextApiRequest, res: NextApiResponse, session: Session) => {
      const members: GitHubMember[] = (
        await getGitHubOrgMembers(
          session.token,
          process.env.GITHUB_ORG_ID as string,
        )
      ).map(({ login, avatar_url }) => ({
        id: login,
        avatar: avatar_url,
      }));

      await bulkUpsertGitHubMembers(members);

      return res.json(members);
    },
  ),
);
