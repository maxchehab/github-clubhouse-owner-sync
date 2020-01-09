import { query as q, Client, ExprVal } from 'faunadb';
import ZeitTeam from '../../../common/interfaces/zeit-team.interface';
import { FaunaEntity } from '../../../common/interfaces/fauna-entity.interface';

const client = new Client({
  secret: process.env.FAUNA_SECRET as string,
});

export function createZeitTeam(data: Partial<ZeitTeam>) {
  return client.query(q.Create(q.Collection('zeit_teams'), { data }));
}

export function updateZeitTeam(ref: ExprVal, data: Partial<ZeitTeam>) {
  return client.query(q.Update(ref, { data }));
}

export async function findZeitTeamById(
  id: string,
): Promise<FaunaEntity<ZeitTeam> | null> {
  try {
    return await client.query(q.Get(q.Match(q.Index('zeit_team_by_id'), id)));
  } catch (_error) {
    return null;
  }
}
