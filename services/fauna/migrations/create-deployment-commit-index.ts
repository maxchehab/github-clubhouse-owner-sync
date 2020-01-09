import { query as q, Client } from 'faunadb';

export default async function createDeploymentCommitIndex(client: Client) {
  await client.query(
    q.CreateIndex({
      name: 'deployment_by_commit',
      source: q.Collection('deployments'),
      terms: [{ field: ['data', 'commit'] }],
      unique: true,
    }),
  );
}
