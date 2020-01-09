import { query as q, Client } from 'faunadb';

export default async function createClubhouseMembers(client: Client) {
  await client.query(q.CreateCollection({ name: 'clubhouse_members' }));
  await client.query(
    q.CreateIndex({
      name: 'clubhouse_members_by_id',
      source: q.Collection('clubhouse_members'),
      terms: [{ field: ['data', 'id'] }],
      unique: true,
    }),
  );
}
