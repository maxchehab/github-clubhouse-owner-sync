export default interface ZeitEvent {
  type: 'deployment' | 'deployment-ready';
  createdAt: number;
  payload: {
    deployment: {
      name: string;
      meta: {
        githubCommitSha: string;
        commit: string;
      };
    };
  };
}
