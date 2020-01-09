import { NextApiResponse, NextApiRequest } from 'next';
import withSession from '../../common/util/with-session.util';

import {
  bulkUpsertGitHubMembers,
  updateGitHubMember,
} from '../../services/fauna/services/github-members.service';
import { getGitHubOrgMembers } from '../../services/github/github.service';
import { HttpException } from '../../common/exceptions/http.exception';
import GitHubMember from '../../common/interfaces/github-member.interface';
import lambda from '../../common/util/lambda.util';
import Session from '../../common/interfaces/session.interface';

export default lambda(
  withSession(
    async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
      if (req.method === 'GET') {
        const members: GitHubMember[] = (
          await getGitHubOrgMembers(
            session.token,
            process.env.GITHUB_ORG_ID as string,
          )
        ).map(({ login, avatar_url }) => ({
          id: login,
          avatar: avatar_url,
        }));

        const syncedMembers = await bulkUpsertGitHubMembers(members);

        return res.json(syncedMembers);
      } else if (req.method === 'PATCH') {
        const member = await updateGitHubMember(req.body as GitHubMember);
        return res.json(member);
      }

      throw new HttpException(404, 'Not found');
    },
  ),
);
