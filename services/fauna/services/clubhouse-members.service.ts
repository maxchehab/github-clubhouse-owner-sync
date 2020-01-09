import { query as q, Client } from 'faunadb';

import ClubhouseMember from '../../../common/interfaces/clubhouse-member.interface';

const client = new Client({
  secret: process.env.FAUNA_SECRET as string,
});

export function bulkUpsertClubhouseMembers(members: ClubhouseMember[]) {
  return client.query<ClubhouseMember[]>(
    q.Map(
      members,
      q.Lambda(
        'x',
        q.Let(
          {
            matchRef: q.Match(
              q.Index('clubhouse_member_by_id'),
              q.Select('id', q.Var('x')),
            ),
          },
          q.If(
            q.Exists(q.Var('matchRef')),
            q.Update(q.Select(['ref'], q.Get(q.Var('matchRef'))), {
              data: q.Var('x'),
            }),
            q.Create(q.Collection('clubhouse_members'), {
              data: q.Var('x'),
            }),
          ),
        ),
      ),
    ),
  );
}
