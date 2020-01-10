import Axios from 'axios';
import ClubhouseMember from '../../common/interfaces/clubhouse-member.interface';

interface ClubHouseMember {
  id: string;
  profile: {
    name: string;
  };
}

export async function getClubhouseMembers(
  token: string,
): Promise<ClubHouseMember[]> {
  const { data } = await Axios.get<ClubHouseMember[]>(
    'https://api.clubhouse.io/api/v3/members',
    {
      params: { token },
    },
  );

  return data;
}

export async function updateClubhouseStoryOwner(
  storyID: string,
  owner: ClubhouseMember,
  token: string,
) {
  const { data } = await Axios.put(
    `https://api.clubhouse.io/api/v3/stories/${storyID}`,
    {
      owner_ids: [owner.id],
    },
    {
      params: { token },
    },
  );

  return data;
}
