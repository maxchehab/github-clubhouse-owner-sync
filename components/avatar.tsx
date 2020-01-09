import { Pane, Avatar, Popover, Icon, Position, Paragraph } from 'evergreen-ui';

interface SessionAvatarProps {
  name: string;
  avatar: string;
}

export default ({ name, avatar }: SessionAvatarProps) => (
  <Popover
    position={Position.BOTTOM_RIGHT}
    content={() => (
      <Pane
        alignItems="center"
        display="flex"
        flexDirection="column"
        width={200}
      >
        <a href="/api/logout" style={{ textDecoration: 'none' }}>
          <Pane
            alignItems={'start'}
            display={'flex'}
            flexDirection={'column'}
            padding={15}
            width={200}
            borderBottom
          >
            <Paragraph size={500}>Logout</Paragraph>
          </Pane>
        </a>
      </Pane>
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
