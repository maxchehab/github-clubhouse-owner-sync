export default interface GitHubEvent {
  ref: string;
  head_commit: {
    id: string;
  };
  sender: {
    login: string;
  };
}
