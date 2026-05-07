type Role = "leader" | "admin" | "member";

type User = {
  id: string;
  name: string;
  email: string;
  password?: string;

  cfHandle: string | null;
  cfVerified: boolean | null;
  cfVerificationStartedAt: Date | null;

  lastSolvedDate: Date | null;
  points: number | null;
  streak: number | null;
  createdAt?: Date | null;
};

type LeaderBoardData = {
  id: string;
  name: string;
  points: number | null;
  streak: number | null;
  orgId?: string;
};

type OrgLeaderBoardData = {
  leaderboard: LeaderBoardData[];
  orgId: string;
  orgName: string;
};

type Problem = {
  contestId?: number;
  index: string;
  name: string;
  type?: string;
  points?: number;
  rating?: number;
  tags?: string[];
};

type Submission = {
  id: string;
  userId: string;
  problemId: string;
  status: string;
  verdict: string | null;
  cfSubmissionId: number | null;
  submittedAt: Date | null;
  pointsAwarded: number | null;
  createdAt?: Date | null;
};

type Organization = {
  id: string;
  name: string;
  inviteCode: string;
  createdBy: string;
  createdAt: Date | null;
};

type MembershipWithOrg = {
  id: string;
  userId: string;
  orgId: string;
  role: Role | string | null;
  joinedAt: Date | null;
  organization: Organization;
};
