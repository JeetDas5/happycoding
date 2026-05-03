export enum ProblemType {
  PROGRAMMING = "PROGRAMMING",
  QUESTION = "QUESTION",
}

export interface CodeforcesProblem {
  contestId?: number;
  index: string;
  name: string;
  type: ProblemType;
  points?: number;
  rating?: number;
  tags: string[];
}

export interface CodeforcesSubmission {
  id: number;
  contestId: number;
  creationTimeSeconds: number;
  relativeTimeSeconds: number;
  problem: CodeforcesProblem;
  author: {
    contestId: number;
    members: Array<{
      handle: string;
    }>;
    participantType: string;
    ghost: boolean;
    room: number;
  };
  programmingLanguage: string;
  verdict: string;
  testset: string;
  passedTestCount: number;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
}

export interface CodeforcesProblemsetResponse {
  status: string;
  result: {
    problems: CodeforcesProblem[];
    problemStatistics: Array<{
      contestId: number;
      index: string;
      solvedCount: number;
    }>;
  };
}
