/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Trophy,
  Users,
  Search,
  ShieldCheck,
  Flame,
  ArrowRightLeft,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LeaveOrgButton, CopyButton } from "@/app/dashboard/client-widgets";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface OrganisationClientProps {
  org: any;
  userOrgs: any[];
  leaderboard: any[];
  currentUserId: string;
  leader: any;
  admins: any[];
}

export function OrganisationClient({
  org,
  userOrgs,
  leaderboard,
  currentUserId,
  leader,
  admins,
}: OrganisationClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = org.members.filter(
    (member: any) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.cfHandle &&
        member.cfHandle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">{org.name}</h1>
            <div className="flex items-center gap-1 text-xs font-mono bg-muted px-2 py-1 rounded-md border">
              <span className="text-muted-foreground">Code:</span>{" "}
              {org.inviteCode}
              <CopyButton text={org.inviteCode} className="cursor-pointer" />
            </div>
          </div>
          <p className="text-muted-foreground flex items-center gap-2">
            <Users className="w-4 h-4" />
            {org.members.length} members
          </p>
        </div>

        <div className="flex items-center gap-2">
          {userOrgs.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" className="gap-2">
                  <ArrowRightLeft className="w-4 h-4" />
                  Switch Organization
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {userOrgs.map((uo) => (
                  <Link key={uo.orgId} href={`/organisation?id=${uo.orgId}`}>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      disabled={uo.orgId === org.id}
                    >
                      {uo.organization.name}
                      {uo.orgId === org.id && (
                        <span className="ml-auto text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <LeaveOrgButton orgId={org.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card className="pb-3">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Organization Roles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Leader
                </p>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    {leader?.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {leader?.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {leader?.cfHandle || "No handle"}
                    </p>
                  </div>
                </div>
              </div>

              {admins.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Admins
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {admins.map((admin) => (
                      <div
                        key={admin.id}
                        className="flex items-center gap-2 p-2 rounded-lg border bg-muted/30"
                      >
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-[10px]">
                          {admin.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-xs font-medium truncate">
                          {admin.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="pb-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Top Performers
              </CardTitle>
              <CardDescription>Highest points in {org.name}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {leaderboard.slice(0, 5).map((u, idx) => (
                  <div
                    key={u.id}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3",
                      u.id === currentUserId && "bg-primary/5"
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm font-bold w-6 text-center",
                        idx === 0
                          ? "text-yellow-500"
                          : idx === 1
                          ? "text-zinc-400"
                          : idx === 2
                          ? "text-orange-500"
                          : "text-muted-foreground"
                      )}
                    >
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{u.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-400" />
                        {u.streak ?? 0} day streak
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{u.points ?? 0} pts</p>
                    </div>
                  </div>
                ))}
                {leaderboard.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No verified members yet.
                  </div>
                )}
              </div>
              {leaderboard.length > 5 && (
                <div className="p-3 text-center border-t">
                  <p className="text-xs text-muted-foreground">
                    And {leaderboard.length - 5} more...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search members by name or CF handle..."
                className="pl-9 h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-lg">All Members</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[200px]">Member</TableHead>
                      <TableHead className="text-center">Points</TableHead>
                      <TableHead className="text-center">Streak</TableHead>
                      <TableHead className="text-center">CF Account</TableHead>
                      <TableHead className="text-right">Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member: any) => (
                      <TableRow
                        key={member.id}
                        className={cn(
                          member.id === currentUserId &&
                            "bg-primary/5 hover:bg-primary/10"
                        )}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-xs shrink-0">
                              {member.name?.[0]?.toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">
                                {member.name}{" "}
                                {member.id === currentUserId && (
                                  <span className="text-[10px] text-primary">
                                    (you)
                                  </span>
                                )}
                              </p>
                              <p className="text-[10px] text-muted-foreground truncate">
                                {member.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-bold">
                          {member.points ?? 0}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Flame
                              className={cn(
                                "w-4 h-4",
                                (member.streak ?? 0) > 0
                                  ? "text-orange-500"
                                  : "text-muted-foreground opacity-30"
                              )}
                            />
                            <span className="text-sm font-medium">
                              {member.streak ?? 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {member.cfHandle ? (
                            <Link
                              href={`https://codeforces.com/profile/${member.cfHandle}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors group"
                              title={`View ${member.cfHandle} on Codeforces`}
                            >
                              <div className="relative w-5 h-5 grayscale group-hover:grayscale-0 transition-all">
                                <Image
                                  src="https://codeforces.org/s/0/favicon-32x32.png"
                                  alt="Codeforces"
                                  width={20}
                                  height={20}
                                  className="rounded-sm"
                                />
                              </div>
                            </Link>
                          ) : (
                            <span className="text-[10px] text-muted-foreground italic">
                              Not linked
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={cn(
                              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                              member.role === "leader"
                                ? "bg-primary/10 text-primary border-primary/20"
                                : member.role === "admin"
                                ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                : "bg-muted text-muted-foreground border-transparent"
                            )}
                          >
                            {member.role}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredMembers.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-32 text-center text-muted-foreground"
                        >
                          No members found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
