import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

import { findSessionByID } from '../../services/fauna/services/session.service';
import { HttpException } from '../exceptions/http.exception';
import Session from '../interfaces/session.interface';

type Route = (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
) => Promise<void>;

type SigParsingError = () => void;
export type SigParser = (req: NextApiRequest, err: SigParsingError) => string;

export default function withSession(route: Route) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const now = new Date().getTime();

    const { sid } = cookie.parse((req.headers.cookie || '') as string);

    if (!sid) {
      throw new HttpException(403, 'Invalid session');
    }

    const session = await findSessionByID(sid);

    if (!session || session.expires_at < now) {
      throw new HttpException(403, 'Invalid session');
    }

    await route(req, res, session);
  };
}
