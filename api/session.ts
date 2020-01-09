import { NextApiResponse, NextApiRequest } from 'next';
import withSession from '../common/util/with-session.util';

import lambda from '../common/util/lambda.util';
import Session from '../common/interfaces/session.interface';

export default lambda(
  withSession(
    async (_req: NextApiRequest, res: NextApiResponse, session: Session) => {
      delete session.token;

      return res.json(session);
    },
  ),
);
