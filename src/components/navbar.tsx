"use client";

import { useSession } from "@/lib/auth-client";
import { NavbarModule } from "@/modules/navbar.module";

export function Navbar() {
  const session = useSession();
  const isUserLoggedIn = !!session?.data?.user;

  return <NavbarModule isUserLoggedIn={isUserLoggedIn} />;
}
