import { NextApiResponse, NextApiRequest } from 'next';

import lambda from '../../common/util/lambda.util';
import { HttpException } from '../../common/exceptions/http.exception';
import {
  getAccessToken,
  getGitHubMember,
} from '../../services/github/github.service';
import { isMemberOfOrg } from '../../services/github/github.service';
import { createSession } from '../../services/fauna/services/session.service';

export default lambda(async (req: NextApiRequest, res: NextApiResponse) => {
  const { code } = req.query;

  const token = await getAccessToken(code as string);

  const member = await getGitHubMember(token);

  const isMember = await isMemberOfOrg(
    token,
    member.login,
    process.env.GITHUB_ORG_ID as string,
  );

  if (!isMember) {
    throw new HttpException(
      403,
      'You are not a member of the allow-listed GitHub organization.',
    );
  }

  const session = await createSession(member.name, token, member.avatar_url);

  res.setHeader('location', '/');
  res.setHeader(
    'set-cookie',
    `sid=${session.id}; HttpOnly; Path=/; Expires=${new Date(
      session.expires_at,
    ).toUTCString()}`,
  );

  return res.status(302).send(null);
});
