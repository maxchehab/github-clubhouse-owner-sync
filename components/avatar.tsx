import { Pane, Avatar, Popover, Icon, Position, Menu } from 'evergreen-ui';

interface SessionAvatarProps {
  name: string;
  avatar: string;
}

export default ({ name, avatar }: SessionAvatarProps) => (
  <Popover
    position={Position.BOTTOM_RIGHT}
    content={() => (
      <Menu>
        <Menu.Group>
          <a href="/api/logout" style={{ textDecoration: 'none' }}>
            <Menu.Item intent="danger">Logout</Menu.Item>
          </a>
        </Menu.Group>
      </Menu>
    )}
  >
    <Pane
      tabIndex={1}
      cursor={'pointer'}
      alignItems={'center'}
      display={'flex'}
    >
      <Avatar src={avatar} name={name} size={40} />
      <Icon marginLeft={5} icon={'caret-down'} size={16} />
    </Pane>
  </Popover>
);
