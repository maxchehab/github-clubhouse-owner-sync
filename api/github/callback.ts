import { NextApiResponse, NextApiRequest } from 'next';
import Axios, { AxiosResponse } from 'axios';

import lambda from '../../common/util/lambda.util';
import { HttpException } from '../../common/exceptions/http.exception';

interface AccessTokenResponse {
  scope: string;
  token_type: string;
  access_token: string;
  error: string;
}

type EmailResponse = Array<{
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: 'private' | null;
}>;

export default lambda(async (req: NextApiRequest, res: NextApiResponse) => {
  const { code } = req.query;

  const accessTokenResponse = (await Axios.post(
    'https://github.com/login/oauth/access_token',
    {
      client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
      client_secret: process.env.GITHUB_OAUTH_SECRET,
      code,
    },
    { headers: { Accept: 'application/json' } },
  )) as AxiosResponse<AccessTokenResponse>;

  const { scope, token_type, access_token, error } = accessTokenResponse.data;

  if (error) {
    throw new HttpException(
      403,
      `GitHub responded with error code '${error}'.`,
    );
  }

  if (!scope.includes('user:email')) {
    throw new HttpException(
      403,
      `Invalid scope. Received '${scope}'. Requires 'user:email'.`,
    );
  }

  if (token_type !== 'bearer') {
    throw new HttpException(
      403,
      `Invalid token type. Received '${token_type}'. Requires 'bearer'.`,
    );
  }

  const emailResponse = (await Axios.get('https://api.github.com/user/emails', {
    params: { access_token },
  })) as AxiosResponse<EmailResponse>;

  const emails = emailResponse.data.map(({ email }) => email);

  res.json(emails);
});
