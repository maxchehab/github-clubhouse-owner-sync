import setupFauna from '../services/fauna/utils/setup.util';

function getAction() {
  const arg = process.argv.pop();

  switch (arg) {
    case 'help': {
      return 'help';
    }

    case '-h': {
      return 'help';
    }

    case '-d': {
      return 'drop';
    }

    case 'drop': {
      return 'drop';
    }

    default: {
      return undefined;
    }
  }
}

const action = getAction();

if (action === 'help') {
  console.log(
    `\t$ yarn fauna:setup [drop|-d]\tdrop database before running migrations\n\t$ yarn fauna:setup [help|-h]\tdisplay help`,
  );
  process.exit();
}

(async () => {
  try {
    await setupFauna({ dropSchema: action === 'drop' });
  } catch (e) {
    console.error(e);
  }
})();
