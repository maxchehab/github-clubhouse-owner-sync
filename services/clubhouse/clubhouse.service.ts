import Axios from 'axios';

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
