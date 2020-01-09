import { query as q, Client } from 'faunadb';

export default async function createZeitTeams(client: Client) {
  await client.query(q.CreateCollection({ name: 'zeit_teams' }));
  await client.query(
    q.CreateIndex({
      name: 'zeit_team_by_id',
      source: q.Collection('zeit_teams'),
      terms: [{ field: ['data', 'id'] }],
      unique: true,
    }),
  );
}
