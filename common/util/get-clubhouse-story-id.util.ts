export default function getClubhouseStoryID(branch: string) {
  const matches = branch.match(/^(.*)\/ch([0-9]*)\//);

  if (matches) {
    return matches[2];
  }

  return null;
}
