import { query as q, Client } from 'faunadb';

export default async function createGitHubMembers(client: Client) {
  await client.query(q.CreateCollection({ name: 'github_members' }));
  await client.query(
    q.CreateIndex({
      name: 'github_members_by_id',
      source: q.Collection('github_members'),
      terms: [{ field: ['data', 'id'] }],
      unique: true,
    }),
  );
}
