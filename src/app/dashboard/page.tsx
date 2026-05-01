// display name and email of logged in user
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-4">
      <div className="w-full max-w-md bg-[#1a1a1a] border border-[#333] rounded-2xl p-8 shadow-2xl text-center">
        <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Welcome, {session.user.name}!
        </h1>
        <p className="text-gray-400 mt-2">{session.user.email}</p>
      </div>
    </div>
  );
}
