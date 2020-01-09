import { Table, Avatar, Text } from 'evergreen-ui';
import { useState } from 'react';

import ClubhouseMember from '../common/interfaces/clubhouse-member.interface';
import ClubhouseMemberSelector from './clubhouse-member-selector';
import GitHubMember from '../common/interfaces/github-member.interface';

interface MemberTableProps {
  clubhouseMembers: ClubhouseMember[];
  gitHubMembers: GitHubMember[];
}

export default ({ gitHubMembers, clubhouseMembers }: MemberTableProps) => {
  const [members, setMembers] = useState(gitHubMembers);

  return (
    <Table border width={'40vw'}>
      <Table.Head>
        <Table.SearchHeaderCell
          onChange={value =>
            setMembers(
              gitHubMembers.filter(({ id }) =>
                id.toLowerCase().includes(value.toLowerCase()),
              ),
            )
          }
          placeholder="Search by GitHub username..."
        />
        <Table.TextHeaderCell>Clubhouse Account</Table.TextHeaderCell>
      </Table.Head>
      <Table.Body height={'70vh'}>
        {members.map(({ avatar, id }) => (
          <Table.Row key={id}>
            <Table.Cell display="flex" alignItems="center">
              <Avatar name={id} src={avatar} />
              <Text marginLeft={8} size={300} fontWeight={500}>
                {id}
              </Text>
            </Table.Cell>

            <ClubhouseMemberSelector clubhouseMembers={clubhouseMembers} />
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
