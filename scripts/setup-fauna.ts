import setupFauna from '../services/fauna/utils/setup.util';

(async () => {
  try {
    await setupFauna();
  } catch (e) {
    console.error(e);
  }
})();
