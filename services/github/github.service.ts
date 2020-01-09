import Axios, { AxiosResponse } from 'axios';

import { HttpException } from '../../common/exceptions/http.exception';

interface AccessTokenResponse {
  scope: string;
  token_type: string;
  access_token: string;
  error: string;
}

interface GitHubMember {
  name: string;
  login: string;
}

export async function isMemberOfOrg(
  token: string,
  login: string,
  orgID: string,
): Promise<boolean> {
  const { status } = await Axios.get(
    `https://api.github.com/orgs/${orgID}/members/${login}`,
    {
      params: { access_token: token },
      validateStatus: () => true,
    },
  );

  return status === 204;
}

export async function getGitHubMember(token: string): Promise<GitHubMember> {
  const { data } = (await Axios.get('https://api.github.com/user', {
    params: { access_token: token },
  })) as AxiosResponse<GitHubMember>;

  return data;
}

export async function getAccessToken(code: string): Promise<string> {
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
      500,
      `GitHub responded with error code '${error}'.`,
    );
  }

  if (!scope.includes('read:org')) {
    throw new HttpException(
      400,
      `Invalid scope. Received '${scope}'. Requires 'read:org'.`,
    );
  }

  if (token_type !== 'bearer') {
    throw new HttpException(
      400,
      `Invalid token type. Received '${token_type}'. Requires 'bearer'.`,
    );
  }

  return access_token;
}
