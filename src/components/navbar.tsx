"use client";

import { useJwtSession } from "@/lib/use-jwt-session";
import { NavbarModule } from "@/modules/navbar.module";

export function Navbar() {
  const session = useJwtSession();

  const isUserLoggedIn = !!session?.data?.user;

  return <NavbarModule isUserLoggedIn={isUserLoggedIn} />;
}
