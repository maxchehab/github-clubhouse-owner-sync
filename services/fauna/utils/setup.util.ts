import { query as q, Client } from 'faunadb';

import createSessions from '../migrations/create-sessions';
import sleep from '../../../common/util/sleep.util';

type Migration = (client: Client) => Promise<void>;

interface MigrationOptions {
  dropSchema?: boolean;
}

const client = new Client({
  secret: process.env.FAUNA_SECRET as string,
});

const migrations: Migration[] = [createSessions];

export default async function setupFauna(options: MigrationOptions = {}) {
  if (options.dropSchema) {
    await client.query(
      q.Map(q.Paginate(q.Collections()), q.Lambda('x', q.Delete(q.Var('x')))),
    );

    console.log('Dropped all collections. Sleeping for 60s to clear cache.');

    await sleep(60000);
  }

  const exists: boolean = await client.query(
    q.Exists(q.Collection('migrations')),
  );

  if (!exists) {
    console.log(`Collection 'migrations' does not exist, creating.`);

    await client.query(q.CreateCollection({ name: 'migrations' }));
    await client.query(
      q.CreateIndex({
        name: 'migration_by_name',
        source: q.Collection('migrations'),
        terms: [{ field: ['data', 'name'] }],
        unique: true,
      }),
    );

    console.log(`Created collection 'migrations'.`);
  }

  for (const migration of migrations) {
    const name = migration.name;

    const migrationExists = await client.query(
      q.Exists(q.Match(q.Index('migration_by_name'), name)),
    );

    if (!migrationExists) {
      console.log(`Running migration '${name}'.`);
      await migration(client);

      await client.query(
        q.Create(q.Collection('migrations'), {
          data: { name },
        }),
      );

      console.log(`Successfully ran migration '${name}'.`);
    }
  }
}
