import { Component } from 'react';
import { NextPageContext } from 'next';
import { Pane } from 'evergreen-ui';
import { parseCookies } from 'nookies';
import axios from 'axios';

import Avatar from '../components/avatar';
import ClubhouseMember from '../common/interfaces/clubhouse-member.interface';
import getBaseURL from '../common/util/get-base-url.util';
import GitHubMember from '../common/interfaces/github-member.interface';
import MemberTable from '../components/member-table';
import Session from '../common/interfaces/session.interface';

interface Props {
  clubhouseMembers: ClubhouseMember[];
  gitHubMembers: GitHubMember[];
  session: Session;
}

export default class extends Component<Props> {
  static async getInitialProps(ctx: NextPageContext) {
    if (ctx.res) {
      const baseURL = getBaseURL(ctx);
      const { sid } = parseCookies(ctx);

      if (!sid) {
        ctx.res.writeHead(302, {
          Location: '/login',
        });
        ctx.res.end();
      }

      try {
        const sessionResponse = await axios.get<Session>(
          `${baseURL}/api/session`,
          {
            headers: ctx.req.headers,
          },
        );

        const gitHubMembers = await axios.get<GitHubMember[]>(
          `${baseURL}/api/github/members`,
          {
            headers: ctx.req.headers,
          },
        );

        const clubhouseMembers = await axios.get<ClubhouseMember[]>(
          `${baseURL}/api/clubhouse/members`,
          {
            headers: ctx.req.headers,
          },
        );

        return {
          session: sessionResponse.data,
          gitHubMembers: gitHubMembers.data,
          clubhouseMembers: clubhouseMembers.data,
        };
      } catch (error) {
        console.log(error);

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
