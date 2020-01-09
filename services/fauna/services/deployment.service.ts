import { query as q, Client, ExprVal } from 'faunadb';

import { FaunaEntity } from '../../../common/interfaces/fauna-entity.interface';
import Deployment from '../../../common/interfaces/deployment.interface';

const client = new Client({
  secret: process.env.FAUNA_SECRET as string,
});

export function createDeployment(data: Partial<Deployment>) {
  return client.query(q.Create(q.Collection('deployments'), { data }));
}

export function updateDeployment(ref: ExprVal, data: Partial<Deployment>) {
  return client.query(q.Update(ref, { data }));
}

export async function findDeploymentByCommit(
  commit: string,
): Promise<FaunaEntity<Deployment> | null> {
  try {
    return await client.query(
      q.Get(q.Match(q.Index('deployment_by_commit'), commit)),
    );
  } catch (_error) {
    return null;
  }
}
