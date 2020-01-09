import { Table, Combobox, toaster } from 'evergreen-ui';

import ClubhouseMember from '../common/interfaces/clubhouse-member.interface';
import GitHubMember from '../common/interfaces/github-member.interface';

interface ClubhouseMemberSelectorProps {
  clubhouseMembers: ClubhouseMember[];
  gitHubMember: GitHubMember;
}

function selectClubhouseMember(
  gitHubMember: GitHubMember,
  clubhouseMember: ClubhouseMember,
) {
  toaster.success(
    `Associated ${gitHubMember.id} with ${clubhouseMember.name}!`,
  );
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
