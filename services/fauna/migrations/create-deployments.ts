import { query as q, Client } from 'faunadb';

export default async function createDeployments(client: Client) {
  await client.query(q.CreateCollection({ name: 'deployments' }));
}
