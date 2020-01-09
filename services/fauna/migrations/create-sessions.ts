import { query as q, Client } from 'faunadb';

export default async function createSessions(client: Client) {
  await client.query(q.CreateCollection({ name: 'sessions' }));
  await client.query(
    q.CreateIndex({
      name: 'session_by_id',
      source: q.Collection('sessions'),
      terms: [{ field: ['data', 'id'] }],
      unique: true,
    }),
  );
}
