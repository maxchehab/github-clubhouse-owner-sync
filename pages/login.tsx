import { Pane, Button, Heading } from 'evergreen-ui';

export default () => (
  <Pane
    alignItems={'center'}
    display={'flex'}
    height={'100vh'}
    justifyContent={'center'}
    width={'100vw'}
    flexDirection={'column'}
  >
    <Heading paddingBottom={40} size={900}>
      GitHub Clubhouse Owner Sync
    </Heading>
    <a href={'/api/github/login'}>
      <Button appearance={'primary'} height={40}>
        Login with GitHub
      </Button>
    </a>
  </Pane>
);
