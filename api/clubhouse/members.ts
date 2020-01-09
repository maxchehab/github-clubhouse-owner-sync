import { NextApiResponse, NextApiRequest } from 'next';
import withSession from '../../common/util/with-session.util';

import { bulkUpsertClubhouseMembers } from '../../services/fauna/services/clubhouse-members.service';
import { getClubhouseMembers } from '../../services/clubhouse/clubhouse.service';
import ClubhouseMember from '../../common/interfaces/clubhouse-member.interface';
import lambda from '../../common/util/lambda.util';

export default lambda(
  withSession(async (_req: NextApiRequest, res: NextApiResponse) => {
    const members: ClubhouseMember[] = (
      await getClubhouseMembers(process.env.CLUBHOUSE_SECRET as string)
    ).map(({ profile: { name }, id }) => ({
      id,
      name,
    }));

    await bulkUpsertClubhouseMembers(members);

    return res.json(members);
  }),
);
