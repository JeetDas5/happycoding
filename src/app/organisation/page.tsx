import {
  getUserOrganizations,
  getOrganizationDetails,
} from "@/actions/organisations.actions";
import { Building2 } from "lucide-react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { OrganisationClient } from "./organisation-client";
import { OrgWidget } from "@/app/dashboard/client-widgets";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { getOrgLeaderboard } from "@/actions/leaderboard.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function OrganisationPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const userId = session.user.id;
  const userOrgs = await getUserOrganizations(userId);

  if (userOrgs.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNavbar />
        <main className="container mx-auto px-4 pt-12 pb-8 flex flex-col items-center justify-center space-y-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">No Organization Found</h1>
            <p className="text-muted-foreground mb-8">
              You are not associated with any organization. Join one using an
              invite code or create your own to compete with your peers.
            </p>
            <Card className="text-left">
              <CardHeader>
                <CardTitle className="text-lg">Get Started</CardTitle>
              </CardHeader>
              <CardContent>
                <OrgWidget />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const selectedOrgId = searchParams.id || userOrgs[0].organization.id;
  const orgDetails = await getOrganizationDetails(selectedOrgId);
  const leaderboard = await getOrgLeaderboard(selectedOrgId);

  if (!orgDetails) {
    if (searchParams.id) {
      redirect("/organisation");
    }
    return redirect("/dashboard");
  }

  const isMember = userOrgs.some((o) => o.orgId === selectedOrgId);
  if (!isMember) {
    redirect("/organisation");
  }

  const leader = orgDetails.members.find((m) => m.role === "leader");
  const admins = orgDetails.members.filter((m) => m.role === "admin");

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <main className="container mx-auto px-4 pt-4 pb-8 space-y-6">
        <OrganisationClient
          org={orgDetails}
          userOrgs={userOrgs}
          leaderboard={leaderboard}
          currentUserId={userId}
          leader={leader}
          admins={admins}
        />
      </main>
    </div>
  );
}
