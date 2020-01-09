import { Table, SelectMenu, Button } from 'evergreen-ui';
import { useState } from 'react';

import ClubhouseMember from '../common/interfaces/clubhouse-member.interface';

interface ClubhouseMemberSelectorProps {
  clubhouseMembers: ClubhouseMember[];
}

export default ({ clubhouseMembers }: ClubhouseMemberSelectorProps) => {
  const [selected, setSelected] = useState<ClubhouseMember>();

  return (
    <Table.Cell display="flex" alignItems="center">
      <SelectMenu
        title="Select Clubhouse Account"
        options={clubhouseMembers.map(({ name, id }) => ({
          label: name,
          value: id,
        }))}
        selected={selected && selected.name}
        onSelect={item =>
          setSelected({ id: item.value as string, name: item.label })
        }
      >
        <Button>
          {(selected && selected.name) || 'Select Clubhouse Account'}
        </Button>
      </SelectMenu>
    </Table.Cell>
  );
};
