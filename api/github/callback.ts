import { NextApiResponse, NextApiRequest } from 'next';

import lambda from '../../common/util/lambda.util';
import { HttpException } from '../../common/exceptions/http.exception';
import { getAccessToken } from '../../services/github/github.service';
import { isMemberOfOrg } from '../../services/github/github.service';

export default lambda(async (req: NextApiRequest, res: NextApiResponse) => {
  const { code } = req.query;

  const token = await getAccessToken(code as string);

  const isMember = await isMemberOfOrg(
    token,
    process.env.GITHUB_ORG_ID as string,
  );

  if (!isMember) {
    throw new HttpException(
      403,
      'You are not a member of the allow-listed GitHub organization.',
    );
  }

  res.json({ success: true });
});
