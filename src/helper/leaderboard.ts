import { type users } from "@/db/schema";

export function attachRank(usersList: (typeof users)[]) {
  return usersList.map((user, index) => ({
    rank: index + 1,
    ...user,
  }));
}
