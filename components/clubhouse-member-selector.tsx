import { Table, Combobox, toaster } from 'evergreen-ui';

import ClubhouseMember from '../common/interfaces/clubhouse-member.interface';
import GitHubMember from '../common/interfaces/github-member.interface';
import Axios from 'axios';

interface ClubhouseMemberSelectorProps {
  clubhouseMembers: ClubhouseMember[];
  gitHubMember: GitHubMember;
}

async function selectClubhouseMember(
  gitHubMember: GitHubMember,
  clubhouseMember: ClubhouseMember,
) {
  gitHubMember.clubhouseMember = clubhouseMember;

  try {
    await Axios.patch(`/api/github/members`, gitHubMember);

    toaster.success(
      `Associated ${gitHubMember.id} with ${clubhouseMember.name}`,
    );
  } catch (error) {
    toaster.danger(
      `Failed to associate ${gitHubMember.id} with ${clubhouseMember.name}`,
    );
  }
}

export default ({
  clubhouseMembers,
  gitHubMember,
}: ClubhouseMemberSelectorProps) => {
  return (
    <Table.Cell display="flex" alignItems="center">
      <Combobox
        openOnFocus
        initialSelectedItem={gitHubMember.clubhouseMember}
        items={clubhouseMembers}
        itemToString={(member?: ClubhouseMember) => (member ? member.name : '')}
        onChange={(clubhouseMember: ClubhouseMember) =>
          selectClubhouseMember(gitHubMember, clubhouseMember)
        }
        placeholder="Select a Clubhouse Account"
      />
    </Table.Cell>
  );
};
