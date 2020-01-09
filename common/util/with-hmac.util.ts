import { NextApiRequest, NextApiResponse } from 'next';

import { HttpException } from '../exceptions/http.exception';
import generateHMAC from './generate-hmac.util';

type Route = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

type SigParsingError = () => void;

export type SigParser = (req: NextApiRequest, err: SigParsingError) => string;

export default function withHMAC(
  secret: string,
  header: string | SigParser,
  route: Route,
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    let sig: string;

    if (typeof header === 'function') {
      sig = header(req, () => {
        throw new HttpException(403, 'Invalid HMAC');
      });
    } else {
      sig = req.headers[header.toLowerCase()] as string;
    }

    if (!sig || sig.length === 0) {
      throw new HttpException(403, 'Invalid HMAC');
    }

    const hmac = generateHMAC(JSON.stringify(req.body), secret);

    if (sig !== hmac) {
      throw new HttpException(403, 'Invalid HMAC');
    }

    await route(req, res);
  };
}
