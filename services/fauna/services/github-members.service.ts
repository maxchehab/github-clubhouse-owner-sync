import { query as q, Client } from 'faunadb';
import { ulid } from 'ulid';

import GitHubMember from '../../../common/interfaces/github-member.interface';

const client = new Client({
  secret: process.env.FAUNA_SECRET as string,
});

export function bulkUpsertGitHubMembers(members: GitHubMember[]) {
  return client.query<GitHubMember[]>(
    q.Map(
      members,
      q.Lambda(
        'x',
        q.Let(
          {
            matchRef: q.Match(
              q.Index('github_members_by_id'),
              q.Select('id', q.Var('x')),
            ),
          },
          q.If(
            q.Exists(q.Var('matchRef')),
            q.Update(q.Select(['ref'], q.Get(q.Var('matchRef'))), {
              data: q.Var('x'),
            }),
            q.Create(q.Collection('github_members'), { data: q.Var('x') }),
          ),
        ),
      ),
    ),
  );
}
