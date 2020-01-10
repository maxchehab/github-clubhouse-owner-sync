import { query as q, Client } from 'faunadb';

import { FaunaEntity } from '../../../common/interfaces/fauna-entity.interface';
import GitHubMember from '../../../common/interfaces/github-member.interface';

const client = new Client({
  secret: process.env.FAUNA_SECRET as string,
});

export async function bulkUpsertGitHubMembers(members: GitHubMember[]) {
  const response = await client.query<FaunaEntity<GitHubMember>[]>(
    q.Map(
      members,
      q.Lambda(
        'x',
        q.Let(
          {
            matchRef: q.Match(
              q.Index('github_member_by_id'),
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

  return response.map(({ data }) => data);
}

export async function updateGitHubMember(
  member: GitHubMember,
): Promise<GitHubMember> {
  const response = await client.query<FaunaEntity<GitHubMember>>(
    q.Let(
      {
        matchRef: q.Match(q.Index('github_member_by_id'), member.id),
      },
      q.If(
        q.Exists(q.Var('matchRef')),
        q.Update(q.Select(['ref'], q.Get(q.Var('matchRef'))), {
          data: member,
        }),
        q.Create(q.Collection('github_members'), { data: member }),
      ),
    ),
  );

  return response.data;
}

export async function findGitHubMemberByID(
  id: string,
): Promise<GitHubMember | null> {
  try {
    const { data } = await client.query<FaunaEntity<GitHubMember>>(
      q.Get(q.Match(q.Index('github_member_by_id'), id)),
    );

    return data;
  } catch (_error) {
    return null;
  }
}
