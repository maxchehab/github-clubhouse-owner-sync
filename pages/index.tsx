import { Component } from 'react';
import { NextPageContext, NextApiRequest } from 'next';
import { Pane } from 'evergreen-ui';
import { parseCookies } from 'nookies';
import axios, { AxiosError } from 'axios';
import fetch from 'isomorphic-unfetch';

import Avatar from '../components/avatar';
import ClubhouseMember from '../common/interfaces/clubhouse-member.interface';
import GitHubMember from '../common/interfaces/github-member.interface';
import MemberTable from '../components/member-table';
import Session from '../common/interfaces/session.interface';
import { ServerRequest } from 'http';

interface Props {
  clubhouseMembers: ClubhouseMember[];
  gitHubMembers: GitHubMember[];
  session: Session;
}

function getBaseURL({ headers }: ServerRequest): string {
  const proto = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = headers['x-forwarded-host'];

  return `${proto}://${host}`;
}

export default class extends Component<Props> {
  static async getInitialProps(ctx: NextPageContext) {
    if (ctx.res) {
      const baseURL = getBaseURL(ctx.req);
      const { sid } = parseCookies(ctx);

      if (!sid) {
        ctx.res.writeHead(302, {
          Location: '/login',
        });
        ctx.res.end();
      }

      try {
        const sessionResponse = await fetch(`${baseURL}/api/session`, {
          credentials: 'include',
          headers: {
            cookie: ctx.req.headers.cookie as string,
          },
        });

        const gitHubMembers = await fetch(`${baseURL}/api/github/members`, {
          credentials: 'include',
          headers: {
            cookie: ctx.req.headers.cookie as string,
          },
        });

        const clubhouseMembers = await fetch(
          `${baseURL}/api/clubhouse/members`,
          {
            credentials: 'include',
            headers: {
              cookie: ctx.req.headers.cookie as string,
            },
          },
        );

        return {
          session: await sessionResponse.json(),
          gitHubMembers: await gitHubMembers.json(),
          clubhouseMembers: await clubhouseMembers.json(),
        };
      } catch (error) {
        console.error(error);

        ctx.res.writeHead(302, {
          Location: '/login',
        });
        ctx.res.end();
      }
    }
  }

  render() {
    const { session, gitHubMembers, clubhouseMembers } = this.props;

    return (
      <Pane
        alignItems={'center'}
        display={'flex'}
        height={'100vh'}
        width={'100vw'}
        flexDirection={'column'}
      >
        <Pane
          alignItems={'center'}
          display={'flex'}
          height={80}
          justifyContent={'end'}
          padding={20}
          width={'100%'}
        >
          <Avatar avatar={session.avatar} name={session.name} />
        </Pane>

        <MemberTable
          gitHubMembers={gitHubMembers}
          clubhouseMembers={clubhouseMembers}
        />
      </Pane>
    );
  }
}
