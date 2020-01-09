import ClubhouseMember from './clubhouse-member.interface';

export default interface GitHubMember {
  avatar: string;
  id: string;
  clubhouseMember?: ClubhouseMember;
}
