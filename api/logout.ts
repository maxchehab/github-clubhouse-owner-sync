import { NextApiResponse, NextApiRequest } from 'next';
import withSession from '../common/util/with-session.util';

import lambda from '../common/util/lambda.util';
import Session from '../common/interfaces/session.interface';
import { deleteSessionByID } from '../services/fauna/services/session.service';

export default lambda(
  withSession(
    async (_req: NextApiRequest, res: NextApiResponse, session: Session) => {
      await deleteSessionByID(session.id);

      res.writeHead(302, {
        'set-cookie': `sid=; Expires=${new Date(0).toUTCString()};`,
        'location': '/login',
      });
      res.end();
    },
  ),
);
