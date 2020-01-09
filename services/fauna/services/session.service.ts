import { query as q, Client } from 'faunadb';
import { ulid } from 'ulid';

import { FaunaEntity } from '../../../common/interfaces/fauna-entity.interface';
import Session from '../../../common/interfaces/session.interface';

const client = new Client({
  secret: process.env.FAUNA_SECRET as string,
});

export async function createSession(
  name: string,
  token: string,
  avatar: string,
): Promise<Session> {
  const expires_at = new Date();
  expires_at.setDate(new Date().getDate() + 1);

  const session = {
    id: `sess_${ulid()}`,
    expires_at: expires_at.getTime(),
    name,
    token,
    avatar,
  };

  await client.query(
    q.Create(q.Collection('sessions'), {
      data: session,
    }),
  );

  return session;
}

export async function findSessionByID(id: string): Promise<Session | null> {
  try {
    const { data } = await client.query<FaunaEntity<Session>>(
      q.Get(q.Match(q.Index('session_by_id'), id)),
    );

    return data;
  } catch (_error) {
    return null;
  }
}

export async function deleteSessionByID(id: string) {
  try {
    return await client.query(
      q.Delete(q.Select('ref', q.Get(q.Match(q.Index('session_by_id'), id)))),
    );
  } catch (_error) {
    return null;
  }
}
