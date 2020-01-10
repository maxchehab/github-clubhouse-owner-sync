import withHMAC, { SigParser } from '../../common/util/with-hmac.util';

import { findGitHubMemberByID } from '../../services/fauna/services/github-members.service';
import { updateClubhouseStoryOwner } from '../../services/clubhouse/clubhouse.service';
import getClubhouseStoryID from '../../common/util/get-clubhouse-story-id.util';
import GitHubEvent from '../../common/interfaces/github-event.interface';
import lambda from '../../common/util/lambda.util';

const SECRET = process.env.GITHUB_ORG_HOOK_SECRET as string;

const parser: SigParser = (req, err) => {
  const sig = req.headers['x-hub-signature'] as string;

  if (!sig) {
    err();
  }

  return sig.substring('sha1='.length);
};

export default lambda(
  withHMAC(SECRET, parser, async (req, res) => {
    const event = req.body as GitHubEvent;
    const storyID = getClubhouseStoryID(event.ref);

    if (!storyID) {
      return res.status(200).json({ message: 'Invalid story ID' });
    }

    const member = await findGitHubMemberByID(event.sender.login);

    if (!member) {
      return res.status(200).json({ message: 'Invalid GitHub member' });
    }

    if (!member.clubhouseMember) {
      return res
        .status(200)
        .json({ message: 'No Clubhouse Account linked to GitHub member' });
    }

    await updateClubhouseStoryOwner(
      storyID,
      member.clubhouseMember,
      process.env.CLUBHOUSE_SECRET as string,
    );

    return res.status(200).json({ message: 'Updated story owner' });
  }),
);
