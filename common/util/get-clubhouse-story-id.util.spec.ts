import getClubhouseStoryID from './get-clubhouse-story-id.util';

describe('getClubhouseStoryID', () => {
  const tests = [
    {
      description: 'with valid clubhouse branch',
      branch: 'john-smith/ch1161/add-search-to-connections-table',
      result: '1161',
    },
    {
      description: 'with single digit story ID',
      branch: 'john-smith/ch0/add-search-to-connections-table',
      result: '0',
    },
    {
      description: 'with invalid story id',
      branch: 'john-smith/1161/add-search-to-connections-table',
      result: null,
    },
    {
      description: 'with invalid branch',
      branch: 'not-a-valid-branch',
      result: null,
    },
  ];

  for (const test of tests) {
    describe(test.description, () => {
      const itDesc = test.result ? 'it returns story id' : 'it returns null';

      it(itDesc, () => {
        const id = getClubhouseStoryID(test.branch);

        expect(id).toEqual(test.result);
      });
    });
  }
});
