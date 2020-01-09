import { NextApiResponse, NextApiRequest } from 'next';

import lambda from '../../common/util/lambda.util';

export default lambda(async (_req: NextApiRequest, res: NextApiResponse) => {
  res
    .status(302)
    .setHeader(
      'location',
      `https://github.com/login/oauth/authorize?scope=read:org&client_id=${process.env.GITHUB_OAUTH_CLIENT_ID}`,
    );

  return res.send(null);
});
